import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../../context/UserContext'; // Adjust path as per your structure
import { CaptainDataContext } from '../../context/CapatainContext'; // Fix typo if needed

const FloatingBooking = () => {
  const navigate = useNavigate();

  // Get authentication states from contexts
  const { user } = useContext(UserDataContext);
  const { captain } = useContext(CaptainDataContext);

  // Check if anyone is logged in
  const isLoggedIn = !!user || !!captain;

  // Determine the navigation path based on login status
  const handleButtonClick = () => {
    if (isLoggedIn) {
      // If user is logged in, go to their respective home page
      if (user) {
        navigate('/home');
      } else if (captain) {
        navigate('/captain-home');
      }
    } else {
      // If not logged in, go to login page
      navigate('/login');
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Button
        variant="primary"
        size="lg"
        className="shadow-xl"
        onClick={handleButtonClick}
      >
        {isLoggedIn ? 'Go to Dashboard' : 'Book Now'}
      </Button>
    </motion.div>
  );
};

export default FloatingBooking;