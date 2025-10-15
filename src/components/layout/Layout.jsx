// Layout.jsx
import React from 'react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow py-4 px-8">
                <h1 className="text-3xl font-bold text-blue-600">PPT Generator</h1>
            </header>
            <main className="flex-1 p-8 flex flex-col gap-8">
                {children}
            </main>
            <footer className="bg-white py-4 px-8 mt-auto text-center text-gray-400">
                &copy; 2025 PPT Generator
            </footer>
        </div>
    );
}
