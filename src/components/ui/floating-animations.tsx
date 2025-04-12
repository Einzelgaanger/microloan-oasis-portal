
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, ThumbsUp, Award, Landmark, Banknote, CreditCard } from 'lucide-react';

// A floating character that animates across the screen
export const FloatingCharacter: React.FC<{
  icon?: React.ReactNode;
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  delay?: number;
}> = ({ 
  icon, 
  color = "text-lending-primary", 
  size = 40,
  top = "10%",
  left = "5%",
  delay = 0
}) => {
  const randomFloat = React.useMemo(() => ({
    x: Math.random() * 20 - 10,
    y: Math.random() * 20 - 10,
  }), []);

  return (
    <motion.div
      className={`absolute ${color} z-10 opacity-70`}
      style={{
        top,
        left,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 0.7,
        scale: 1,
        x: [0, randomFloat.x, -randomFloat.x, randomFloat.x, 0],
        y: [0, randomFloat.y, -randomFloat.y, randomFloat.y, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      {icon || <ShieldCheck size={size} />}
    </motion.div>
  );
};

// A set of Kenya-themed floating elements
export const KenyaFloatingElements: React.FC<{ count?: number }> = ({ count = 6 }) => {
  const icons = [
    <ShieldCheck className="text-lending-primary" />,
    <AlertCircle className="text-green-500" />,
    <ThumbsUp className="text-yellow-500" />,
    <Award className="text-red-500" />,
    <Landmark className="text-blue-500" />,
    <Banknote className="text-purple-500" />,
    <CreditCard className="text-green-400" />,
    <div className="text-4xl">🇰🇪</div>,
    <div className="text-3xl">🦁</div>,
    <div className="text-3xl">🌍</div>,
  ];

  return (
    <>
      {Array.from({ length: Math.min(count, icons.length) }).map((_, i) => (
        <FloatingCharacter
          key={i}
          icon={icons[i]}
          top={`${15 + Math.random() * 70}%`}
          left={`${5 + Math.random() * 90}%`}
          delay={i * 0.8}
          size={32 + Math.random() * 16}
        />
      ))}
    </>
  );
};

// A background gradient that changes colors slowly
export const DynamicBackground: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.div
      className={`fixed inset-0 -z-10 opacity-20 ${className}`}
      style={{ 
        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        backgroundSize: '400% 400%',
      }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%'],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
  );
};

// A badge that bounces when it appears
export const BouncyBadge: React.FC<{
  children: React.ReactNode;
  color?: string;
}> = ({ children, color = "bg-lending-primary" }) => {
  return (
    <motion.span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color} text-white`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      {children}
    </motion.span>
  );
};

// A Kenyan flag that waves
export const WavingFlag: React.FC<{ className?: string, size?: number }> = ({ className = "", size = 48 }) => {
  return (
    <motion.div 
      className={`text-${size} ${className}`}
      animate={{
        rotate: [0, 5, -5, 5, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      🇰🇪
    </motion.div>
  );
};

// Export all animated elements for easy import
export const AnimatedElements = {
  FloatingCharacter,
  KenyaFloatingElements,
  DynamicBackground,
  BouncyBadge,
  WavingFlag,
};
