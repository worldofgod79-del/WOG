/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Music, 
  Library, 
  Radio, 
  Activity, 
  Mic2, 
  HelpCircle, 
  Mail, 
  Info, 
  Share2, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { BibleSection } from './components/BibleSection';

// Types
type Section = 'HOME' | 'TRACKER' | 'AUDIO_MASSAGES' | 'QUIZ' | 'CONTACT_US' | 'ABOUT_US' | 'BIBLE' | 'SONGS' | 'BOOKS' | 'LIVE';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('HOME');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const sidebarItems = [
    { id: 'TRACKER' as Section, label: 'TRACKER', icon: Activity },
    { id: 'AUDIO_MASSAGES' as Section, label: 'AUDIO MASSAGES', icon: Mic2 },
    { id: 'QUIZ' as Section, label: 'QUIZ', icon: HelpCircle },
    { id: 'CONTACT_US' as Section, label: 'CONTACT US', icon: Mail },
    { id: 'ABOUT_US' as Section, label: 'ABOUT US', icon: Info },
    { id: 'SHARE' as Section, label: 'SHARE THIS APP', icon: Share2 },
  ];

  const bottomItems = [
    { id: 'BIBLE' as Section, label: 'FULL BIBLE', icon: Book },
    { id: 'SONGS' as Section, label: 'SONGS', icon: Music },
    { id: 'BOOKS' as Section, label: 'BOOKS', icon: Library },
    { id: 'LIVE' as Section, label: 'LIVE', icon: Radio },
  ];

  const renderContent = () => {
    if (activeSection === 'BIBLE') {
      return <BibleSection onBack={() => setActiveSection('HOME')} />;
    }

    switch (activeSection) {
      case 'HOME':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold tracking-tighter text-slate-900">Welcome to WOG</h1>
              <p className="text-slate-500 max-w-md">Your spiritual companion for daily growth, worship, and learning.</p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {bottomItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="flex flex-col items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    <item.icon className="w-8 h-8 text-indigo-600 mb-2" />
                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <motion.div 
              key={activeSection}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                {React.createElement([...sidebarItems, ...bottomItems].find(i => i.id === activeSection)?.icon || Activity, {
                  className: "w-10 h-10 text-indigo-600"
                })}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{activeSection.replace('_', ' ')}</h2>
              <p className="text-slate-500 italic">Section content coming soon...</p>
              <button 
                onClick={() => setActiveSection('HOME')}
                className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Back to Home
              </button>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden flex flex-col">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="w-32 h-32 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 mb-6">
                <span className="text-white text-5xl font-black italic">WOG</span>
              </div>
              <h1 className="text-2xl font-bold tracking-widest text-slate-900">WOG APP DESIGN</h1>
              <div className="mt-8 flex space-x-1">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1] }} 
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 bg-indigo-600 rounded-full" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1] }} 
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-2 h-2 bg-indigo-600 rounded-full" 
                />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1] }} 
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-2 h-2 bg-indigo-600 rounded-full" 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-16 bg-white border-bottom border-slate-100 flex items-center justify-between px-4 sticky top-0 z-30">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
        <div 
          onClick={() => setActiveSection('HOME')}
          className="font-black text-xl italic text-indigo-600 cursor-pointer"
        >
          WOG
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="h-20 bg-white border-t border-slate-100 flex items-center justify-around px-2 pb-safe">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex flex-col items-center justify-center w-1/4 h-full transition-all ${
              activeSection === item.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon className={`w-6 h-6 mb-1 ${activeSection === item.id ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-bold tracking-tighter uppercase">{item.label}</span>
            {activeSection === item.id && (
              <motion.div layoutId="activeTab" className="w-1 h-1 bg-indigo-600 rounded-full mt-1" />
            )}
          </button>
        ))}
      </nav>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-black italic text-sm">W</span>
                  </div>
                  <span className="font-bold text-lg">WOG Menu</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Main Menu</p>
                </div>
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${
                      activeSection === item.id 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon className="w-5 h-5" />
                      <span className="font-semibold text-sm tracking-tight">{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 opacity-30 ${activeSection === item.id ? 'opacity-100' : ''}`} />
                  </button>
                ))}
              </div>

              <div className="p-6 border-t border-slate-50">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-500 text-center">Version 1.0.0</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
