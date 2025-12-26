'use client';

interface UIProps {
    currentView: 'overview' | 'earth' | 'moon';
    onViewChange: (view: 'overview' | 'earth' | 'moon') => void;
}

export default function UI({ currentView, onViewChange }: UIProps) {
    return (
        <div className="absolute top-0 left-0 w-full p-6 flex flex-col gap-4 items-start pointer-events-none z-10">
            <h1 className="text-white text-4xl font-bold drop-shadow-md">Solar System Explorer</h1>
            <p className="text-gray-300 max-w-md drop-shadow-sm">
                Experience the orbital mechanics of the Sun, Earth, and Moon.
                Select a perspective below.
            </p>

            <div className="flex gap-4 pointer-events-auto mt-4">
                <button
                    onClick={() => onViewChange('overview')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${currentView === 'overview'
                            ? 'bg-white text-black scale-105 shadow-lg'
                            : 'bg-white/20 text-white hover:bg-white/40 backdrop-blur-md'
                        }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => onViewChange('earth')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${currentView === 'earth'
                            ? 'bg-blue-500 text-white scale-105 shadow-lg shadow-blue-500/50'
                            : 'bg-white/20 text-white hover:bg-white/40 backdrop-blur-md'
                        }`}
                >
                    Earth View
                </button>
                <button
                    onClick={() => onViewChange('moon')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${currentView === 'moon'
                            ? 'bg-gray-300 text-black scale-105 shadow-lg'
                            : 'bg-white/20 text-white hover:bg-white/40 backdrop-blur-md'
                        }`}
                >
                    Moon View
                </button>
            </div>
        </div>
    );
}
