import React from 'react';
import { motion } from 'framer-motion';
import FadeInSection from './FadeInSection';

const stats = [
  { label: 'Happy Customers', value: '10K+' },
  { label: 'Cities', value: '50+' },
  { label: 'Professional Drivers', value: '1000+' },
  { label: 'Years of Service', value: '5+' },
];

const StatsSection = () => {
  return (
    <div className="bg-black text-white py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <FadeInSection
              key={index}
              direction="up"
              delay={index * 0.1}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;