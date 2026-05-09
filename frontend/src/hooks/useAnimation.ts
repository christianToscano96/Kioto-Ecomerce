import { useEffect, useRef } from 'react';
import { useToast } from '../components/ui/Toast';

// Animation variants for Framer Motion (if used) or CSS transitions
export const animations = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },

  // Product card hover
  productCard: {
    whileHover: { scale: 1.03, y: -5 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },

  // Add to cart animation
  addToCart: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 0.5, ease: 'easeOut' },
  },

  // Cart button pulse
  cartPulse: {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, -10, 10, -10, 0],
    },
    transition: { duration: 0.5 },
  },

  // Staggered list
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },

  // Modal
  modal: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },

  // Image gallery
  imageGallery: {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.4, ease: 'easeInOut' },
  },

  // Button loading
  loadingButton: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  },
};

// Hook for cart animation feedback
export function useCartAnimation() {
  const { addToast } = useToast();
  const prevCartCountRef = useRef(0);

  const animateAddToCart = (productName: string, cartCount: number) => {
    prevCartCountRef.current = cartCount;

    // Visual feedback
    document.body.classList.add('cart-added');
    setTimeout(() => document.body.classList.remove('cart-added'), 600);

    // Toast notification
    addToast({
      type: 'success',
      title: '¡Agregado al carrito!',
      message: `${productName} fue agregado correctamente`,
    });
  };

  return { animateAddToCart };
}

// Hook for navigation animations
export function useNavigationAnimation() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prefetchRoute = (path: string) => {
    // Prefetch logic can be added here
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
  };

  return { scrollToTop, prefetchRoute };
}

// CSS for cart-added animation (should be added to global styles)
export const cartAddedStyles = `
  @keyframes cartPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .cart-added {
    animation: cartPulse 0.6s ease-out;
  }
  
  @keyframes imageFade {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .image-fade-in {
    animation: imageFade 0.4s ease-out forwards;
  }
`;