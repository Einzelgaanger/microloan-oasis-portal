
import { motion } from "framer-motion";
import React, { ReactNode } from "react";

// Floating animation for elements
export const FloatingElement: React.FC<{
  children: ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

// Fade in animation for page elements
export const FadeIn: React.FC<{
  children: ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered items for lists
export const StaggeredItems: React.FC<{
  children: ReactNode[];
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1,
            ease: "easeOut",
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

// Animated gradient background
export const AnimatedGradientBackground: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
  return (
    <motion.div
      className={`fixed inset-0 -z-10 ${className}`}
      style={{
        background: "linear-gradient(60deg, #1a365d, #2c7a7b, #d69e2e)",
        backgroundSize: "400% 400%",
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      }}
    />
  );
};

// Pulse animation
export const PulseAnimation: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

// Floating cartoon character
export const FloatingCharacter: React.FC<{
  character: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}> = ({ character, position = "bottom-right", className = "" }) => {
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  return (
    <FloatingElement className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      <div className="text-4xl">{character}</div>
    </FloatingElement>
  );
};
