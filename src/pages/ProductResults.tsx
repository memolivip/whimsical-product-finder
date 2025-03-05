import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Product } from '@/lib/data';
import ProductCard from '@/components/ProductFinder/ProductCard';
import { ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchWooCommerceProducts, filterWooCommerceProducts } from '@/services/woocommerceService';
import { toast } from 'sonner';

const ProductResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      
      try {
        const selections = location.state?.selections || {};
        
        // WooCommerce'dan ürünleri çek
        const allProducts = await fetchWooCommerceProducts();
        
        // Seçimlere göre ürünleri filtrele
        const filteredProducts = filterWooCommerceProducts(allProducts, selections);
        
        setProducts(filteredProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Ürünleri yüklerken hata oluştu:', error);
        toast.error('Ürünler yüklenirken bir hata oluştu');
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [location.state]);
  
  const handleBackToWizard = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBackToWizard}
            className="btn-icon bg-white shadow-sm hover:bg-gray-50 mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-3xl font-bold">Ürün Sonuçları</h1>
        </div>
        
        {isLoading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Ürünler yükleniyor...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[300px] flex flex-col items-center justify-center text-center glass-panel p-8"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Ürün Bulunamadı</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Seçtiğiniz kriterlere uygun ürün bulamadık. Lütfen farklı seçeneklerle tekrar deneyin.
            </p>
            <button 
              onClick={handleBackToWizard}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sihirbazı Yeniden Başlat
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductResults;
