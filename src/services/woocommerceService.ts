
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

export const fetchWooCommerceProducts = async (): Promise<Product[]> => {
  try {
    // In a real implementation, this would be an actual API call to the WooCommerce REST API
    // For example:
    // const response = await fetch('/wp-json/wc/v3/products', {
    //   headers: {
    //     'Authorization': 'Basic ' + btoa(consumerKey + ':' + consumerSecret)
    //   }
    // });
    
    // For now, we'll simulate a delay and return empty products
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This is where you'd transform WooCommerce products to our app's format
    return [];
  } catch (error) {
    console.error('Error fetching WooCommerce products:', error);
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
    // In a real implementation, this would fetch questions from your backend/admin settings
    // For now, we'll return the current questions from the data file
    const { questions } = await import('@/lib/data');
    return questions;
  } catch (error) {
    console.error('Error fetching wizard questions:', error);
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
