import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import 'remixicon/fonts/remixicon.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserSignup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobileNumber: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const submitFormData = new FormData();
    submitFormData.append("fullname[firstname]", formData.firstName);
    submitFormData.append("fullname[lastname]", formData.lastName);
    submitFormData.append("email", formData.email);
    submitFormData.append("password", formData.password);
    submitFormData.append("mobileNumber", formData.mobileNumber);

    if (profilePhoto) {
      submitFormData.append("profilePhoto", profilePhoto);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        submitFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        toast.success("OTP sent to your email and mobile number!");
        navigate('/verify-email-otp', {
          state: { email: formData.email, mobileNumber: formData.mobileNumber, userType: 'user' },
        });
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Using a grayscale progression for the password strength indicator
  const renderPasswordStrengthIndicator = () => {
    const colors = ['bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-black'];
    return (
      <div className="flex space-x-1 mt-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-full rounded ${index < passwordStrength ? colors[index] : 'bg-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  required
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={updateFormData}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  required
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={updateFormData}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                required
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={updateFormData}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                required
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={updateFormData}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
              />
              {renderPasswordStrengthIndicator()}
              <p className="text-xs text-gray-600 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>
            <button
              type="button"
              onClick={nextStep}
              disabled={
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.password
              }
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition duration-300"
            >
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">+91</span>
                <input
                  required
                  name="mobileNumber"
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={updateFormData}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
              <input
                type="file"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 bg-white text-black border border-black py-2 rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!formData.mobileNumber || isLoading}
                className="w-1/2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition duration-300"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-gray-300">
        <div className="text-center mb-8">
          <img
            className="w-16 mx-auto mb-4 animate-bounce"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
            alt="Logo"
          />
          <h1 className="text-2xl font-bold text-black">Create Account</h1>
          <div className="flex justify-center mt-4">
            {[1, 2].map((step) => (
              <div
                key={step}
                className={`w-8 h-1 mx-1 rounded-full ${currentStep === step ? 'bg-black' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          {renderStepContent()}
        </form>

        <p className="text-center mt-6 text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-black hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
