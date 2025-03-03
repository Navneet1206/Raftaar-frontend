import  { useState } from 'react';
import { Car, Shield, Clock } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';
import Input from '../components/Landing/Input';
import Button from '../components/Landing/Button';
import ServiceCard from '../components/Landing/ServiceCard';
import AnimatedSection from '../components/Landing/AnimatedSection';
import FadeInSection from '../components/Landing/FadeInSection';
import ParallaxSection from '../components/Landing/ParallaxSection';
import HeroBackground from '../components/Landing/HeroBackground';
import StatsSection from '../components/Landing/StatsSection';
import TestimonialCard from '../components/Landing/TestimonialCard';
import FloatingBooking from '../components/Landing/FloatingBooking';
import ScrollToTop from '../components/Landing/ScrollToTop';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaLocationArrow } from 'react-icons/fa';
import axios from 'axios';
import LocationSearchPanel from '../components/LocationSearchPanel';
function Start() {
  const navigate = useNavigate();

  // Ride input states
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

  // States for suggestions and active field
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const services = [
    {
      title: "Premium Rides",
      icon: Car,
      description: "Luxury vehicles for comfortable travel"
    },
    {
      title: "Safe Journey",
      icon: Shield,
      description: "Verified drivers and secure rides"
    },
    {
      title: "24/7 Service",
      icon: Clock,
      description: "Available round the clock"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Executive",
      content: "The best cab service I've ever used. Professional drivers and luxurious cars.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Frequent Traveler",
      content: "Reliable and comfortable. My go-to choice for airport transfers.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Corporate Client",
      content: "Exceptional service and attention to detail. Highly recommended!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      rating: 5
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fetch pickup suggestions as user types
  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: { input: value },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        setPickupSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching pickup suggestions:', error);
      }
    } else {
      setPickupSuggestions([]);
    }
  };

  // Fetch destination suggestions as user types
  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
          {
            params: { input: value },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        setDestinationSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching destination suggestions:', error);
      }
    } else {
      setDestinationSuggestions([]);
    }
  };

  // Autofill pickup with current location using geolocation
  const autofillPickup = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
              {
                params: { address: `${latitude},${longitude}` },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              }
            );
            setPickup(response.data.formatted_address);
          } catch (error) {
            console.error('Error fetching coordinates:', error);
          }
        },
        (error) => {
          console.error('Error getting geolocation:', error.message);
          alert('Unable to access your current location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // On form submit, if user is logged in, pass input to Home; otherwise store input and navigate to login
  const handleSubmit = (e) => {
    e.preventDefault();
    const rideInput = { pickup, destination };
    if (localStorage.getItem('token')) {
      navigate('/home', { state: rideInput });
    } else {
      localStorage.setItem('rideInput', JSON.stringify(rideInput));
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onNavigate={scrollToSection} />
      <FloatingBooking />
      <ScrollToTop />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <HeroBackground />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInSection direction="left">
              <h1 className="text-5xl font-bold text-white mb-6">
               GatiYan Your Premium Cab Service
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience luxury and comfort with Gatiyan's premium ride service.
              </p>
              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/login">
                    <Button variant="primary" size="lg" onClick={() => scrollToSection('services')}>
                      Make Ride
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/captain-login">
                    <Button variant="outline" size="lg" onClick={() => scrollToSection('contact')}>
                      Join as Captain
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </FadeInSection>

            <FadeInSection direction="right" delay={0.2}>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Book Your Ride</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Pickup Field */}
                  <div className="relative">
                    <Input
                      value={pickup}
                      onChange={handlePickupChange}
                      placeholder="Pickup Location"
                      type="text"
                      className="bg-white text-black placeholder:text-gray-400"
                      onClick={() => setActiveField('pickup')}
                    />
                    <button
                      type="button"
                      onClick={autofillPickup}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black"
                    >
                      <FaLocationArrow className="text-xl" />
                    </button>
                    {activeField === 'pickup' && pickupSuggestions.length > 0 && (
                      <LocationSearchPanel
                        suggestions={pickupSuggestions}
                        onSelect={(suggestion) => {
                          setPickup(suggestion);
                          setActiveField(null);
                        }}
                      />
                    )}
                  </div>
                  {/* Destination Field */}
                  <div className="relative">
                    <Input
                      value={destination}
                      onChange={handleDestinationChange}
                      placeholder="Destination"
                      type="text"
                      className="bg-white text-black placeholder:text-gray-400"
                      onClick={() => setActiveField('destination')}
                    />
                    {activeField === 'destination' && destinationSuggestions.length > 0 && (
                      <LocationSearchPanel
                        suggestions={destinationSuggestions}
                        onSelect={(suggestion) => {
                          setDestination(suggestion);
                          setActiveField(null);
                        }}
                      />
                    )}
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button variant="primary" className="w-full" type="submit">
                      Get Estimate
                    </Button>
                  </motion.div>
                </form>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      <StatsSection />

      <AnimatedSection id="services" className="py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParallaxSection>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Our Services
            </h2>
          </ParallaxSection>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} delay={index * 0.2} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParallaxSection>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              What Our Clients Say
            </h2>
          </ParallaxSection>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <FadeInSection key={index} direction="up" delay={index * 0.2}>
                <TestimonialCard {...testimonial} />
              </FadeInSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <footer className="bg-black text-white py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <FadeInSection direction="up">
              <h3 className="text-2xl font-bold mb-4">Gatiyan</h3>
              <p className="text-gray-400">Your premium ride service</p>
            </FadeInSection>
            <FadeInSection direction="up" delay={0.1}>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-gray-400 hover:text-white transition"
                  >
                    Services
                  </button>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </button>
                </motion.li>
              </ul>
            </FadeInSection>
            <FadeInSection direction="up" delay={0.2}>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <button className="text-gray-400 hover:text-white transition">
                    Premium Rides
                  </button>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <button className="text-gray-400 hover:text-white transition">
                    Airport Transfer
                  </button>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <button className="text-gray-400 hover:text-white transition">
                    Corporate Service
                  </button>
                </motion.li>
              </ul>
            </FadeInSection>
            <FadeInSection direction="up" delay={0.3}>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <motion.button 
                  className="text-gray-400 hover:text-white transition"
                  whileHover={{ y: -3 }}
                >
                  Twitter
                </motion.button>
                <motion.button 
                  className="text-gray-400 hover:text-white transition"
                  whileHover={{ y: -3 }}
                >
                  Facebook
                </motion.button>
                <motion.button 
                  className="text-gray-400 hover:text-white transition"
                  whileHover={{ y: -3 }}
                >
                  Instagram
                </motion.button>
              </div>
            </FadeInSection>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Gatiyan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Start;
