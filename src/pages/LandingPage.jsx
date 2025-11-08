import React, { useState } from "react";
import DesignOptionsForm from "../components/slides/DesignOptionsForm";
import LogoOrbit3D from "../components/3d/LogoOrbit3D";
import SlideCarousel3D from "../components/3d/SlideCarousel3D";
import Logo from "../assets/thunder_logo.png"; // Adjust the path as necessary
import Background3D from "../components/3d/Background3d";
import InteractiveHero3D from "../components/3d/InteractiveHero3d";

export default function LandingPage() {
    // Manual slide state
    const [slides, setSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // AI slide state
    const [aiTopic, setAiTopic] = useState("");
    const [showAiDesign, setShowAiDesign] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    // Design options state (reused)
    const [bgImage, setBgImage] = useState(null);
    const [logoImage, setLogoImage] = useState(null);
    const [bgPreview, setBgPreview] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // Tab state: 0 = AI Generator, 1 = Manual Builder, 2 = Doc to Slides
    const [activeTab, setActiveTab] = useState(0);

    // Manual slide form state
    const [slideTitle, setSlideTitle] = useState("");
    const [slideContent, setSlideContent] = useState("");

    // New: Doc-to-Slides state
    const [docFile, setDocFile] = useState(null);
    const [docSlides, setDocSlides] = useState("");
    const [docLoading, setDocLoading] = useState(false);

    // Image preview handlers (reused)
    const handleBgChange = (e) => {
        const file = e.target.files?.[0];
        setBgImage(file);
        if (file) setBgPreview(URL.createObjectURL(file));
        else setBgPreview(null);
    };
    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        setLogoImage(file);
        if (file) setLogoPreview(URL.createObjectURL(file));
        else setLogoPreview(null);
    };

    // Manual slide add/delete
    const addSlide = (slide) => setSlides([...slides, slide]);
    const deleteSlide = (index) =>
        setSlides(slides.filter((_, i) => i !== index));

    // Add slide from form
    const handleAddSlide = (e) => {
        e.preventDefault();
        if (!slideTitle.trim() || !slideContent.trim()) {
            alert("Please fill in both title and content");
            return;
        }
        addSlide({ title: slideTitle.trim(), content: slideContent.trim() });
        setSlideTitle("");
        setSlideContent("");
    };

    // Manual slide PPT download
    const handleGeneratePPT = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8000/generate-slide-ppt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(slides),
            });
            if (!response.ok) throw new Error("Failed to generate PPT");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "presentation.pptx";
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
            alert("Please enter a topic.");
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
            formData.append("topic", aiTopic);
            if (bgImage) formData.append("bgimage", bgImage);
            if (logoImage) formData.append("logoimage", logoImage);

            const response = await fetch(
                "http://localhost:8000/generate-presentation-ai",
                {
                    method: "POST",
                    body: formData,
                }
            );
            if (!response.ok) throw new Error("Failed to generate PPT");

            const blob = await response.blob();

            // File type check to alert if server error returns HTML instead
            if (!blob.type.includes("presentation")) {
                const txt = await blob.text();
                alert(`Error generating PPT: ${txt.slice(0, 500)}`);
                return;
            }
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "presentation.pptx";
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

    // NEW: Doc-to-Slides submit
    const handleDocToSlidesSubmit = async (e) => {
        e.preventDefault();
        if (!docFile) {
            alert("Please upload a PDF file.");
            return;
        }
        const n = parseInt(docSlides, 10);
        if (isNaN(n) || n <= 0) {
            alert("Please enter a valid number of slides (> 0).");
            return;
        }

        setDocLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", docFile);                // PDF
            formData.append("target_slides", String(n));     // integer
            formData.append("use_trained", "false");         // always false
            if (bgImage) formData.append("bg_image", bgImage);
            if (logoImage) formData.append("logo_image", logoImage);

            const res = await fetch("http://localhost:8000/document-to-slides", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to generate PPT from document");

            const blob = await res.blob();
            if (!blob.type.includes("presentation")) {
                const txt = await blob.text();
                alert(`Error generating PPT: ${txt.slice(0, 500)}`);
                return;
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "presentation.pptx";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setDocLoading(false);
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
                                        className={`flex-1 px-8 py-6 text-lg font-semibold transition-all duration-300 ${activeTab === 0
                                            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                                            : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                                            }`}
                                        onClick={() => setActiveTab(0)}
                                    >
                                        <div className="flex items-center justify-center space-x-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>AI Generator</span>
                                        </div>
                                    </button>

                                    <button
                                        className={`flex-1 px-8 py-6 text-lg font-semibold transition-all duration-300 ${activeTab === 1
                                            ? "bg-slate-50 text-slate-700 border-b-2 border-slate-600"
                                            : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                                            }`}
                                        onClick={() => setActiveTab(1)}
                                    >
                                        <div className="flex items-center justify-center space-x-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                            </svg>
                                            <span>Manual Builder</span>
                                        </div>
                                    </button>

                                    {/* NEW: Doc to Slides Tab */}
                                    <button
                                        className={`flex-1 px-8 py-6 text-lg font-semibold transition-all duration-300 ${activeTab === 2
                                            ? "bg-green-50 text-green-700 border-b-2 border-green-600"
                                            : "text-slate-600 hover:text-green-700 hover:bg-slate-50"
                                            }`}
                                        onClick={() => setActiveTab(2)}
                                    >
                                        <div className="flex items-center justify-center space-x-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3M6 4h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                                            </svg>
                                            <span>Doc to Slides</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* AI Generation Section */}
                            {activeTab === 0 && (
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
                                                    Next
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
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                                                <span>AI is creating your presentation, please wait...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Manual Builder Section */}
                            {activeTab === 1 && (
                                <div className="p-8 space-y-8">
                                    {/* ... keep your full Manual Builder section unchanged ... */}
                                </div>
                            )}

                            {/* NEW: Doc to Slides Section */}
                            {activeTab === 2 && (
                                <div className="p-8 space-y-8">
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Convert Document to Slides</h2>
                                        <p className="text-xl text-slate-600">Upload a PDF, choose slide count, and optionally add background and logo</p>
                                    </div>

                                    <form onSubmit={handleDocToSlidesSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="block text-lg font-semibold text-slate-700">Upload PDF</label>
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                                                    className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white"
                                                    aria-label="PDF file"
                                                />
                                                {docFile && (
                                                    <p className="text-sm text-slate-500">Selected: {docFile.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <label className="block text-lg font-semibold text-slate-700">Number of Slides</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    step={1}
                                                    value={docSlides}
                                                    onChange={(e) => setDocSlides(e.target.value)}
                                                    placeholder="e.g., 12"
                                                    className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white"
                                                    aria-label="Target slides"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="block text-lg font-semibold text-slate-700">Background Image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleBgChange}
                                                    className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white"
                                                    aria-label="Background image"
                                                />
                                                {bgPreview && (
                                                    <div className="rounded-xl overflow-hidden border border-slate-200">
                                                        <img src={bgPreview} alt="Background preview" className="w-full h-40 object-cover" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <label className="block text-lg font-semibold text-slate-700">Logo Image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white"
                                                    aria-label="Logo image"
                                                />
                                                {logoPreview && (
                                                    <div className="rounded-xl overflow-hidden border border-slate-200 p-4 bg-white">
                                                        <img src={logoPreview} alt="Logo preview" className="h-16 object-contain mx-auto" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={docLoading || !docFile || !docSlides}
                                                className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                                            >
                                                {docLoading ? (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                                                        <span>Generating...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293L18.707 9.707A1 1 0 0119 10v8a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span>Generate PowerPoint</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <p className="text-sm text-slate-500">
                                            Note: This uses the new backend endpoint and always runs without a trained model.
                                        </p>
                                    </form>
                                </div>
                            )}
                        </div>

                        {docLoading && (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center space-x-3 text-green-600 text-xl">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
                                    <span>Generating your presentation from document...</span>
                                </div>
                            </div>
                        )}
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
