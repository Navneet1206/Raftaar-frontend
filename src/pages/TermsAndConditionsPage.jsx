import React, { useState } from 'react';

const TermsAndConditionsPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      title: '1. Introduction',
      content: `Welcome to our esteemed cab service platform. This document, titled "Terms and Conditions," constitutes a legally binding agreement between you, the esteemed user, and our company. By accessing or utilizing our services, you affirm that you have read, comprehended, and agree to be bound by the terms and stipulations set forth herein.`
    },
    {
      title: '2. Booking Procedures',
      content: `All ride reservations must be executed exclusively through our official website. Users are required to furnish precise and complete information during the booking process. A reservation shall be deemed officially confirmed only when simultaneous confirmations are issued via SMS, telephone call, and email, thereby ensuring the accuracy and reliability of the booking.`
    },
    {
      title: '3. Pricing and Payment',
      content: `Fares are determined based on the aggregate distance traveled, the duration of the journey, and any applicable surcharges. Payment methods include, but are not limited to, cash, Unified Payments Interface (UPI), credit/debit cards, and online payment gateways. It is important to note that fares may be subject to variation due to operational factors, with additional charges potentially incurred for waiting times, tolls, or ancillary services rendered.`
    },
    {
      title: '4. Cancellation Policy',
      content: `Users may cancel a ride prior to the driver's arrival at the designated pickup location and receive a full refund. However, a cancellation fee may be levied if the cancellation occurs after the driver has been dispatched. Refunds, where applicable, will be processed within two business days. Furthermore, the company reserves the right to cancel reservations in instances of operational exigencies or safety concerns.`
    },
    {
      title: '5. User Responsibilities',
      content: `Users are expected to adhere to the following responsibilities:
      - Furnish accurate and verifiable personal information.
      - Arrive punctually at the specified pickup location.
      - Exhibit respectful conduct towards both drivers and fellow passengers.
      - Abide by all relevant local laws and regulations.
      - Refrain from causing damage to the vehicle.
      - Abstain from engaging in any unlawful activities during the course of the ride.`
    },
    {
      title: '6. Driver Guidelines',
      content: `Drivers are mandated to:
      - Possess a valid and current driving license.
      - Strictly comply with all traffic regulations and safety protocols.
      - Maintain a professional and courteous demeanor at all times.
      - Ensure that the vehicle is maintained in a state of cleanliness and roadworthiness.
      - Prioritize the safety and comfort of passengers.
      - Avoid any practice of overcharging.
      - Promptly report any incidents or discrepancies to the appropriate authorities.`
    },
    {
      title: '7. Privacy and Data Protection',
      content: `All personal data is collected and processed in strict accordance with our Privacy Policy. User information shall not be disseminated to third parties except where required by law or for the purpose of facilitating service delivery. Our company is unwavering in its commitment to safeguarding user privacy and ensuring the confidentiality of all data collected.`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-400">
          Terms and Conditions
        </h1>

        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div 
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-700 transition"
                onClick={() => setActiveSection(activeSection === index ? null : index)}
              >
                <h2 className="text-xl font-semibold text-blue-300">
                  {section.title}
                </h2>
                <svg 
                  className={`w-6 h-6 text-blue-400 transform transition-transform ${
                    activeSection === index ? 'rotate-180' : ''
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>

              {activeSection === index && (
                <div className="p-5 bg-gray-700 text-gray-300">
                  <p>{section.content}</p>
                </div>
              )}
            </div>
          ))}

          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <h3 className="text-2xl font-bold text-blue-400 mb-4 text-center">
              Contact Information
            </h3>
            <div className="text-center text-gray-300 space-y-2">
              <p>Phone: 7470320917</p>
              <p>Email: support.gatiyan@gatiyan.com</p>
              <p>Address: Dhawari Satna, Madhya Pradesh</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h4 className="text-xl font-semibold text-blue-400 mb-4 text-center">
              Last Updated: March 2025
            </h4>
            <p className="text-gray-300 text-center">
              Your continued use of our services shall be deemed as an unequivocal acceptance of these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
