import { useState, useMemo, useCallback } from 'react';
import { tools } from '@/data/tools';
import { Tool } from '@/types/tools';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    
    return tools.filter((tool) => {
      const nameMatch = tool.name.toLowerCase().includes(query);
      const descriptionMatch = tool.description.toLowerCase().includes(query);
      const categoryMatch = tool.category.toLowerCase().includes(query);
      
      // Also match common terms
      const keywords: Record<string, string[]> = {
        'merge-pdf': ['combine', 'join', 'merge', 'pdf', 'pdfs'],
        'split-pdf': ['split', 'separate', 'divide', 'extract', 'pdf'],
        'compress-pdf': ['compress', 'reduce', 'smaller', 'size', 'pdf'],
        'rotate-pdf': ['rotate', 'turn', 'flip', 'orientation', 'pdf'],
        'organize-pdf': ['organize', 'reorder', 'arrange', 'pages', 'pdf'],
        'pdf-to-jpg': ['pdf', 'jpg', 'jpeg', 'image', 'convert', 'picture'],
        'jpg-to-pdf': ['jpg', 'jpeg', 'png', 'image', 'pdf', 'convert', 'picture'],
        'compress-image': ['compress', 'image', 'reduce', 'smaller', 'photo'],
        'format-converter': ['convert', 'format', 'jpg', 'png', 'webp', 'gif', 'image'],
        'pdf-to-pdfa': ['archive', 'pdfa', 'pdf/a', 'preservation'],
        'word-to-pdf': ['word', 'doc', 'docx', 'document', 'pdf', 'convert'],
      };
      
      const toolKeywords = keywords[tool.id] || [];
      const keywordMatch = toolKeywords.some((kw) => kw.includes(query) || query.includes(kw));
      
      return nameMatch || descriptionMatch || categoryMatch || keywordMatch;
    });
  }, [searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(query.length > 0);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchOpen(false);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearchOpen,
    setIsSearchOpen,
    handleSearch,
    clearSearch,
  };
}
