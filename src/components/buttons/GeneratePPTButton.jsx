// GeneratePPTButton.jsx
import React from 'react';

export default function GeneratePPTButton({ onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500
        text-white font-bold shadow-lg hover:shadow-xl transition
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
            Generate PPT
        </button>
    );
}
