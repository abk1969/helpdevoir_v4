import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  const rotation = useTransform(y, [0, 100], [0, 360]);
  const controls = useAnimation();

  useEffect(() => {
    if (isRefreshing) {
      controls.start({
        rotate: 360,
        transition: { duration: 1, repeat: Infinity, ease: "linear" }
      });
    } else {
      controls.stop();
    }
  }, [isRefreshing, controls]);

  const handlePull = async (_, info: any) => {
    const pullDistance = info.offset.y;
    if (pullDistance > 100 && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.3}
      onDragEnd={handlePull}
      style={{ y }}
    >
      <div className="relative">
        <motion.div
          style={{ rotate: rotation }}
          animate={controls}
          className="absolute left-1/2 -top-8 transform -translate-x-1/2"
        >
          <RefreshCw className="h-6 w-6 text-indigo-600" />
        </motion.div>
        {children}
      </div>
    </motion.div>
  );
}