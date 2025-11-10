import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Camera, Mic, MicOff, Send, Sparkles, RotateCcw } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'signy';
  text: string;
  sign?: string;
  timestamp: Date;
}

const conversationScenarios = [
  {
    id: 'greeting',
    title: 'Introducing Yourself',
    icon: '👋',
    description: 'Practice basic introductions'
  },
  {
    id: 'ordering',
    title: 'Ordering Food',
    icon: '🍽️',
    description: 'Learn to order at restaurants'
  },
  {
    id: 'shopping',
    title: 'Shopping',
    icon: '🛍️',
    description: 'Ask for items and prices'
  },
  {
    id: 'directions',
    title: 'Asking Directions',
    icon: '🗺️',
    description: 'Navigate and ask for help'
  },
  {
    id: 'meeting',
    title: 'Office Meeting',
    icon: '💼',
    description: 'Professional workplace conversation'
  },
];

export function SignyPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'signy',
      text: "Hi! I'm Signy, your AI conversation buddy. I understand sign language and can help you practice! Choose a scenario or start signing.",
      timestamp: new Date()
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleStartScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const scenario = conversationScenarios.find(s => s.id === scenarioId);
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'signy',
      text: `Great! Let's practice "${scenario?.title}". I'll start with a question. Show me your response using sign language!`,
      timestamp: new Date()
    }]);

    // Simulate Signy asking a question
    setTimeout(() => {
      const questions = {
        greeting: "What is your name?",
        ordering: "What would you like to order?",
        shopping: "Can I help you find something?",
        directions: "Where are you trying to go?",
        meeting: "What's your role in this project?"
      };

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'signy',
        text: questions[scenarioId as keyof typeof questions] || "How can I help you?",
        sign: '🤟',
        timestamp: new Date()
      }]);
    }, 1500);
  };

  const handleToggleCamera = () => {
    setShowCamera(!showCamera);
    setIsListening(!isListening);
  };

  const handleSendSign = () => {
    // Simulate user signing
    const userResponses = [
      "My name is Alex",
      "I'd like a coffee, please",
      "I'm looking for a blue shirt",
      "Where is the nearest metro station?",
      "I'm the project manager"
    ];

    const randomResponse = userResponses[Math.floor(Math.random() * userResponses.length)];

    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: randomResponse,
      sign: '✋',
      timestamp: new Date()
    }]);

    // Signy responds
    setTimeout(() => {
      const signyResponses = [
        "Nice to meet you! That's a beautiful name.",
        "Great choice! One coffee coming right up.",
        "Perfect! Let me show you where our blue shirts are.",
        "The metro is two blocks north. Let me show you the sign for 'north'.",
        "Excellent! What are your main responsibilities?"
      ];

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'signy',
        text: signyResponses[Math.floor(Math.random() * signyResponses.length)],
        sign: '🤟',
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const handleReset = () => {
    setMessages([{
      id: 1,
      type: 'signy',
      text: "Hi! I'm Signy, your AI conversation buddy. I understand sign language and can help you practice! Choose a scenario or start signing.",
      timestamp: new Date()
    }]);
    setSelectedScenario(null);
    setIsListening(false);
    setShowCamera(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)] max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      {/* Header */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
              >
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-white" />
              </motion.div>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-secondary rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl">Signy</h2>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">AI Conversation Buddy</p>
            </div>
          </div>
          <Button
            onClick={handleReset}
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
          >
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </Button>
        </div>
      </div>

      {/* Scenarios (if no scenario selected) */}
      {!selectedScenario && messages.length === 1 && (
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 md:space-y-4">
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Choose a conversation scenario:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {conversationScenarios.map((scenario) => (
              <motion.button
                key={scenario.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStartScenario(scenario.id)}
                className="bg-card rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-border hover:border-primary/50 transition-all text-left"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">{scenario.icon}</div>
                <h3 className="text-xs sm:text-sm md:text-base mb-1">{scenario.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{scenario.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-5">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'signy' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm md:text-base text-muted-foreground">Signy</span>
                  </div>
                )}
                <div
                  className={`rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border'
                  }`}
                >
                  {message.sign && (
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-3 text-center">{message.sign}</div>
                  )}
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg">{message.text}</p>
                </div>
                {message.type === 'user' && (
                  <div className="flex items-center gap-2 justify-end mt-1">
                    <span className="text-xs sm:text-sm md:text-base text-muted-foreground">You</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Camera View (when active) */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-black overflow-hidden"
          >
            <div className="h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 flex items-center justify-center relative">
              <div className="text-white/50 text-center">
                <Camera className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 mx-auto mb-2 animate-pulse" />
                <p className="text-xs sm:text-sm md:text-base lg:text-lg">Camera is watching for signs...</p>
              </div>
              {isListening && (
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5
                  }}
                  className="absolute inset-0 border-2 sm:border-4 md:border-4 border-primary rounded-lg"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Controls */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-t border-border bg-card space-y-2 sm:space-y-3">
        {selectedScenario && (
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-1 sm:py-1.5">
            {conversationScenarios.find(s => s.id === selectedScenario)?.title}
          </Badge>
        )}
        <div className="flex gap-2 sm:gap-3 md:gap-4">
          <Button
            onClick={handleToggleCamera}
            variant={isListening ? "default" : "outline"}
            className={`flex-1 rounded-xl h-10 sm:h-12 md:h-14 lg:h-16 text-xs sm:text-sm md:text-base lg:text-lg ${
              isListening ? 'bg-primary hover:bg-primary/90' : ''
            }`}
          >
            <Camera className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 mr-1.5 sm:mr-2 md:mr-3" />
            <span className="hidden xs:inline">{isListening ? 'Stop Camera' : 'Start Camera'}</span>
            <span className="inline xs:hidden">{isListening ? 'Stop' : 'Start'}</span>
          </Button>
          <Button
            onClick={handleSendSign}
            disabled={!isListening}
            className="rounded-xl h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 bg-secondary hover:bg-secondary/90"
            size="icon"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
          </Button>
        </div>
        
        <p className="text-xs sm:text-sm md:text-base text-center text-muted-foreground">
          Use your camera to sign, or type a message
        </p>
      </div>
    </div>
  );
}
