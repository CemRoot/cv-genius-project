import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaWhatsapp, FaSlack, FaEnvelope, FaLinkedin } from 'react-icons/fa';

const ContactPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Contact Us - CVGenius</title>
        <meta name="description" content="Get in touch with CVGenius team through WhatsApp, Slack, or email" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0">
                  <span className="text-2xl font-bold text-indigo-600">CVGenius</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/dublin-faq" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dublin FAQ
                </Link>
                <Link href="/contact" className="text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-indigo-600">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with the CVGenius team. We&apos;re here to help you create the perfect CV!
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
            {/* Contact Methods */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
              
              <div className="space-y-6">
                {/* WhatsApp */}
                <div className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <FaWhatsapp className="text-green-500 text-3xl mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">WhatsApp Group</h3>
                    <p className="text-gray-600 mb-2">Join our WhatsApp community for quick support and updates</p>
                    <a 
                      href="https://chat.whatsapp.com/IYD1DWWnzVH7szBh5GpyPq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                    >
                      Join WhatsApp Group →
                    </a>
                  </div>
                </div>

                {/* Slack */}
                <div className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <FaSlack className="text-purple-500 text-3xl mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Slack Channel</h3>
                    <p className="text-gray-600 mb-2">Join our Slack workspace for professional discussions and support</p>
                    <a 
                      href="https://join.slack.com/t/corporatecare-x2t7491/shared_invite/zt-36v0dw0pf-5Pic~nMl_soYczCI3hZIXw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Join Slack Channel →
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <FaEnvelope className="text-blue-500 text-3xl mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                    <p className="text-gray-600 mb-2">Send us an email for detailed inquiries and support</p>
                    <a 
                      href="mailto:emincem@live.com"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      emincem@live.com →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Contact Us?</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💼</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">CV Feedback</h3>
                  <p className="text-gray-600">Get personalized feedback on your CV from our experts</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Requests</h3>
                  <p className="text-gray-600">Suggest new features and improvements for CVGenius</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Partnership</h3>
                  <p className="text-gray-600">Explore business partnership opportunities with us</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">General Support</h3>
                  <p className="text-gray-600">Get help with any questions about using CVGenius</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">CVGenius</h3>
                <p className="text-gray-300">
                  AI-powered CV generation and optimization tool to help you land your dream job.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/dublin-faq" className="hover:text-white transition-colors">Dublin FAQ</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li><a href="mailto:emincem@live.com" className="hover:text-white transition-colors">emincem@live.com</a></li>
                  <li><a href="https://chat.whatsapp.com/IYD1DWWnzVH7szBh5GpyPq" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Group</a></li>
                  <li><a href="https://join.slack.com/t/corporatecare-x2t7491/shared_invite/zt-36v0dw0pf-5Pic~nMl_soYczCI3hZIXw" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Slack Channel</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center">
              <p>&copy; 2025 CVGenius. All rights reserved.</p>
              <p className="mt-2 sm:mt-0">
                Created voluntarily by{' '}
                <a 
                  href="https://www.linkedin.com/in/cem-koyluoglu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center"
                >
                  <FaLinkedin className="mr-1" />
                  Cem Koyluoglu
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ContactPage; 