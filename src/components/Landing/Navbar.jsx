import React, { useState, useEffect, useContext } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../../context/UserContext'; // Use named export
import { CaptainDataContext } from '../../context/CapatainContext'; // Use named export, fix typo in path if needed
import logo from '../../assets/bgremoved--logowhite-removebg-preview.png';

const Navbar = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Get authentication states from contexts
  const { user, setUser } = useContext(UserDataContext);
  const { captain, setCaptain } = useContext(CaptainDataContext);

  // Check if anyone is logged in
  const isLoggedIn = !!user || !!captain;

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

  const handleLogout = () => {
    // Clear localStorage and context based on user type
    if (user) {
      localStorage.removeItem('token');
      setUser(null);
    } else if (captain) {
      localStorage.removeItem('token');
      setCaptain(null);
    }
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <motion.header
      className={`fixed w-full z-30 transition-all duration-300 ${
        scrolled ? 'bg-black/95 shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => onNavigate('top')} className="text-2xl font-bold text-white">
            <img className="w-24 h-12" src={logo} alt="Logo" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
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
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="text-gray-300 hover:text-white transition">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                    Signup
                  </button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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
                  className="block w-full text-left text-gray-300 hover:text-white transition mb-4 text-xl"
                >
                  Services
                </button>
              </Link>
              <Link to="/contact">
                <button
                  onClick={() => handleNavClick('contact')}
                  className="block w-full text-left text-gray-300 hover:text-white transition mb-4 text-xl"
                >
                  Contact
                </button>
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login">
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left text-gray-300 hover:text-white transition mb-4 text-xl"
                    >
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left text-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                      Signup
                    </button>
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;