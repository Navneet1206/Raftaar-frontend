import React, { useState } from 'react';
import { Car, Shield, Clock, MapPin, Star, Phone, CheckCircle, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Start = () => {
  // State for the contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // State for the ride booking form (pickup and destination)
  const [rideData, setRideData] = useState({
    pickup: '',
    destination: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState({ show: false, success: false });
  const [menuOpen, setMenuOpen] = useState(false);

  const services = [
    {
      title: "Daily Rides",
      icon: <Car className="w-10 h-10 mx-auto text-black" />,
      description: "Comfortable daily commute with professional drivers"
    },
    {
      title: "Premium Rides",
      icon: <Star className="w-10 h-10 mx-auto text-black" />,
      description: "Luxury vehicles for special occasions and business travel"
    },
    {
      title: "Express Pool",
      icon: <Clock className="w-10 h-10 mx-auto text-black" />,
      description: "Share your ride and save with Express Pool options"
    }
  ];

  const stats = [
    { value: "1M+", label: "Happy Riders" },
    { value: "50K+", label: "Pro Drivers" },
    { value: "100+", label: "Cities" },
    { value: "4.9", label: "Rating" }
  ];

  // Handler for contact form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for the ride booking form
  const handleRideChange = (e) => {
    const { name, value } = e.target;
    setRideData(prev => ({ ...prev, [name]: value }));
  };

  const handleRideSubmit = (e) => {
    e.preventDefault();
    // For demonstration, we simply alert the entered values.
    alert(`Ride booked from ${rideData.pickup} to ${rideData.destination}`);
    setRideData({ pickup: '', destination: '' });
  };

  // Handler for contact form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and show success message
      setFormData({ name: '', email: '', message: '' });
      setSubmitStatus({ show: true, success: true });
      
      // Hide the message after 3 seconds
      setTimeout(() => {
        setSubmitStatus({ show: false, success: false });
      }, 3000);
    } catch (error) {
      setSubmitStatus({ show: true, success: false });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <header className="bg-black shadow-md fixed w-full z-30">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-white">RideShare</Link>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-300 hover:text-white transition">Rides</a>
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
            </div>
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 focus:outline-none">
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-black shadow-md">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <a href="#services" className="block text-gray-300 hover:text-white transition">Rides</a>
              <a href="#about" className="block text-gray-300 hover:text-white transition">About</a>
              <a href="#contact" className="block text-gray-300 hover:text-white transition">Contact</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-16 md:pt-20 bg-gradient-to-r from-black to-gray-800 relative">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center py-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Your Ride, Your Way</h1>
            <p className="text-lg sm:text-xl text-white mb-8">
              Experience safe, reliable, and affordable rides at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/login">
                <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                  Book a Ride
                </button>
              </Link>
              <Link to="/captain-login">
                <button className="bg-black text-white border border-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition">
                  Become a Driver
                </button>
              </Link>
              <Link to="/admin/login">
                <button className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
                  Admin
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Book Your Ride</h2>
              <form onSubmit={handleRideSubmit} className="space-y-4">
                <input
                  type="text"
                  name="pickup"
                  placeholder="Pickup Location"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  value={rideData.pickup}
                  onChange={handleRideChange}
                  required
                />
                <input
                  type="text"
                  name="destination"
                  placeholder="Destination"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  value={rideData.destination}
                  onChange={handleRideChange}
                  required
                />
                <button type="submit" className="w-full bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition">
                  Get Ride
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
                {service.icon}
                <h3 className="text-xl font-semibold text-center text-gray-800 mt-4">{service.title}</h3>
                <p className="text-gray-600 text-center mt-2">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Professional Driver"
              className="rounded-xl shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About RideShare</h2>
            <p className="text-gray-700 mb-6">
              Founded in 2020, RideShare has revolutionized urban transportation by connecting riders with reliable drivers. Our mission is to make transportation accessible, safe, and comfortable.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
                  <div className="text-2xl font-bold text-black">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-12 bg-black">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 text-center md:text-left text-white">
            <h2 className="text-3xl font-bold mb-4">Download Our App</h2>
            <p className="mb-6">
              Enjoy seamless ride-booking with our mobile app available for iOS and Android.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=50&q=80" 
                alt="App Store" 
                className="h-12 rounded-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=50&q=80" 
                alt="Play Store" 
                className="h-12 rounded-lg"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=600&q=80" 
              alt="App Preview" 
              className="mx-auto rounded-3xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-black p-6 flex flex-col justify-center text-white">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="mb-4">We are here to help you 24/7.</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>123 Ride Street, Transit City</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitStatus.show && (
                    <div className={`p-3 rounded flex items-center space-x-2 ${submitStatus.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      <CheckCircle className="w-5 h-5" />
                      <span>{submitStatus.success ? 'Message sent successfully!' : 'Error sending message. Try again.'}</span>
                    </div>
                  )}
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message"
                    required
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  ></textarea>
                  <button type="submit" className="w-full bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-6">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">RideShare</h3>
              <p className="text-gray-400">Your trusted ride-sharing partner</p>
            </div>
            <div className="flex space-x-6">
              <a href="#services" className="text-gray-400 hover:text-white transition">Rides</a>
              <a href="#about" className="text-gray-400 hover:text-white transition">About</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500 text-sm">
            <p>&copy; 2025 RideShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Start;
