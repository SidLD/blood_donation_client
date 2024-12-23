import { motion } from "framer-motion";
import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800"
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.div
        className="text-2xl font-semibold text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Loading...
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
