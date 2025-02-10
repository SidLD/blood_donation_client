import { motion } from "framer-motion"
import type React from "react"

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-full bg-gray-800"
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {["#FF0000", "#00FF00", "#0000FF"].map((color, index) => (
          <motion.span
            key={color}
            className="absolute top-0 left-0 w-full h-full rounded-full"
            style={{
              border: `4px solid ${color}`,
              borderTopColor: "transparent",
              borderRightColor: "transparent",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="mt-4 text-2xl font-semibold text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Loading...
      </motion.div>
    </motion.div>
  )
}

export default LoadingScreen

