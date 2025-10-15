import React, { useState } from 'react';
import DesignOptionsForm from '../components/slides/DesignOptionsForm';
import LogoOrbit3D from '../components/3d/LogoOrbit3D';
import SlideCarousel3D from '../components/3d/SlideCarousel3D';
import Logo from "../assets/thunder_logo.png"; // Adjust the path as necessary
import Background3D from '../components/3d/Background3d';
import InteractiveHero3D from '../components/3d/InteractiveHero3d';


export default function LandingPage() {
    // Manual slide state
    const [slides, setSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // AI slide state
    const [aiTopic, setAiTopic] = useState('');
    const [showAiDesign, setShowAiDesign] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    // Design options state
    const [bgImage, setBgImage] = useState(null);
    const [logoImage, setLogoImage] = useState(null);
    const [bgPreview, setBgPreview] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // Tab state (true = Manual Builder, false = AI Generator)
    const [activeTab, setActiveTab] = useState(false);

    // Manual slide form state
    const [slideTitle, setSlideTitle] = useState('');
    const [slideContent, setSlideContent] = useState('');

    // Image preview handlers
    const handleBgChange = (e) => {
        const file = e.target.files[0];
        setBgImage(file);
        if (file) {
            setBgPreview(URL.createObjectURL(file));
        } else {
            setBgPreview(null);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogoImage(file);
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setLogoPreview(null);
        }
    };

    // Manual slide add/delete
    const addSlide = (slide) => setSlides([...slides, slide]);
    const deleteSlide = (index) =>
        setSlides(slides.filter((_, i) => i !== index));

    // Add slide from form
    const handleAddSlide = (e) => {
        e.preventDefault();
        if (!slideTitle.trim() || !slideContent.trim()) {
            alert('Please fill in both title and content');
            return;
        }
        addSlide({ title: slideTitle.trim(), content: slideContent.trim() });
        setSlideTitle('');
        setSlideContent('');
    };

    // Manual slide PPT download
    const handleGeneratePPT = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/generate-slide-ppt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides }),
            });
            if (!response.ok) throw new Error('Failed to generate PPT');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'presentation.pptx';
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // AI topic form submit
    const handleAiTopicSubmit = (e) => {
        e.preventDefault();
        if (!aiTopic.trim()) {
            alert('Please enter a topic.');
            return;
        }
        setShowAiDesign(true);
    };
    const handleDesignFormSubmit = (bgFile, logoFile) => {
        setBgImage(bgFile);
        setLogoImage(logoFile);
        handleGeneratePPTAI();
    };

    // AI PPT generation with user uploads
    const handleGeneratePPTAI = async () => {
        setAiLoading(true);
        try {
            const formData = new FormData();
            formData.append('topic', aiTopic);
            if (bgImage) formData.append('bg_image', bgImage);
            if (logoImage) formData.append('logo_image', logoImage);
            const response = await fetch('http://localhost:8000/generate-presentation-ai', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to generate PPT');
            const blob = await response.blob();
            // File type check to alert if server error returns HTML instead
            if (!blob.type.includes('presentation')) {
                const txt = await blob.text();
                alert("Error generating PPT: " + txt.slice(0, 500));
                return;
            }
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'presentation.pptx';
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setAiLoading(false);
            setShowAiDesign(false);
        }
    };


    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                {/* Navigation */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Syndicate AI
                                </span>
                            </div>
                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Features</a>
                                <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">How it Works</a>
                                <a href="#testimonials" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Reviews</a>
                                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}

                <InteractiveHero3D />
                <section className="relative py-20 sm:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="animate-pulse mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Powered by Advanced AI Technology
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8">
                            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                                AI-Powered
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                PowerPoint Generator
                            </span>
                        </h1>

                        <LogoOrbit3D logoUrl={Logo} size={500} />

                        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Transform your ideas into stunning presentations instantly. Enter your keywords and let our AI create
                            professional PowerPoint slides with custom backgrounds, logos, and more!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Try Free Demo
                            </button>
                            <button className="inline-flex items-center px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all duration-300">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Watch Demo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                                <div className="text-slate-600">Presentations Created</div>
                            </div>
                            <div className="text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-blue-600 mb-2">30s</div>
                                <div className="text-slate-600">Average Generation Time</div>
                            </div>
                            <div className="text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
                                <div className="text-slate-600">Customer Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Generator Section */}
                <section className="py-20 relative">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                            {/* Tab Navigation */}
                            <div className="border-b border-slate-200">
                                <div className="flex">
                                    <button
                                        className={`flex-1 px-8 py-6 text-lg font-semibold transition-all duration-300 ${!activeTab ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}
                                        onClick={() => setActiveTab(false)}
                                    >
                                        <div className="flex items-center justify-center space-x-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>AI Generator</span>
                                        </div>
                                    </button>
                                    <button
                                        className={`flex-1 px-8 py-6 text-lg font-semibold transition-all duration-300 ${activeTab ? 'bg-slate-50 text-slate-700 border-b-2 border-slate-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}
                                        onClick={() => setActiveTab(true)}
                                    >
                                        <div className="flex items-center justify-center space-x-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                            </svg>
                                            <span>Manual Builder</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* AI Generation Section */}
                            {!activeTab && (
                                <div className="p-8 space-y-8">
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Create PPT Automatically with AI</h2>
                                        <p className="text-xl text-slate-600">Enter your topic and let AI create a professional presentation</p>
                                    </div>

                                    {!showAiDesign ? (
                                        <form onSubmit={handleAiTopicSubmit} className="space-y-6">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Digital Marketing Strategy for 2024"
                                                    value={aiTopic}
                                                    onChange={(e) => setAiTopic(e.target.value)}
                                                    disabled={aiLoading}
                                                    className="flex-1 px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                                                    aria-label="AI Presentation Topic"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={aiLoading || !aiTopic.trim()}
                                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <DesignOptionsForm
                                            onSubmit={handleDesignFormSubmit}
                                            loading={aiLoading}
                                            bgImage={bgImage}
                                            setBgImage={setBgImage}
                                            bgPreview={bgPreview}
                                            setBgPreview={setBgPreview}
                                            logoImage={logoImage}
                                            setLogoImage={setLogoImage}
                                            logoPreview={logoPreview}
                                            setLogoPreview={setLogoPreview}
                                        />
                                    )}

                                    {aiLoading && (
                                        <div className="text-center py-12">
                                            <div className="inline-flex items-center space-x-3 text-blue-600 text-xl">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                <span>AI is creating your presentation, please wait...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Manual Builder Section */}
                            {activeTab && (
                                <div className="p-8 space-y-8">
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Create PPT Manually</h2>
                                        <p className="text-xl text-slate-600">Build your presentation slide by slide with full control</p>
                                    </div>

                                    {/* Add Slide Form */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-dashed border-blue-200">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Add New Slide
                                        </h3>

                                        <form onSubmit={handleAddSlide} className="space-y-6">
                                            <div>
                                                <label className="block text-lg font-semibold text-slate-700 mb-3">Slide Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g., Introduction, Market Analysis, Conclusion"
                                                    value={slideTitle}
                                                    onChange={(e) => setSlideTitle(e.target.value)}
                                                    className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-lg font-semibold text-slate-700 mb-3">Slide Content</label>
                                                <textarea
                                                    placeholder="Enter the main content for this slide. You can include bullet points, key messages, or detailed information..."
                                                    value={slideContent}
                                                    onChange={(e) => setSlideContent(e.target.value)}
                                                    rows={6}
                                                    className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={!slideTitle.trim() || !slideContent.trim()}
                                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                            >
                                                <div className="flex items-center justify-center space-x-3">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    <span>Add Slide</span>
                                                </div>
                                            </button>
                                        </form>
                                    </div>

                                    {/* Preview Slides */}
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-slate-900">Preview Slides</h3>
                                        {slides.length === 0 ? (
                                            <div className="text-center py-16 text-slate-500">
                                                <svg className="w-24 h-24 mx-auto mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-xl">No slides added yet. Start by adding slide content!</p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-6">
                                                {slides.map((slide, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                                    >
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center space-x-3">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                                                    Slide {idx + 1}
                                                                </span>
                                                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <button
                                                                onClick={() => deleteSlide(idx)}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                                aria-label={`Delete slide ${idx + 1}`}
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <h4 className="text-xl font-bold text-slate-900 mb-3">{slide.title}</h4>
                                                        <p className="text-slate-600 leading-relaxed mb-4">{slide.content}</p>

                                                        {/* Mini preview */}
                                                        <div className="bg-slate-100 rounded-lg p-4 border-l-4 border-blue-400">
                                                            <div className="text-xs text-slate-500 mb-2">Visual Preview</div>
                                                            <div className="space-y-2">
                                                                <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                                                                <div className="h-2 bg-slate-200 rounded w-full"></div>
                                                                <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Generate Button */}
                                    {slides.length > 0 && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
                                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Generate Your Presentation?</h3>
                                            <p className="text-lg text-slate-600 mb-6">
                                                {slides.length} slide{slides.length !== 1 ? 's' : ''} ready for download
                                            </p>

                                            <button
                                                onClick={handleGeneratePPT}
                                                disabled={isLoading}
                                                className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                                        <span>Generating...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-3">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span>Generate PowerPoint</span>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </button>

                                            {!isLoading && (
                                                <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-slate-500">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span>Instant Download</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                        <span>.PPTX Format</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                                        <span>Professional Design</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isLoading && (
                                        <div className="text-center py-12">
                                            <div className="inline-flex items-center space-x-3 text-blue-600 text-xl">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                <span>Generating your presentation...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-white/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Why Choose Our AI Generator?</h2>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                                Cutting-edge technology meets intuitive design for the ultimate presentation experience
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    ),
                                    title: "AI-Powered Generation",
                                    description: "Create stunning presentations with advanced AI technology"
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ),
                                    title: "Lightning Fast",
                                    description: "Generate professional presentations in under 30 seconds"
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                                        </svg>
                                    ),
                                    title: "Custom Branding",
                                    description: "Upload your logo and choose custom backgrounds"
                                },
                                {
                                    icon: (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    ),
                                    title: "Instant Download",
                                    description: "Download your presentation as PowerPoint (.pptx) file"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">Loved by Professionals</h2>
                            <p className="text-xl text-slate-600">See what our users are saying about their experience</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Sarah Johnson",
                                    role: "Marketing Director",
                                    content: "This tool saved me hours of work. The AI generated exactly what I needed!",
                                    avatar: "SJ"
                                },
                                {
                                    name: "Mike Chen",
                                    role: "Sales Manager",
                                    content: "Professional presentations in minutes. Game-changer for our team.",
                                    avatar: "MC"
                                },
                                {
                                    name: "Emily Davis",
                                    role: "Startup Founder",
                                    content: "Perfect for pitch decks. The AI understands context amazingly well.",
                                    avatar: "ED"
                                }
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                    <div className="flex items-center mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-lg text-slate-600 mb-6 italic">"{testimonial.content}"</p>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{testimonial.name}</div>
                                            <div className="text-slate-600">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Create Amazing Presentations?</h2>
                        <p className="text-xl opacity-90 mb-12 leading-relaxed">
                            Join thousands of professionals who trust our AI to create stunning presentations in minutes.
                        </p>
                        <button className="inline-flex items-center px-12 py-4 bg-white text-blue-600 rounded-xl font-bold text-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Start Creating Now
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 bg-slate-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-3xl font-bold">Syndicate AI</span>
                            </div>
                            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                                Powered by cutting-edge AI models and built with React and FastAPI.
                            </p>
                            <div className="text-slate-400">
                                <p>For help or feedback, contact support@example.com</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
