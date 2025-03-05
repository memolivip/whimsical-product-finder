
import React from 'react';
import { Product } from '@/lib/data';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const delay = index * 0.1;
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="product-card h-full flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex flex-wrap gap-1 mt-auto mb-3">
          {Object.entries(product.attributes).slice(0, 2).map(([key, value]) => (
            <span key={key} className="chip">
              {key}: {value}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          <button className="btn-icon bg-primary text-white hover:bg-primary/90">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
