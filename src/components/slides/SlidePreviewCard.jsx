// SlidePreviewCard.jsx
import React from 'react';

export default function SlidePreviewCard({ slide, onDelete }) {
    return (
        <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2 mb-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium text-gray-800">{slide.title}</h3>
                <button
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-700 font-semibold"
                >
                    Delete
                </button>
            </div>
            <p className="text-gray-600">{slide.content}</p>
        </div>
    );
}
