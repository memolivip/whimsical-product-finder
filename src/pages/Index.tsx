
import React from 'react';
import ProductFinder from '@/components/ProductFinder/ProductFinder';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="chip bg-blue-100 text-blue-800 mb-3">WooCommerce</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Ürün Bulma Sihirbazı</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            İhtiyacınıza uygun ürünleri bulmak için birkaç soruyu yanıtlayın.
            Size en uygun ürünleri anında gösterelim.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ProductFinder />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
