import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="hero-title">MOOD</h1>
      <p className="hero-subtitle">Цифровой дневник настроений</p>
    </motion.section>
  );
};

export default Hero;
