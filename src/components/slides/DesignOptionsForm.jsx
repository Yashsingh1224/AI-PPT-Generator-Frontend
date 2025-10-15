import React from 'react';

export default function DesignOptionsForm({
    onSubmit, loading,
    bgImage, setBgImage, bgPreview, setBgPreview,
    logoImage, setLogoImage, logoPreview, setLogoPreview
}) {
    const handleBgChange = (e) => {
        const file = e.target.files[0];
        setBgImage(file);
        setBgPreview(file ? URL.createObjectURL(file) : null);
    };
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogoImage(file);
        setLogoPreview(file ? URL.createObjectURL(file) : null);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(bgImage, logoImage);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    Customize Your Design
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-3">
                    Make It Your Own
                </h3>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Upload your brand assets to create a personalized presentation that reflects your style
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Upload Cards Container */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Background Image Upload */}
                    <div className="group">
                        <label className="block text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            Background Image
                        </label>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group-hover:border-indigo-300">
                            <div className="flex flex-col lg:flex-row items-center gap-6">
                                <label className="relative flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-50 bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:scale-105">
                                    {!bgPreview ? (
                                        <div className="text-center">
                                            <svg className="w-10 h-10 text-indigo-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <div className="text-indigo-600 font-medium text-sm mb-1">
                                                Click to upload
                                            </div>
                                            <div className="text-slate-500 text-xs">
                                                or drag & drop
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={bgPreview}
                                                alt="Background preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBgChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        aria-label="Choose background image"
                                    />
                                </label>

                                <div className="flex-1 text-center lg:text-left">
                                    {bgImage && (
                                        <div className="mb-4">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                File Selected
                                            </div>
                                            <div className="text-slate-700 font-medium truncate max-w-[200px]">
                                                {bgImage.name}
                                            </div>
                                            <div className="text-slate-500 text-sm">
                                                {(bgImage.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-slate-600 text-sm space-y-1">
                                        <div className="flex items-center justify-center lg:justify-start">
                                            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Landscape orientation recommended</span>
                                        </div>
                                        <div className="flex items-center justify-center lg:justify-start">
                                            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>JPG, PNG formats supported</span>
                                        </div>
                                        <div className="flex items-center justify-center lg:justify-start">
                                            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Max 10MB file size</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logo Image Upload */}
                    <div className="group">
                        <label className="block text-xl font-bold text-slate-800 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            Company Logo
                        </label>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group-hover:border-blue-300">
                            <div className="flex flex-col lg:flex-row items-center gap-6">
                                <label className="relative flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:scale-105">
                                    {!logoPreview ? (
                                        <div className="text-center">
                                            <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <div className="text-blue-600 font-medium text-sm mb-1">
                                                Upload Logo
                                            </div>
                                            <div className="text-slate-500 text-xs">
                                                drag & drop
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        aria-label="Choose logo image"
                                    />
                                </label>

                                <div className="flex-1 text-center lg:text-left">
                                    {logoImage && (
                                        <div className="mb-4">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-2">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Logo Ready
                                            </div>
                                            <div className="text-slate-700 font-medium truncate max-w-[150px]">
                                                {logoImage.name}
                                            </div>
                                            <div className="text-slate-500 text-sm">
                                                {(logoImage.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-slate-600 text-sm space-y-1">
                                        <div className="flex items-center justify-center lg:justify-start">
                                            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Square format preferred</span>
                                        </div>
                                        <div className="flex items-center justify-center lg:justify-start">
                                            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Transparent PNG recommended</span>
                                        </div>
                                        <div className="flex items-center justify-center lg:justify-start">
                                            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Max 5MB file size</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                    <div className="text-center mb-6">
                        <h4 className="text-xl font-bold text-slate-900 mb-2">Ready to Generate?</h4>
                        <p className="text-slate-600">
                            Your presentation will be created with{' '}
                            {bgImage || logoImage ? 'your custom branding' : 'professional default styling'}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full relative overflow-hidden py-4 px-8 rounded-xl text-lg font-bold shadow-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${loading ? 'animate-pulse' : ''
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-3">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    <div className="absolute inset-0 animate-ping rounded-full h-6 w-6 border border-white opacity-20"></div>
                                </div>
                                <span className="animate-pulse">Generating Your Presentation...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center space-x-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>Generate AI Presentation</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        )}

                        {/* Animated background effect */}
                        {!loading && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        )}
                    </button>

                    {!loading && (
                        <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-slate-500">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>AI-Powered</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                                <span>30sec Generation</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                                <span>PPTX Download</span>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
