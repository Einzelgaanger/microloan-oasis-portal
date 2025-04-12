
import React from 'react';
import { motion } from 'framer-motion';
import { PulseAnimation, FloatingElement } from './animations';

// User rank badges
export const rankColors = {
  bronze: 'bg-amber-600',
  silver: 'bg-gray-400',
  gold: 'bg-yellow-400',
  platinum: 'bg-blue-300',
  diamond: 'bg-purple-400',
};

export type UserRank = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

interface RankBadgeProps {
  rank: UserRank;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ 
  rank, 
  size = 'md', 
  animate = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  };

  const icons = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
    diamond: '👑',
  };

  const badge = (
    <div 
      className={`
        flex items-center justify-center rounded-full 
        ${rankColors[rank]} text-white font-bold ${sizeClasses[size]} ${className}
      `}
    >
      {icons[rank]}
    </div>
  );

  return animate ? (
    <PulseAnimation>{badge}</PulseAnimation>
  ) : badge;
};

// Progress bar for achievements
interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  color = 'blue',
  showLabel = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && label && (
        <div className="flex justify-between mb-1 text-sm">
          <span>{label}</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Achievement badge that animates when earned
interface AchievementProps {
  icon: string;
  title: string;
  description?: string;
  earned?: boolean;
  date?: string;
  className?: string;
}

export const Achievement: React.FC<AchievementProps> = ({
  icon,
  title,
  description,
  earned = false,
  date,
  className = '',
}) => {
  return (
    <div 
      className={`
        flex items-center p-3 rounded-lg border 
        ${earned ? 'bg-white border-green-500' : 'bg-gray-100 border-gray-300 opacity-60'}
        ${className}
      `}
    >
      {earned ? (
        <FloatingElement className="mr-4 text-3xl">{icon}</FloatingElement>
      ) : (
        <div className="mr-4 text-3xl opacity-50">{icon}</div>
      )}
      <div className="flex-1">
        <h4 className="font-bold">{title}</h4>
        {description && <p className="text-sm text-gray-600">{description}</p>}
        {earned && date && <p className="text-xs text-green-600 mt-1">Earned on {date}</p>}
      </div>
      {earned && (
        <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
          Earned
        </div>
      )}
    </div>
  );
};

// Points display with animation when points change
interface PointsDisplayProps {
  points: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
  label = 'Points',
  size = 'md',
  animate = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="text-gray-600 text-sm mb-1">{label}</div>
      <motion.div
        className={`font-bold ${sizeClasses[size]} text-purple-600`}
        animate={animate ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {points.toLocaleString()}
      </motion.div>
    </div>
  );
};
