import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ConfirmRide = (props) => {
  // Store selected dates as Date objects
  const [rideDate, setRideDate] = useState(null);
  const [rideTime, setRideTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;

  // Preload Razorpay script (optional, for speed)
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Format date to YYYY-MM-DD and time to HH:MM
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    const hours = `${date.getHours()}`.padStart(2, "0");
    const minutes = `${date.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleConfirmRide = async () => {
    if (!rideDate || !rideTime) {
      setShowValidationModal(true);
      return;
    }
    setIsSubmitting(true);

    const rideData = {
      pickup: props.pickup,
      destination: props.destination,
      vehicleType: props.vehicleType,
      fare: props.fare[props.vehicleType],
      rideDate: formatDate(rideDate),
      rideTime: formatTime(rideTime),
      paymentType: paymentMethod,
    };

    try {
      // Step 1: Create ride
      const createResponse = await axios.post(
        `${baseUrl}/rides/create`,
        rideData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const rideId = createResponse.data.ride._id;

      // Step 2: Payment
      if (paymentMethod === "online") {
        if (!window.Razorpay) {
          setErrorMessage(
            "Razorpay SDK failed to load. Please check your internet connection."
          );
          setShowErrorModal(true);
          return;
        }
        const { data } = await axios.post(`${baseUrl}/payments/create-order`, {
          amount: props.fare[props.vehicleType],
          rideId,
        });
        const options = {
          key: razorpayKey,
          amount: data.amount,
          currency: data.currency,
          order_id: data.id,
          name: "My Ride App",
          description: "Ride Payment",
          handler: async function (response) {
            await axios.post(`${baseUrl}/payments/verify-payment`, {
              rideId,
              orderId: data.id,
              transactionId: response.razorpay_payment_id,
            });
            confirmRideAPI(rideId);
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        // Cash Payment
        confirmRideAPI(rideId);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmRideAPI = async (rideId) => {
    try {
      await axios.post(
        `${baseUrl}/rides/confirm`,
        { rideId, paymentType: paymentMethod },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      props.onConfirmRideSuccess && props.onConfirmRideSuccess({ rideId });
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred while confirming your ride";
    setErrorMessage(errorMsg);
    setShowErrorModal(true);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow relative">
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-xl font-semibold mb-2 text-red-600">
              Booking Failed
            </h3>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-red-600 text-white font-semibold p-2 rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Validation Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-xl font-semibold mb-2">
              Date and Time Required
            </h3>
            <p className="text-gray-600 mb-4">
              Please select both a date and time for your ride.
            </p>
            <button
              onClick={() => setShowValidationModal(false)}
              className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-semibold mb-5 text-center">
        Confirm your Ride
      </h3>
      <div className="w-full">
        <div className="p-3 border-b-2">
          <h3 className="text-lg font-medium">{props.pickup}</h3>
          <p className="text-sm text-gray-600">Pickup Location</p>
        </div>
        <div className="p-3 border-b-2">
          <h3 className="text-lg font-medium">{props.destination}</h3>
          <p className="text-sm text-gray-600">Drop-off Location</p>
        </div>
        <div className="p-3 border-b-2">
          <h3 className="text-lg font-medium">₹{props.fare[props.vehicleType]}</h3>
          <p className="text-sm text-gray-600">{props.vehicleType}</p>
        </div>

        {/* Payment Method */}
        <div className="p-3 border-b-2">
          <label className="block text-sm font-medium mb-2">
            Payment Method
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              Cash Payment
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Online Payment
            </label>
          </div>
        </div>

        {/* Date & Time */}
        <div className="p-3">
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Select Ride Date:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <FaCalendarAlt className="text-gray-500" />
              </span>
              <ReactDatePicker
                selected={rideDate}
                onChange={(date) => setRideDate(date)}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select ride date"
                className="border border-gray-300 pl-10 pr-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Select Ride Time:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <FaClock className="text-gray-500" />
              </span>
              <ReactDatePicker
                selected={rideTime}
                onChange={(time) => setRideTime(time)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="HH:mm"
                placeholderText="Select ride time"
                className="border border-gray-300 pl-10 pr-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleConfirmRide}
        disabled={isSubmitting || props.buttonDisabled}
        className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg hover:bg-green-700 transition-all"
      >
        {isSubmitting ? "Confirming..." : "Confirm Ride"}
      </button>
    </div>
  );
};

export default ConfirmRide;
