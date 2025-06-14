import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { PlusCircle, Upload, Sparkles, Shield, Zap, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';

const HomePage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>CVGenius - AI-Powered CV Builder & Optimizer | Free ATS-Friendly CVs</title>
        <meta name="description" content="Create professional, ATS-friendly CVs and cover letters with AI. Build from scratch or optimize existing CVs for specific jobs. Free, fast, and privacy-first." />
        <meta name="keywords" content="free CV builder, AI resume maker, ATS friendly CV, cover letter generator, job application Ireland Europe" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 mr-2" />
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent gradient-flow">CVGenius</span>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  ATS-Friendly
                </Link>
                <Link href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                  Works
                </Link>
                <Link href="#community" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
                  Community
                </Link>
                <Link href="/dublin-faq" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
                  FAQ
                </Link>
              </nav>
              
              <button 
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
              <div className="px-4 py-2 space-y-1">
                <Link 
                  href="#features" 
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ATS-Friendly
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="block px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Works
                </Link>
                <Link 
                  href="#community" 
                  className="block px-3 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Community
                </Link>
                <Link 
                  href="/dublin-faq" 
                  className="block px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col md:flex-row items-center justify-center mb-8">
              <div className="relative mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <Sparkles className="w-16 md:w-20 h-16 md:h-20 text-primary-600 animate-pulse" />
                <div className="absolute -top-2 -right-2 text-2xl md:text-3xl">🤖</div>
              </div>
              <div className="text-center">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Create <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent gradient-flow">ATS-Friendly</span> CVs with AI
                </h1>
                <div className="text-base md:text-lg text-gray-500 mt-2 font-medium">🚀 Your pathway to job success in Ireland & Europe</div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              🎯 <strong>Build professional CVs from scratch or optimize existing ones</strong> for specific job applications. 
              Powered by AI, designed for the Irish & European job market.
            </p>
            
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 mb-12 max-w-2xl mx-auto border border-emerald-200">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl mr-2">✨</span>
                <span className="font-semibold text-gray-800">AI-Powered Features</span>
              </div>
              <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                <div>🎯 ATS Optimization</div>
                <div>📝 Cover Letter Generation</div>
                <div>⚡ Instant Creation</div>
                <div>🔒 Privacy Protected</div>
              </div>
            </div>
            
            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12">
              {/* Creator Flow */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden transform transition-all duration-300 hover:border-primary-200 hover:shadow-2xl hover:scale-[1.02] group">
                <div className="p-6 sm:p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-200 group-hover:to-blue-200 transition-all duration-300 shadow-lg">
                      <PlusCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">✨ Create New CV</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      🚀 Build a professional CV from scratch with our AI-powered guided form. Perfect for career changes or first-time CV creation.
                    </p>
                  </div>
                  
                  <Link href="/create-new-cv">
                    <Button className="w-full group-hover:bg-primary-700 transition-all duration-300 shadow-lg" size="lg">
                      <span className="mr-2">🎯</span>
                      Start Building
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Updater Flow */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden transform transition-all duration-300 hover:border-secondary-200 hover:shadow-2xl hover:scale-[1.02] group">
                <div className="p-6 sm:p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-100 to-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-secondary-200 group-hover:to-emerald-200 transition-all duration-300 shadow-lg">
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-secondary-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">🔄 Update Existing CV</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      ⚡ Upload your current CV and optimize it for a specific job description. Get instant AI-powered improvements.
                    </p>
                  </div>
                  
                  <Link href="/update-cv">
                    <Button variant="outline" className="w-full border-secondary-300 text-secondary-700 hover:bg-secondary-50 group-hover:border-secondary-400 transition-all duration-300 shadow-lg" size="lg">
                      <span className="mr-2">📤</span>
                      Upload & Optimize
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-green-200 transform hover:scale-105 transition-transform">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 mx-auto mb-4" />
                <div className="text-2xl sm:text-3xl font-bold text-green-900 mb-1 text-center">100%</div>
                <div className="text-sm text-green-700 font-medium text-center">Privacy Protected</div>
                <div className="text-xs text-green-600 mt-2 text-center">🔒 No data stored</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-200 transform hover:scale-105 transition-transform">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mx-auto mb-4" />
                <div className="text-2xl sm:text-3xl font-bold text-blue-900 mb-1 text-center">&lt;30s</div>
                <div className="text-sm text-blue-700 font-medium text-center">Generation Time</div>
                <div className="text-xs text-blue-600 mt-2 text-center">⚡ Lightning fast</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 sm:p-6 shadow-lg border border-purple-200 transform hover:scale-105 transition-transform">
                <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 mx-auto mb-4" />
                <div className="text-2xl sm:text-3xl font-bold text-purple-900 mb-1 text-center">EU</div>
                <div className="text-sm text-purple-700 font-medium text-center">Market Ready</div>
                <div className="text-xs text-purple-600 mt-2 text-center">🇮🇪 Ireland focused</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 bg-gradient-to-br from-white via-primary-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center mb-6">
                <span className="text-3xl sm:text-4xl mr-3">✨</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Why Choose <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent gradient-flow">CVGenius</span>?
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                🚀 Built for the Irish & European job market
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-gray-100 hover:border-primary-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-primary-200 group-hover:to-blue-200 transition-all duration-300 shadow-lg">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">🤖 AI-Powered Content</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                  Advanced AI transforms your experience into compelling, professional content 
                  that stands out to recruiters and passes ATS systems effortlessly.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300 shadow-lg">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">🔒 Privacy First</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                  Your data is never stored on our servers. Everything is processed securely 
                  and deleted immediately after generation for complete peace of mind.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-gray-100 hover:border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-300 shadow-lg">
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">⚡ Lightning Fast</h3>
                <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                  Generate professional CVs and cover letters in under 30 seconds. 
                  No lengthy processes, no waiting - just instant, high-quality results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <div className="flex items-center justify-center mb-6">
                <span className="text-3xl sm:text-4xl mr-3">🚀</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  How It <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent gradient-flow">Works</span>
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                🎯 Three simple steps to your perfect CV
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-gray-100 hover:border-primary-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-600 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl sm:text-2xl font-bold shadow-lg group-hover:from-primary-700 group-hover:to-blue-700 transition-all duration-300">
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">🎯 Choose Your Path</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Either create a new CV from scratch using our AI-powered guided form, 
                  or upload your existing CV for instant optimization.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-gray-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl sm:text-2xl font-bold shadow-lg group-hover:from-emerald-700 group-hover:to-teal-700 transition-all duration-300">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">📝 Provide Details</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Share your experience, skills, and the job description you&apos;re targeting. 
                  Our AI analyzes everything to create the perfect match.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-gray-100 hover:border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl sm:text-2xl font-bold shadow-lg group-hover:from-purple-700 group-hover:to-indigo-700 transition-all duration-300">
                  3
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">⬇️ Download & Apply</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Get your professional CV and cover letter instantly. 
                  Ready-to-use documents formatted for ATS systems and Irish employers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-16 sm:py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <span className="text-3xl sm:text-4xl mr-3">🤝</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Join Our <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent gradient-flow">Community</span>
                </h2>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-4">
                Connect with 1400+ professionals for support, tips, and career opportunities
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-green-600 font-semibold text-lg">🆓 Completely FREE Community</span>
                </div>
                <p className="text-green-700 text-center text-sm">
                  All members are volunteers helping each other. No fees, no charges - just genuine support from fellow job seekers and professionals.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* WhatsApp Group */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">WhatsApp Group</h3>
                    <p className="text-sm text-gray-600">1400+ members</p>
                  </div>
                </div>
                                 <p className="text-gray-600 mb-6 leading-relaxed">
                   Join our <strong>FREE</strong> WhatsApp community where volunteers share CV tips, job opportunities, and provide instant support. No cost, just genuine help from fellow professionals.
                 </p>
                <a 
                  href="https://chat.whatsapp.com/IYD1DWWnzVH7szBh5GpyPq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">💬</span>
                  Join WhatsApp Group
                  <span className="ml-2">→</span>
                </a>
              </div>

              {/* Slack Channel */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-gray-100 hover:border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Slack Channel</h3>
                    <p className="text-sm text-gray-600">Professional network</p>
                  </div>
                </div>
                                 <p className="text-gray-600 mb-6 leading-relaxed">
                   Join our <strong>FREE</strong> Slack workspace where volunteers provide professional career advice, networking opportunities, and structured support. Completely voluntary community.
                 </p>
                <a 
                  href="https://join.slack.com/t/corporatecare-x2t7491/shared_invite/zt-36v0dw0pf-5Pic~nMl_soYczCI3hZIXw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">🚀</span>
                  Join Slack Channel
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            {/* Community Benefits */}
            <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
                             <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">What You'll Get (100% FREE)</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">💡</span>
                  </div>
                                     <h4 className="font-semibold text-gray-900 mb-1">CV Tips</h4>
                   <p className="text-sm text-gray-600">Free volunteer advice & feedback</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🎯</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Job Alerts</h4>
                  <p className="text-sm text-gray-600">Latest opportunities</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🤝</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Networking</h4>
                  <p className="text-sm text-gray-600">Connect with peers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">⚡</span>
                  </div>
                                     <h4 className="font-semibold text-gray-900 mb-1">Quick Support</h4>
                   <p className="text-sm text-gray-600">Free volunteer help & answers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary-400 mr-2" />
                                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent gradient-flow">CVGenius</span>
                </div>
                <p className="text-gray-400 mb-6">
                  AI-powered CV and cover letter generation for the modern job seeker. 
                  Privacy-first, ATS-friendly, and designed for success.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/create-new-cv" className="hover:text-white transition-colors">Create New CV</Link></li>
                  <li><Link href="/update-cv" className="hover:text-white transition-colors">Update Existing CV</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/dublin-faq" className="hover:text-white transition-colors">Dublin Job Guide</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><a href="mailto:emincem@live.com" className="hover:text-white transition-colors">emincem@live.com</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p>&copy; 2025 CVGenius. All rights reserved.</p>
                <p className="mt-2 sm:mt-0">
                  Created voluntarily by{' '}
                  <a 
                    href="https://www.linkedin.com/in/cem-koyluoglu/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Cem Koyluoglu
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;