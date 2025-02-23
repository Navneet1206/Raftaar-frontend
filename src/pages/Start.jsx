import React, { useState } from 'react';
import { Car, Shield, Clock, MapPin, Phone } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';

function Start() {
  const navigate = useNavigate();

  // State for ride input on the landing page
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');

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

  // When the form is submitted, check login status and redirect accordingly
  const handleSubmit = (e) => {
    e.preventDefault();
    const rideInput = { pickup, destination };
    if (localStorage.getItem('token')) {
      // User is logged in: Navigate to the secure Home route, passing the input via state
      navigate('/home', { state: rideInput });
    } else {
      // User is not logged in: Store the input temporarily and navigate to login/signup
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
                Your Premium Cab Service
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience luxury and comfort with Netwaycab's premium ride service.
              </p>
              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => scrollToSection('services')}
                  >
                    Our Services
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => scrollToSection('contact')}
                  >
                    Contact Us
                  </Button>
                </motion.div>
              </div>
            </FadeInSection>
            
            <FadeInSection direction="right" delay={0.2}>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Book Your Ride</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Pickup Location"
                    type="text"
                    className="bg-white/5 text-white placeholder:text-gray-400"
                  />
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Destination"
                    type="text"
                    className="bg-white/5 text-white placeholder:text-gray-400"
                  />
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

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section */}
      <AnimatedSection id="services" className="py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParallaxSection>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Our Services
            </h2>
          </ParallaxSection>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
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

      {/* Contact Section */}
      <AnimatedSection id="contact" className="py-20 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <FadeInSection direction="left" className="p-12 text-white">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-gray-300 mb-8">
                  Have questions? We're here to help 24/7
                </p>
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center gap-3"
                    whileHover={{ x: 10 }}
                  >
                    <Phone className="w-5 h-5" />
                    <span>+1 (555) 123-4567</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3"
                    whileHover={{ x: 10 }}
                  >
                    <MapPin className="w-5 h-5" />
                    <span>123 Business Avenue, City</span>
                  </motion.div>
                </div>
              </FadeInSection>
              <FadeInSection direction="right" className="bg-white p-12">
                <form className="space-y-6">
                  <Input label="Name" type="text" />
                  <Input label="Email" type="email" />
                  <Input label="Phone" type="tel" />
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button variant="primary" className="w-full">
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </FadeInSection>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <FadeInSection direction="up">
              <h3 className="text-2xl font-bold mb-4">Netwaycab</h3>
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
            <p>&copy; 2025 Netwaycab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Start;
