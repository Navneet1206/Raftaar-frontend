import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <motion.header
      className={`fixed w-full z-30 transition-all duration-300 ${scrolled ? 'bg-black/95 shadow-lg' : 'bg-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => onNavigate('top')}
            className="text-2xl font-bold text-white"
          >
            GatiYan
          </button>
          <nav className="hidden md:flex space-x-8">
            <Link to="/">
              <button
                onClick={() => handleNavClick('services')}
                className="text-gray-300 hover:text-white transition"
              >
                Services
              </button>
            </Link>
            <Link to="/contact">
              <button
                onClick={() => handleNavClick('contact')}
                className="text-gray-300 hover:text-white transition"
              >
                Contact
              </button>
            </Link>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-black/95"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="px-4 py-4 space-y-4">
              <Link to="/">

                <button
                  onClick={() => handleNavClick('services')}
                  className="block w-full text-left text-gray-300 hover:text-white transition"
                >
                  Services
                </button>
              </Link>
              <Link to="/contact">
                <button
                  onClick={() => handleNavClick('contact')}
                  className="block w-full text-left text-gray-300 hover:text-white transition"
                >
                  Contact
                </button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;

