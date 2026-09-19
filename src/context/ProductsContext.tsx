import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_PRODUCTS } from '../data/products.ts';
import { api } from '../services/api.ts';
import { Product, ProductCategory } from '../types.ts';

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  filteredProducts: Product[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  submitReview: (productId: string, review: { userName: string; city: string; rating: number; comment: string }) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([15000, 200000]);
  const [sortBy, setSortBy] = useState<string>('featured');

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProducts();
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.warn('Failed to refresh products from server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const addProduct = async (newProd: Partial<Product>): Promise<Product> => {
    try {
      const created = await api.addProduct(newProd);
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      // Fallback
      const fallback: Product = {
        id: `ZIK-${Date.now().toString().slice(-4)}`,
        name: newProd.name || 'New Watch',
        category: (newProd.category as ProductCategory) || 'Mens',
        categoryLabel: newProd.categoryLabel || "Men's Watches",
        price: newProd.price || 30000,
        discountPrice: newProd.discountPrice,
        description: newProd.description || '',
        shortDescription: newProd.shortDescription || '',
        images: newProd.images || ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'],
        colors: newProd.colors || [{ name: 'Black', hex: '#000000' }],
        quantity: newProd.quantity || 10,
        stockStatus: 'In Stock',
        rating: 5.0,
        reviewCount: 0,
        specifications: newProd.specifications || {
          caseDiameter: '41 mm',
          caseThickness: '11 mm',
          glass: 'Sapphire Crystal',
          movement: 'Precision Japanese Quartz',
          waterResistance: '50m (5 ATM)',
          strapMaterial: 'Solid Stainless Steel',
          caseMaterial: '316L Stainless Steel',
          warranty: '2 Years Zikala International Warranty',
        },
        features: newProd.features || ['Premium watch box included'],
        reviews: [],
      };
      setProducts((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    try {
      const updated = await api.updateProduct(id, updates);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
      return { ...getProductById(id)!, ...updates };
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      await api.deleteProduct(id);
    } catch (e) {
      console.warn(e);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const submitReview = async (
    productId: string,
    review: { userName: string; city: string; rating: number; comment: string }
  ) => {
    try {
      const updatedProduct = await api.addReview(productId, review);
      setProducts((prev) => prev.map((p) => (p.id === productId ? updatedProduct : p)));
    } catch {
      // Local fallback
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          const newRev = {
            id: `rev-${Date.now()}`,
            userName: review.userName,
            city: review.city || 'Pakistan',
            rating: review.rating,
            date: 'Today',
            comment: review.comment,
            verifiedPurchase: true,
          };
          const nextReviews = [newRev, ...p.reviews];
          const avg = Number((nextReviews.reduce((sum, r) => sum + r.rating, 0) / nextReviews.length).toFixed(1));
          return {
            ...p,
            reviews: nextReviews,
            reviewCount: nextReviews.length,
            rating: avg,
          };
        })
      );
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
        product.id.toLowerCase().includes(q);
      if (!match) return false;
    }

    const price = product.discountPrice || product.price;
    if (price < priceRange[0] || price > priceRange[1]) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
    if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    // 'featured'
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        filteredProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        submitReview,
        refreshProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
