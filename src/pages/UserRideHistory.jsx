import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaWallet, FaUser, FaSyncAlt } from "react-icons/fa";
import Usersnavbar from "../components/Usersnavbar";

const UserRideHistory = () => {
  const { socket } = useContext(SocketContext);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshCooldown, setRefreshCooldown] = useState(0); // Cooldown in seconds
  const navigate = useNavigate();

  const statusTabs = [
    { key: "all", label: "All", color: "gray" },
    { key: "pending", label: "Pending", color: "yellow" },
    { key: "accepted", label: "Accepted", color: "purple" },
    { key: "ongoing", label: "Ongoing", color: "blue" },
    { key: "completed", label: "Completed", color: "green" },
    { key: "cancelled", label: "Cancelled", color: "red" },
  ];

  const fetchRideHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/user/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Fetched Rides:", res.data);
      setRides(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch ride history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideHistory();
  }, []);

  // Handle refresh button click with cooldown
  const handleRefresh = () => {
    if (refreshCooldown === 0) {
      fetchRideHistory();
      setRefreshCooldown(30);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (refreshCooldown > 0) {
      const timer = setInterval(() => {
        setRefreshCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [refreshCooldown]);

  // Socket.io real-time updates
  useEffect(() => {
    if (socket) {
      socket.on("ride-status-updated", (updatedRide) => {
        console.log("Socket Update:", updatedRide);
        setRides((prevRides) => {
          const rideExists = prevRides.some((ride) => ride._id === updatedRide._id);
          if (rideExists) {
            return prevRides.map((ride) =>
              ride._id === updatedRide._id ? updatedRide : ride
            );
          } else {
            return [...prevRides, updatedRide];
          }
        });
      });
      return () => socket.off("ride-status-updated");
    }
  }, [socket]);

  const filteredRides = () => {
    if (activeTab === "all") return rides;
    return rides.filter((ride) => ride.status.toLowerCase() === activeTab);
  };

  const renderRideCard = (ride) => (
    <motion.div
      key={ride._id}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => navigate(`/rides/${ride._id}`)}
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 truncate">
        {ride.pickup} to {ride.destination}
      </h3>
      <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
        <div className="flex items-center">
          <FaCalendarAlt className="text-blue-600 mr-2" />
          <p className="text-gray-700 truncate">
            <strong>Date:</strong> {ride.rideDate}
          </p>
        </div>
        <div className="flex items-center">
          <FaClock className="text-blue-600 mr-2" />
          <p className="text-gray-700 truncate">
            <strong>Time:</strong> {ride.rideTime}
          </p>
        </div>
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-red-600 mr-2" />
          <p className="text-gray-700">
            <strong>Status:</strong>{" "}
            <span
              className={`${
                ride.status === "completed"
                  ? "text-green-600"
                  : ride.status === "ongoing"
                  ? "text-blue-600"
                  : ride.status === "cancelled"
                  ? "text-red-600"
                  : ride.status === "accepted"
                  ? "text-purple-600"
                  : "text-yellow-600"
              }`}
            >
              {ride.status}
            </span>
          </p>
        </div>
        <div className="flex items-center">
          <FaWallet className="text-green-600 mr-2" />
          <p className="text-gray-700">
            <strong>Fare:</strong> ₹{ride.fare}
          </p>
        </div>
        {ride.captain && (
          <div className="flex items-center">
            <FaUser className="text-orange-600 mr-2" />
            <p className="text-gray-700 truncate">
              <strong>Captain:</strong> {ride.captain.fullname.firstname}{" "}
              {ride.captain.fullname.lastname}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      <Usersnavbar />
      <div className="bg-gray-100 min-h-screen p-4 sm:p-6 pt-16 sm:pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Ride History</h1>
            <button
              onClick={handleRefresh}
              disabled={refreshCooldown > 0}
              className={`relative flex items-center px-3 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                refreshCooldown > 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <FaSyncAlt className={`mr-2 ${refreshCooldown > 0 ? "" : "animate-spin-slow"}`} />
              {refreshCooldown > 0 ? `Refresh in ${refreshCooldown}s` : "Refresh"}
              {/* Circular Progress Animation */}
              {refreshCooldown > 0 && (
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 36 36"
                >
                  <circle
                    className="stroke-current text-blue-600"
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray="100"
                    strokeDashoffset={100 - (refreshCooldown / 30) * 100}
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Tabbed Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center px-3 py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.key
                    ? `bg-${tab.color}-600 text-white shadow-md`
                    : `bg-${tab.color}-100 text-${tab.color}-800 hover:bg-${tab.color}-200`
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 bg-${tab.color}-500 ${
                    activeTab === tab.key ? "bg-white" : ""
                  }`}
                ></span>
                {tab.label} (
                {activeTab === tab.key
                  ? filteredRides().length
                  : rides.filter((r) => r.status.toLowerCase() === tab.key).length}
                )
              </button>
            ))}
          </div>

          {/* Ride Content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={50} color={"#123abc"} loading={loading} />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 text-lg sm:text-xl">{error}</div>
          ) : rides.length === 0 ? (
            <p className="text-center text-gray-600 text-lg sm:text-xl">
              No rides found in your history.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRides().length > 0 ? (
                filteredRides().map(renderRideCard)
              ) : (
                <p className="text-center text-gray-600 text-lg sm:text-xl col-span-full">
                  No {activeTab === "all" ? "" : activeTab} rides found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for Animation */}
      <style>{`
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-gray-400 {
          scrollbar-color: #9ca3af #e5e7eb;
        }
      `}</style>
    </>
  );
};

export default UserRideHistory;