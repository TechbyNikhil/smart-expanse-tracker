import React from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  MoreHorizontal,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { getCategoryByName } from '../data/categories';

const iconMap = {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  MoreHorizontal,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
};

export const CategoryIcon = ({ categoryName, size = 18, className = '' }) => {
  const cat = getCategoryByName(categoryName);
  const IconComponent = iconMap[cat.icon] || MoreHorizontal;

  return (
    <div
      className={`flex items-center justify-center rounded-xl transition-all duration-200 ${className}`}
      style={{
        backgroundColor: cat.bg,
        border: `1px solid ${cat.border}`,
        color: cat.color,
        width: typeof size === 'number' ? size + 16 : '36px',
        height: typeof size === 'number' ? size + 16 : '36px',
      }}
      title={cat.name}
    >
      <IconComponent size={size} strokeWidth={2.2} />
    </div>
  );
};

export default CategoryIcon;
