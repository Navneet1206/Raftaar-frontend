import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import Button from './Button';
import Input from './Input';

const FloatingBooking = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
          onClick={() => setIsOpen(true)}
        >
          Book Now
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Quick Booking</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Pickup</span>
                    </div>
                    <Input placeholder="Enter pickup location" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Destination</span>
                    </div>
                    <Input placeholder="Enter destination" />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <Input type="date" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Time</span>
                    </div>
                    <Input type="time" />
                  </div>
                </div>

                <Button variant="primary" className="w-full mt-6">
                  Book Ride
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingBooking;