import React, { useState } from 'react';

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      title: '1. Introduction',
      content: `At GatiYan, we are committed to safeguarding your privacy and ensuring the security of your personal data. This Privacy Policy outlines the types of information we collect, the manner in which we use and protect such information, and your rights regarding your personal data when you access or use our cab service platform.`
    },
    {
      title: '2. Information Collection',
      content: `We collect various types of information to facilitate our services. This may include:
      - **Personal Identification Data:** Such as your name, contact details, and payment information.
      - **Usage Data:** Including ride history, booking details, and interactions with our website or mobile application.
      Data is collected via registration forms, ride bookings, and interactions with our customer support team.`
    },
    {
      title: '3. Use of Information',
      content: `The information collected is employed for the following purposes:
      - To facilitate and manage ride bookings.
      - To process payments securely.
      - To enhance and personalize our services.
      - To communicate updates, offers, and other pertinent information.
      - To ensure compliance with legal obligations and protect against fraud.
      We use your information solely for these purposes and in accordance with applicable legal standards.`
    },
    {
      title: '4. Information Sharing and Disclosure',
      content: `Your personal data will only be shared under the following circumstances:
      - With trusted service providers who assist in payment processing, customer support, or service delivery.
      - In response to legal requests or where required by law.
      - With your explicit consent.
      Under no circumstances do we sell or lease your personal information to third parties for marketing purposes.`
    },
    {
      title: '5. Data Security',
      content: `We implement robust security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. These measures include encryption protocols, secure storage, and regular security audits. Despite these measures, no method of electronic storage or transmission is entirely secure; however, we continuously strive to safeguard your information.`
    },
    {
      title: '6. Your Rights',
      content: `You retain the right to access, correct, or delete your personal data held by us. Additionally, you may object to or request the restriction of our processing of your information. To exercise these rights or for any privacy-related concerns, please contact our support team using the contact details provided below.`
    },
    {
      title: '7. Changes to This Privacy Policy',
      content: `This Privacy Policy may be updated periodically to reflect changes in our practices or regulatory requirements. Any modifications will be posted on our website along with the revised effective date. Continued use of our services following any updates constitutes your acceptance of the revised Privacy Policy.`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-400">
          Privacy Policy
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
              Your continued use of our services signifies your acceptance of the terms outlined in this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
