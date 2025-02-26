import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, mobileNumber, userType } = location.state || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`email-otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`email-otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some(digit => digit === '')) {
      setError('Please enter all 6 digits');
      return;
    }
    const completeOtp = otp.join('');
    console.log('Submitting Email OTP:', completeOtp);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/verify-email-otp`,
        { email, otp: completeOtp }
      );
      console.log('Server Response:', response.data);
      setSuccess(response.data.message);
      setError('');
      // After successful email verification, navigate to mobile OTP verification page
      navigate("/verify-mobile-otp", { state: { email, mobileNumber, userType } });
    } catch (err) {
      console.error('Error verifying OTP:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to {email || 'your email address'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`email-otp-input-${index}`}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                autoFocus={index === 0}
              />
            ))}
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {success && <p className="text-sm text-green-600 text-center">{success}</p>}
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <div className="text-sm text-gray-700">
              <p>
                <span className="font-medium">Email:</span> {email || 'Not provided'}
              </p>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailOTP;
