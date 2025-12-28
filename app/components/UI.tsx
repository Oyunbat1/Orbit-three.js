'use client';

import { useStore } from 'zustand';
import { store } from '../xr-store';

interface UIProps {
    currentView: 'overview' | 'earth' | 'moon';
    onViewChange: (view: 'overview' | 'earth' | 'moon') => void;
}

export default function UI({ currentView, onViewChange }: UIProps) {
    // @ts-ignore
    const session = useStore(store, (state) => state.session);

    const toggleVR = async () => {
        if (session) {
            session.end();
        } else {
            try {
                await store.enterVR();
            } catch (e) {
                console.error("Failed to enter VR:", e);
            }
        }
    };

    return (
        <div className="absolute top-0 left-0 w-full p-6 flex flex-col gap-4 items-start pointer-events-none z-10">
            <h1 className="text-white text-4xl font-bold drop-shadow-md">Нар, Дэлхий, Сарны орбитын хөдөлгөөн</h1>

            <div className="flex gap-4 pointer-events-auto mt-4">
                <button
                    onClick={() => onViewChange('overview')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all cursor-pointer ${currentView === 'overview'
                        ? 'bg-white text-black scale-105 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/40 backdrop-blur-md'
                        }`}
                >
                    Ерөнхий харагдац
                </button>
                <button
                    onClick={() => onViewChange('earth')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all cursor-pointer ${currentView === 'earth'
                        ? 'bg-blue-500 text-white scale-105 shadow-lg shadow-blue-500/50'
                        : 'bg-white/20 text-white hover:bg-white/40 backdrop-blur-md'
                        }`}
                >
                    Дэлхийг харах
                </button>
                <button
                    onClick={() => onViewChange('moon')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all cursor-pointer ${currentView === 'moon'
                        ? 'bg-gray-300 text-black scale-105 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/40 backdrop-blur-md'
                        }`}
                >
                    Сарыг харах
                </button>
                <button
                    onClick={toggleVR}
                    className={`px-6 py-2 rounded-full font-semibold transition-all shadow-lg cursor-pointer ${session
                        ? 'bg-red-700 text-white hover:bg-red-800' // Distinct style for active (Exit)
                        : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                >
                    {session ? 'VR гарах' : 'VR горим'}
                </button>
            </div>
        </div>
    );
}
