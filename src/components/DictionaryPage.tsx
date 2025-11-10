import { useState } from 'react';
import { Search, BookMarked } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface Sign {
  word: string;
  category: string;
  description: string;
  relatedSigns: string[];
}

const signDictionary: Sign[] = [
  { word: 'Hello', category: 'Greetings', description: 'Wave your hand in a greeting motion', relatedSigns: ['Hi', 'Welcome'] },
  { word: 'Thank You', category: 'Greetings', description: 'Touch your chin and move hand forward', relatedSigns: ['Please', 'Sorry'] },
  { word: 'Please', category: 'Greetings', description: 'Circular motion on chest with open palm', relatedSigns: ['Thank You', 'Welcome'] },
  { word: 'Help', category: 'Common', description: 'One fist on open palm, lift together', relatedSigns: ['Need', 'Support'] },
  { word: 'Meeting', category: 'Professional', description: 'Bring fingertips of both hands together', relatedSigns: ['Conference', 'Discussion'] },
  { word: 'Work', category: 'Professional', description: 'Tap fists together at wrists', relatedSigns: ['Job', 'Office'] },
  { word: 'Yes', category: 'Common', description: 'Nod fist up and down', relatedSigns: ['Agree', 'Okay'] },
  { word: 'No', category: 'Common', description: 'Tap index and middle finger with thumb', relatedSigns: ['Disagree', 'Not'] },
  { word: 'Understand', category: 'Common', description: 'Flick finger from forehead', relatedSigns: ['Know', 'Learn'] },
  { word: 'Question', category: 'Professional', description: 'Draw a question mark in the air', relatedSigns: ['Ask', 'Wonder'] },
  { word: 'Computer', category: 'Office', description: 'Type motion with fingers', relatedSigns: ['Email', 'Technology'] },
  { word: 'Phone', category: 'Office', description: 'Thumb and pinky extended to ear', relatedSigns: ['Call', 'Message'] },
  { word: 'Break', category: 'Time', description: 'Hands together then apart sharply', relatedSigns: ['Rest', 'Lunch'] },
  { word: 'Today', category: 'Time', description: 'Both hands move downward from chest', relatedSigns: ['Now', 'Present'] },
  { word: 'Tomorrow', category: 'Time', description: 'Thumb touches cheek, moves forward', relatedSigns: ['Future', 'Later'] },
  { word: 'Manager', category: 'Professional', description: 'Open hand on shoulder area', relatedSigns: ['Boss', 'Supervisor'] },
];

export function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(signDictionary.map(s => s.category)))];

  const filteredSigns = signDictionary.filter(sign => {
    const matchesSearch = sign.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
          <BookMarked className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">ISL Dictionary</h2>
          <p className="text-sm text-muted-foreground">
            {filteredSigns.length} signs available
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for signs..."
          className="pl-12 h-14 rounded-2xl text-base border-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search for signs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 px-4 py-2 rounded-full capitalize transition-all ${
              selectedCategory === category
                ? 'bg-primary text-white shadow-md'
                : 'bg-card border border-border hover:border-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Signs Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredSigns.map((sign, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03 }}
            className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
          >
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-3">
              <span className="text-5xl" aria-hidden="true">🤟</span>
            </div>
            <h3 className="text-base mb-1 line-clamp-1">{sign.word}</h3>
            <Badge variant="secondary" className="text-xs mb-2">
              {sign.category}
            </Badge>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {sign.description}
            </p>
          </motion.div>
        ))}
      </div>

      {filteredSigns.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-3">🔍</div>
          <p className="text-muted-foreground">No signs found</p>
          <p className="text-sm text-muted-foreground">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
