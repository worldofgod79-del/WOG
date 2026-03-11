import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, BookOpen, Hash, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Verse {
  id: number;
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
  book_name?: string;
}

interface Book {
  id: number;
  bnumber: number;
  name: string;
  testament: 'Old' | 'New';
}

interface BibleSectionProps {
  onBack: () => void;
}

type ViewState = 'BOOKS' | 'CHAPTERS' | 'VERSES' | 'SEARCH';

export const BibleSection: React.FC<BibleSectionProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewState>('BOOKS');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<number[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all books on mount
  useEffect(() => {
    fetch('/api/bible/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Error fetching books:', err));
  }, []);

  // Fetch chapters when a book is selected
  useEffect(() => {
    if (selectedBook) {
      fetch(`/api/bible/chapters/${selectedBook.id}`)
        .then(res => res.json())
        .then(data => setChapters(data))
        .catch(err => console.error('Error fetching chapters:', err));
    }
  }, [selectedBook]);

  // Fetch verses when a chapter is selected
  useEffect(() => {
    if (selectedBook && selectedChapter) {
      setLoading(true);
      fetch(`/api/bible/verses/${selectedBook.id}/${selectedChapter}`)
        .then(res => res.json())
        .then(data => {
          setVerses(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching verses:', err);
          setLoading(false);
        });
    }
  }, [selectedBook, selectedChapter]);

  // Search functionality
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 3) {
        fetch(`/api/bible/search?q=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => setSearchResults(data))
          .catch(err => console.error('Search error:', err));
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setView('CHAPTERS');
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    setView('VERSES');
  };

  const goBack = () => {
    if (view === 'SEARCH') setView('BOOKS');
    else if (view === 'VERSES') setView('CHAPTERS');
    else if (view === 'CHAPTERS') setView('BOOKS');
    else onBack();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Bible Header */}
      <div className="p-4 border-b border-slate-100 flex items-center space-x-4 sticky top-0 bg-white z-10">
        <button onClick={goBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900">
            {view === 'BOOKS' && 'Holy Bible'}
            {view === 'CHAPTERS' && selectedBook?.name}
            {view === 'VERSES' && `${selectedBook?.name} ${selectedChapter}`}
            {view === 'SEARCH' && 'Search Bible'}
          </h2>
        </div>
        {view === 'BOOKS' && (
          <button 
            onClick={() => setView('SEARCH')}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Search className="w-5 h-5 text-slate-600" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {view === 'SEARCH' && (
            <motion.div 
              key="search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 space-y-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search Telugu verses..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-4">
                {searchQuery.length > 0 && searchQuery.length < 3 && (
                  <p className="text-xs text-slate-400 text-center">Type at least 3 characters to search...</p>
                )}
                {searchResults.map((result, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        {result.book_name} {result.chapter}:{result.verse}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{result.text}</p>
                  </div>
                ))}
                {searchQuery.length >= 3 && searchResults.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-400">No verses found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'BOOKS' && (
            <motion.div 
              key="books"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              {books.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400 italic">Please upload bible.xml to the root directory to see the Telugu Bible.</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-2">
                {['Old', 'New'].map((testament) => {
                  const testamentBooks = books.filter(b => b.testament === testament);
                  if (testamentBooks.length === 0) return null;
                  return (
                    <div key={testament} className="mb-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
                        {testament} Testament
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {testamentBooks.map((book) => (
                          <button
                            key={book.id}
                            onClick={() => handleBookSelect(book)}
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                                <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                              </div>
                              <span className="font-bold text-slate-700">{book.name}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === 'CHAPTERS' && selectedBook && (
            <motion.div 
              key="chapters"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <div className="grid grid-cols-4 gap-3">
                {chapters.map((chapterNum) => (
                  <button
                    key={chapterNum}
                    onClick={() => handleChapterSelect(chapterNum)}
                    className="aspect-square flex flex-col items-center justify-center bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                  >
                    <span className="text-lg font-black text-slate-700 group-hover:text-indigo-600">{chapterNum}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Chapter</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'VERSES' && selectedChapter && (
            <motion.div 
              key="verses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                verses.map((verse) => (
                  <div key={verse.id} className="flex space-x-4 group">
                    <span className="text-xs font-black text-indigo-400 mt-1.5 w-6 shrink-0">{verse.verse}</span>
                    <p className="text-xl text-slate-800 leading-relaxed font-serif">
                      {verse.text}
                    </p>
                  </div>
                ))
              )}
              
              <div className="pt-12 pb-8 flex justify-between items-center border-t border-slate-50">
                <button 
                  disabled={selectedChapter === 1}
                  onClick={() => handleChapterSelect(selectedChapter - 1)}
                  className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Prev</span>
                </button>
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                  <Hash className="w-4 h-4 text-indigo-600" />
                </div>
                <button 
                  disabled={selectedChapter === chapters[chapters.length - 1]}
                  onClick={() => handleChapterSelect(selectedChapter + 1)}
                  className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-30"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
