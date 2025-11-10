import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-33071243/health", (c) => {
  return c.json({ status: "ok" });
});

// Bhashini translation endpoint
app.post("/make-server-33071243/translate", async (c) => {
  try {
    const bhashiniApiKey = Deno.env.get('BHASHINI_API_KEY');
    
    if (!bhashiniApiKey) {
      return c.json({ 
        error: 'Bhashini API key not configured',
        message: 'Please configure BHASHINI_API_KEY environment variable'
      }, 400);
    }

    const { text, sourceLang, targetLang } = await c.req.json();

    if (!text || !sourceLang || !targetLang) {
      return c.json({ 
        error: 'Missing required parameters',
        message: 'text, sourceLang, and targetLang are required'
      }, 400);
    }

    // Bhashini API endpoint
    const bhashiniUrl = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';
    
    // First, get the pipeline configuration
    const pipelineResponse = await fetch(bhashiniUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'userID': bhashiniApiKey,
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: 'translation',
            config: {
              language: {
                sourceLanguage: sourceLang,
                targetLanguage: targetLang,
              },
            },
          },
        ],
        pipelineRequestConfig: {
          pipelineId: '64392f96daac500b55c543cd',
        },
      }),
    });

    if (!pipelineResponse.ok) {
      console.log('Bhashini pipeline error:', await pipelineResponse.text());
      return c.json({ 
        error: 'Failed to get translation pipeline',
        message: 'Bhashini API returned an error'
      }, 500);
    }

    const pipelineData = await pipelineResponse.json();
    
    // Extract the translation service endpoint
    const translationConfig = pipelineData.pipelineResponseConfig?.[0];
    if (!translationConfig) {
      return c.json({ 
        error: 'Invalid pipeline response',
        message: 'No translation service found'
      }, 500);
    }

    const translationUrl = translationConfig.config[0].serviceId;
    
    // Perform the actual translation
    const translateResponse = await fetch(translationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: 'translation',
            config: {
              language: {
                sourceLanguage: sourceLang,
                targetLanguage: targetLang,
              },
              serviceId: translationConfig.config[0].serviceId,
            },
          },
        ],
        inputData: {
          input: [{ source: text }],
        },
      }),
    });

    if (!translateResponse.ok) {
      console.log('Bhashini translation error:', await translateResponse.text());
      return c.json({ 
        error: 'Translation failed',
        message: 'Failed to translate text'
      }, 500);
    }

    const translateData = await translateResponse.json();
    const translatedText = translateData.pipelineResponse?.[0]?.output?.[0]?.target;

    if (!translatedText) {
      return c.json({ 
        error: 'No translation result',
        message: 'Translation returned empty result'
      }, 500);
    }

    return c.json({ 
      translatedText,
      sourceLang,
      targetLang,
    });

  } catch (error) {
    console.error('Translation error:', error);
    return c.json({ 
      error: 'Translation failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, 500);
  }
});

Deno.serve(app.fetch);