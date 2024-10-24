import React from 'react';
import { Menu, X, Volume2, VolumeX, Twitter, MessageCircle } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

interface LayoutProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  children: React.ReactNode;
}

const Layout = React.memo(({ currentPage, setCurrentPage, children }: LayoutProps) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isPlaying, toggleAudio } = useAudio();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled ? 'bg-gray-900/70 backdrop-blur-md h-16' : 'bg-gray-900 h-20'
        }`}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`font-bold transition-all duration-300 ease-in-out ${
              isScrolled ? 'text-xl' : 'text-2xl md:text-3xl'
            } text-yellow-400 hover:text-yellow-300`}
          >
            Money Loving Monkeys
          </button>
          <div className="flex items-center gap-3 md:gap-4 ml-auto">
            <button
              onClick={toggleAudio}
              className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center"
              aria-label={isPlaying ? 'Mute audio' : 'Unmute audio'}
            >
              {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <nav className="hidden md:block relative">
              <ul className="flex gap-6">
                <li>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 border ${
                      currentPage === 'home' 
                        ? 'bg-yellow-400 text-gray-900 font-semibold border-transparent' 
                        : 'text-gray-300 hover:text-white border-gray-600 hover:border-gray-400 bg-gradient-to-br from-gray-800 to-gray-700'
                    }`}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setCurrentPage('miner')}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 border ${
                      currentPage === 'miner' 
                        ? 'bg-yellow-400 text-gray-900 font-semibold border-transparent' 
                        : 'text-gray-300 hover:text-white border-gray-600 hover:border-gray-400 bg-gradient-to-br from-gray-800 to-gray-700'
                    }`}
                  >
                    Miner
                  </button>
                </li>
              </ul>
              <div 
                className="absolute top-0 h-full bg-yellow-400 transition-all duration-300 rounded-lg -z-10"
                style={{
                  left: currentPage === 'home' ? '0' : '50%',
                  width: '50%',
                  opacity: '0.2',
                  transform: `translateX(${currentPage === 'home' ? '0' : '0'})`,
                }}
              />
            </nav>
            <button
              className="md:hidden bg-yellow-400 text-gray-900 p-2 rounded-lg hover:bg-yellow-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-40 bg-gray-900/70 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4">
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => { 
                      setCurrentPage('home');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      currentPage === 'home'
                        ? 'bg-yellow-400 text-gray-900 font-semibold'
                        : 'text-gray-300 hover:text-white bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600'
                    }`}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setCurrentPage('miner');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      currentPage === 'miner'
                        ? 'bg-yellow-400 text-gray-900 font-semibold'
                        : 'text-gray-300 hover:text-white bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600'
                    }`}
                  >
                    Miner
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </header>
      <div className="flex-grow">
        {children}
      </div>
      <footer className="bg-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4 flex justify-center space-x-8">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
            <Twitter className="w-8 h-8" />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors">
            <MessageCircle className="w-8 h-8" />
          </a>
        </div>
      </footer>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;