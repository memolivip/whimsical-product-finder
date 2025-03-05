
import { Product, Question } from '@/lib/data';

interface WooCommerceProduct {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  description: string;
  short_description: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  meta_data: Array<{
    key: string;
    value: string;
  }>;
}

// WooCommerce API anahtar ve gizli anahtarınızı burada tanımlayın
// Bu bilgileri WordPress admin panelinden WooCommerce > Ayarlar > Gelişmiş > REST API kısmından alabilirsiniz
const WOOCOMMERCE_URL = 'https://your-woocommerce-site.com/wp-json/wc/v3';
const CONSUMER_KEY = 'your_consumer_key';
const CONSUMER_SECRET = 'your_consumer_secret';

export const fetchWooCommerceProducts = async (): Promise<Product[]> => {
  try {
    // WooCommerce API'sine gerçek bir istek yap
    const response = await fetch(`${WOOCOMMERCE_URL}/products?per_page=100`, {
      headers: {
        'Authorization': 'Basic ' + btoa(CONSUMER_KEY + ':' + CONSUMER_SECRET)
      }
    });
    
    if (!response.ok) {
      throw new Error('WooCommerce API isteği başarısız: ' + response.status);
    }
    
    const wcProducts: WooCommerceProduct[] = await response.json();
    
    // WooCommerce ürünlerini uygulamamızın formatına dönüştür
    return wcProducts.map(wcProduct => mapWooCommerceProduct(wcProduct));
  } catch (error) {
    console.error('WooCommerce ürünlerini çekerken hata oluştu:', error);
    return [];
  }
};

export const mapWooCommerceProduct = (wcProduct: WooCommerceProduct): Product => {
  return {
    id: wcProduct.id.toString(),
    name: wcProduct.name,
    price: parseFloat(wcProduct.price || wcProduct.regular_price || '0'),
    description: wcProduct.short_description || wcProduct.description,
    imageUrl: wcProduct.images[0]?.src || 'https://via.placeholder.com/500',
    tags: [
      ...wcProduct.categories.map(cat => cat.slug),
      ...wcProduct.tags.map(tag => tag.slug)
    ],
    attributes: wcProduct.attributes.reduce((acc, attr) => {
      acc[attr.name] = attr.options.join(', ');
      return acc;
    }, {} as Record<string, string>)
  };
};

export const fetchWizardQuestions = async (): Promise<Question[]> => {
  try {
    // Gerçek uygulamada, soruları backend/admin ayarlarından çekebilirsiniz
    // Şimdilik veri dosyasından mevcut soruları döndürüyoruz
    const { questions } = await import('@/lib/data');
    return questions;
  } catch (error) {
    console.error('Sihirbaz sorularını çekerken hata oluştu:', error);
    return [];
  }
};

export const filterWooCommerceProducts = (
  products: Product[],
  selections: Record<string, string>
): Product[] => {
  return products.filter(product => {
    for (const [questionId, optionId] of Object.entries(selections)) {
      if (optionId === "any") continue;
      
      if (!product.tags.includes(optionId)) {
        return false;
      }
    }
    return true;
  });
};
