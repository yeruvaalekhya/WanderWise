import React, { useState } from 'react';
import Header from './components/Header';
import ExploreView from './components/ExploreView';
import PhotoEditorView from './components/PhotoEditorView';

export type View = 'explore' | 'editor';

const App: React.FC = () => {
  const [view, setView] = useState<View>('explore');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">
      <Header currentView={view} setView={setView} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {view === 'explore' && <ExploreView />}
          {view === 'editor' && <PhotoEditorView />}
        </div>
      </main>
    </div>
  );
};

export default App;
