
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Mic, MicOff, Loader2, MapPin } from 'lucide-react';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';

interface AISearchBarProps {
  onSearch: (query: string, location?: { lat: number; lon: number }) => void;
  placeholder?: string;
  className?: string;
}

export const AISearchBar: React.FC<AISearchBarProps> = ({
  onSearch,
  placeholder = "Search for products, stores, or ask AI anything...",
  className,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { latitude, longitude, error: locationError } = useGeolocation();

  const handleVoiceResult = (transcript: string) => {
    setQuery(transcript);
    handleSearch(transcript);
  };

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: voiceSupported,
  } = useVoiceSearch(handleVoiceResult);

  // Update query when voice transcript changes
  useEffect(() => {
    if (transcript && isListening) {
      setQuery(transcript);
    }
  }, [transcript, isListening]);

  const handleSearch = async (searchQuery?: string) => {
    const searchText = searchQuery || query;
    if (!searchText.trim()) return;

    setIsSearching(true);
    
    const location = latitude && longitude ? { lat: latitude, lon: longitude } : undefined;
    
    try {
      await onSearch(searchText, location);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setQuery('');
      startListening();
    }
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-24 py-3 text-base rounded-xl border-2 transition-all",
            isListening && "border-red-300 bg-red-50",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          )}
          disabled={isSearching}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          {voiceSupported && (
            <Button
              type="button"
              variant={isListening ? "destructive" : "ghost"}
              size="sm"
              onClick={toggleVoiceSearch}
              className="p-2"
              disabled={isSearching}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Button
            type="button"
            onClick={() => handleSearch()}
            disabled={!query.trim() || isSearching}
            size="sm"
            className="px-3"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Search'
            )}
          </Button>
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          {isListening && (
            <Badge variant="destructive" className="animate-pulse">
              <Mic className="w-3 h-3 mr-1" />
              Listening...
            </Badge>
          )}
          
          {latitude && longitude && (
            <Badge variant="secondary">
              <MapPin className="w-3 h-3 mr-1" />
              Location enabled
            </Badge>
          )}
          
          {locationError && (
            <Badge variant="outline" className="text-yellow-600">
              Location unavailable
            </Badge>
          )}
        </div>

        {voiceSupported && (
          <div className="text-gray-500">
            {isListening ? 'Speak now...' : 'Click mic or type to search'}
          </div>
        )}
      </div>
    </div>
  );
};
