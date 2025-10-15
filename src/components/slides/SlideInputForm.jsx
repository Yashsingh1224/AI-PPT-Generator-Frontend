// SlideInputForm.jsx
import React from 'react';

export default function SlideInputForm({ onSubmit }) {
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');

    return (
        <form
            className="bg-white shadow rounded-lg p-6 flex flex-col gap-4 max-w-md mx-auto"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ title, content });
                setTitle('');
                setContent('');
            }}
        >
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Add Slide</h2>
            <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Slide Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Slide Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
                Add Slide
            </button>
        </form>
    );
}
