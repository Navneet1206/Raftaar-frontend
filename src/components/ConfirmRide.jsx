import React, { useState } from "react";
import axios from "axios";

const ConfirmRide = (props) => {
  const [rideDate, setRideDate] = useState("");
  const [rideTime, setRideTime] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY; // ✅ Load Razorpay Key from .env
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
        rideDate,
        rideTime,
        paymentType: paymentMethod,
    };

    try {
        // ✅ Step 1: Ride Create API Call
        const createResponse = await axios.post(`${baseUrl}/rides/create`, rideData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const rideId = createResponse.data.ride._id;

        // ✅ Step 2: Payment Handling
        if (paymentMethod === "online") {
            // ✅ Load Razorpay Script First
            const loadRazorpayScript = () => {
                return new Promise((resolve) => {
                    if (window.Razorpay) {
                        resolve(true); // Already loaded
                        return;
                    }
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = () => {
                        console.log("✅ Razorpay script loaded");
                        resolve(true);
                    };
                    script.onerror = () => {
                        console.log("❌ Razorpay script failed to load");
                        resolve(false);
                    };
                    document.body.appendChild(script);
                });
            };

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setErrorMessage("Razorpay SDK failed to load. Please check your internet connection.");
                setShowErrorModal(true);
                return;
            }

            // 🛠 Razorpay Order Creation
            const { data } = await axios.post(`${baseUrl}/payments/create-order`, {
                amount: props.fare[props.vehicleType],
                rideId,
            });

            console.log("✅ Order Created:", data);

            // 🚀 Razorpay Checkout
            const options = {
                key: razorpayKey,
                amount: data.amount,
                currency: data.currency,
                order_id: data.id,
                name: "My Ride App",
                description: "Ride Payment",
                handler: async function (response) {
                    console.log("✅ Payment Successful:", response);
                    await axios.post(`${baseUrl}/payments/verify-payment`, {
                        rideId,
                        orderId: data.id,
                        transactionId: response.razorpay_payment_id,
                    });

                    confirmRideAPI(rideId);
                },
                prefill: {
                    name: "Navneet Vishwakarma", // Can be dynamic
                    email: "rajvl132011@gmail.com", // Can be dynamic
                    contact: "+91 8435061006", // Can be dynamic
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } else {
            // ✅ Cash Payment Case
            confirmRideAPI(rideId);
        }
    } catch (error) {
        handleError(error);
    } finally {
        setIsSubmitting(false);
    }
};


  // ✅ Ride Confirm API
  const confirmRideAPI = async (rideId) => {
    try {
      await axios.post(`${baseUrl}/rides/confirm`, { rideId, paymentType: paymentMethod }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setShowSuccess(true);
      props.onRideConfirmed && props.onRideConfirmed();
      setTimeout(() => {
        props.resetFlow && props.resetFlow();
      }, 2000);
    } catch (error) {
      handleError(error);
    }
  };

  // ❌ Handle Errors
  const handleError = (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred while confirming your ride";
    setErrorMessage(errorMsg);
    setShowErrorModal(true);
  };

  // ✅ Success Message
  if (showSuccess) {
    return (
      <div className="bg-green-100 p-6 rounded-lg text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Congratulations! 🎉</h2>
        <p className="text-green-700">Your ride has been successfully confirmed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow relative">
      {/* ✅ Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-xl font-semibold mb-2 text-red-600">Booking Failed</h3>
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

      {/* ✅ Validation Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-xl font-semibold mb-2">Date and Time Required</h3>
            <p className="text-gray-600 mb-4">Please select both a date and time for your ride.</p>
            <button
              onClick={() => setShowValidationModal(false)}
              className="w-full bg-blue-600 text-white font-semibold p-2 rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-semibold mb-5 text-center">Confirm your Ride</h3>
      <div className="w-full">
        {/* 🏁 Pickup Location */}
        <div className="p-3 border-b-2">
          <h3 className="text-lg font-medium">{props.pickup}</h3>
          <p className="text-sm text-gray-600">Pickup Location</p>
        </div>
        {/* 🏁 Destination */}
        <div className="p-3 border-b-2">
          <h3 className="text-lg font-medium">{props.destination}</h3>
          <p className="text-sm text-gray-600">Drop-off Location</p>
        </div>
        {/* 💰 Fare & Vehicle Type */}
        <div className="p-3 border-b-2">
          <h3 className="text-lg font-medium">₹{props.fare[props.vehicleType]}</h3>
          <p className="text-sm text-gray-600">{props.vehicleType}</p>
        </div>

        {/* 💳 Payment Method */}
        <div className="p-3 border-b-2">
          <label className="block text-sm font-medium mb-2">Payment Method</label>
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

        {/* 📆 Date & Time Input */}
        <div className="p-3">
          <label className="text-gray-600 text-sm">Select Ride Date:</label>
          <input
            className="border p-2 rounded w-full"
            type="date"
            value={rideDate}
            onChange={(e) => setRideDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
          <label className="text-gray-600 text-sm mt-2">Select Ride Time:</label>
          <input
            className="border p-2 rounded w-full"
            type="time"
            value={rideTime}
            onChange={(e) => setRideTime(e.target.value)}
            required
          />
        </div>
      </div>

      {/* 🚀 Confirm Ride Button */}
      <button
        onClick={handleConfirmRide}
        disabled={isSubmitting}
        className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg hover:bg-green-700"
      >
        {isSubmitting ? "Confirming..." : "Confirm Ride"}
      </button>
    </div>
  );
};

export default ConfirmRide;
