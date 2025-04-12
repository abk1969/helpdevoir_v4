import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';

interface SwipeableListProps {
  items: any[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  renderItem: (item: any) => React.ReactNode;
}

export default function SwipeableList({ 
  items, 
  onDelete, 
  onEdit, 
  renderItem 
}: SwipeableListProps) {
  const handleDragEnd = (
    info: PanInfo, 
    id: string
  ) => {
    if (info.offset.x < -100 && onDelete) {
      onDelete(id);
    } else if (info.offset.x > 100 && onEdit) {
      onEdit(id);
    }
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <motion.div
          key={item.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => handleDragEnd(info, item.id)}
          className="relative bg-white rounded-lg shadow-sm touch-button"
        >
          <div className="absolute inset-y-0 left-0 bg-red-500 rounded-l-lg flex items-center px-4">
            <Trash2 className="h-6 w-6 text-white" />
          </div>
          <div className="absolute inset-y-0 right-0 bg-blue-500 rounded-r-lg flex items-center px-4">
            <Edit className="h-6 w-6 text-white" />
          </div>
          {renderItem(item)}
        </motion.div>
      ))}
    </div>
  );
}