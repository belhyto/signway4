$translations = @{
    'hi' = @{
        'common.back' = 'पीछे'
        'common.continue' = 'जारी रखें'
        'home.streak' = 'स्ट्रीक'
        'home.days' = 'दिन'
        'home.totalXP' = 'कुल XP'
        'home.points' = 'अंक'
        'home.dailyGoal' = 'दैनिक लक्ष्य'
        'home.xpEarnedToday' = 'आज {xp}/20 XP अर्जित किया'
        'home.welcomeTitle' = 'Signway में आपका स्वागत है!'
        'home.welcomeSubtitle' = 'AI-संचालित उपकरणों के साथ भारतीय सांकेतिक भाषा में महारत हासिल करें'
        'home.continueLearning' = 'सीखना जारी रखें'
        'home.stats.lessons' = 'पाठ'
        'home.stats.signs' = 'संकेत'
        'home.stats.stars' = 'सितारे'
        'home.poweredByAI' = 'AI द्वारा संचालित'
        'home.features.ar' = 'AR शिक्षण:'
        'home.features.arDesc' = 'आभासी प्रशिक्षक आपको 3D में सिखाता है'
        'home.features.signy' = 'Signy AI:'
        'home.features.signyDesc' = 'AI मित्र के साथ बातचीत का अभ्यास करें'
        'home.features.structured' = 'संरचित पाठ:'
        'home.features.structuredDesc' = 'कार्यस्थल-विशिष्ट संकेत सीखें'
        'home.features.practice' = 'स्मार्ट अभ्यास:'
        'home.features.practiceDesc' = 'अनुकूली प्रश्नोत्तरी प्रगति को ट्रैक करती हैं'
        'welcome.title' = 'Signway में आपका स्वागत है'
        'welcome.subtitle' = 'भारतीय सांकेतिक भाषा प्रवीणता का आपका मार्ग'
        'welcome.getStarted' = 'शुरू करें'
        'welcome.signIn' = 'पहले से खाता है'
        'welcome.description' = 'कार्यस्थल, स्कूल या घर के वातावरण के लिए ISL सीखें'
        'welcome.chooseLanguage' = 'अपनी भाषा चुनें'
        'welcome.languageDescription' = 'ऐप के लिए अपनी पसंदीदा भाषा चुनें'
        'welcome.chooseEnvironment' = 'अपना वातावरण चुनें'
        'welcome.environmentDescription' = 'आप ISL का सबसे अधिक उपयोग कहाँ करेंगे?'
        'welcome.school' = 'स्कूल'
        'welcome.schoolDesc' = 'छात्रों और शिक्षकों के लिए'
        'welcome.work' = 'कार्यालय'
        'welcome.workDesc' = 'कार्यस्थल संचार के लिए'
        'welcome.home' = 'घर'
        'welcome.homeDesc' = 'परिवार और दोस्तों के लिए'
    }
}

# Function to append translations to a file
function Add-TranslationsToFile {
    param (
        [string]$FilePath,
        [hashtable]$Translations
    )
    
    # Read the file
    $content = Get-Content $FilePath -Raw
    
    # Find the last closing brace
    $lastBraceIndex = $content.LastIndexOf('};')
    
    if ($lastBraceIndex -gt 0) {
        # Build the new translations string
        $newTranslations = "`n  'common.back': '$($Translations['common.back'])',`n"
        $newTranslations += "  'common.continue': '$($Translations['common.continue'])',`n`n"
        $newTranslations += "  // Home Page - Additional Keys`n"
        foreach ($key in $Translations.Keys | Where-Object { $_ -like 'home.*' }) {
            $value = $Translations[$key].Replace("'", "\'")
            $newTranslations += "  '$key': '$value',`n"
        }
        $newTranslations += "`n  // Welcome Screen`n"
        foreach ($key in $Translations.Keys | Where-Object { $_ -like 'welcome.*' }) {
            $value = $Translations[$key].Replace("'", "\'")
            $newTranslations += "  '$key': '$value',`n"
        }
        
        # Insert before the closing brace
        $newContent = $content.Substring(0, $lastBraceIndex) + $newTranslations + $content.Substring($lastBraceIndex)
        
        # Write back to file
        Set-Content -Path $FilePath -Value $newContent -NoNewline
    }
}

# Add to Hindi file
Add-TranslationsToFile -FilePath "src\translations\hi.ts" -Translations $translations['hi']

Write-Host "Translations added to Hindi file successfully!"
