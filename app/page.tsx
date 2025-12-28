'use client';

import { useState } from 'react';
import Scene from './components/Scene';
import UI from './components/UI';

export default function Home() {
  const [currentView, setCurrentView] = useState<'overview' | 'earth' | 'moon'>('overview');

  return (
    <main className="w-full h-screen relative bg-black overflow-hidden">
      <Scene currentView={currentView} onViewChange={setCurrentView} />
      <UI currentView={currentView} onViewChange={setCurrentView} />
    </main>
  );
}
