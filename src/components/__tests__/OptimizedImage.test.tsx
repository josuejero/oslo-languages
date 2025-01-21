// src/components/__tests__/OptimizedImage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useInView } from 'react-intersection-observer';
import OptimizedImage from '../OptimizedImage';
import Image from 'next/image';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: jest.fn(() => null)
}));

// Mock react-intersection-observer
jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn()
}));

describe('OptimizedImage', () => {
  const mockProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 800,
    height: 600
  };

  let inViewCallback: (inView: boolean) => void;

  beforeEach(() => {
    // Reset mocks
    (Image as unknown as jest.Mock).mockClear();
    (useInView as jest.Mock).mockReset();

    // Default useInView implementation
    (useInView as jest.Mock).mockImplementation(() => ({
      ref: jest.fn(),
      inView: true
    }));
  });

  describe('Image Optimization', () => {
    it('should pass correct optimization props to next/image', () => {
      render(<OptimizedImage {...mockProps} />);

      expect(Image).toHaveBeenCalledWith(
        expect.objectContaining({
          quality: expect.any(Number),
          sizes: expect.any(String)
        }),
        expect.any(Object)
      );
    });

    it('should handle responsive sizing correctly', () => {
      render(
        <OptimizedImage
          {...mockProps}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      );

      expect(Image).toHaveBeenCalledWith(
        expect.objectContaining({
          sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        }),
        expect.any(Object)
      );
    });

    it('should respect aspect ratio constraints', () => {
      render(<OptimizedImage {...mockProps} aspectRatio={16/9} />);

      const container = screen.getByTestId('image-container');
      expect(container).toHaveStyle({
        paddingTop: '56.25%' // 9/16 * 100
      });
    });

    it('should handle different image formats', () => {
      render(
        <OptimizedImage
          {...mockProps}
          src="/test.webp"
        />
      );

      expect(Image).toHaveBeenCalledWith(
        expect.objectContaining({
          src: '/test.webp'
        }),
        expect.any(Object)
      );
    });
  });

  describe('Lazy Loading', () => {
    it('should not render image when out of view', () => {
      (useInView as jest.Mock).mockImplementation(() => ({
        ref: jest.fn(),
        inView: false
      }));

      render(<OptimizedImage {...mockProps} />);
      expect(Image).not.toHaveBeenCalled();
    });

    it('should render image when it comes into view', () => {
      (useInView as jest.Mock).mockImplementation(() => ({
        ref: jest.fn(),
        inView: false,
        onChange: (callback: (inView: boolean) => void) => {
          inViewCallback = callback;
        }
      }));

      render(<OptimizedImage {...mockProps} />);
      expect(Image).not.toHaveBeenCalled();

      // Simulate image coming into view
      if (inViewCallback) {
        inViewCallback(true);
        expect(Image).toHaveBeenCalled();
      }
    });

    it('should respect custom lazyBoundary', () => {
      render(<OptimizedImage {...mockProps} lazyBoundary="300px" />);

      expect(useInView).toHaveBeenCalledWith(
        expect.objectContaining({
          rootMargin: '300px'
        })
      );
    });

    it('should prioritize images above the fold', () => {
      render(<OptimizedImage {...mockProps} priority />);

      expect(Image).toHaveBeenCalledWith(
        expect.objectContaining({
          priority: true,
          loading: undefined
        }),
        expect.any(Object)
      );
    });
  });

  describe('Placeholder Handling', () => {
    it('should show loading skeleton initially', () => {
      render(<OptimizedImage {...mockProps} />);
      
      const skeleton = screen.getByTestId('image-skeleton');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should handle blur placeholder', () => {
      render(
        <OptimizedImage
          {...mockProps}
          lowQualityPlaceholder="/test-image-small.jpg"
        />
      );

      expect(Image).toHaveBeenCalledWith(
        expect.objectContaining({
          placeholder: 'blur',
          blurDataURL: '/test-image-small.jpg'
        }),
        expect.any(Object)
      );
    });

    it('should remove loading state after image loads', async () => {
      render(<OptimizedImage {...mockProps} />);
      
      const image = screen.getByTestId('optimized-image');
      fireEvent.load(image);

      await waitFor(() => {
        const skeleton = screen.queryByTestId('image-skeleton');
        expect(skeleton).not.toBeInTheDocument();
      });
    });

    it('should handle custom background colors', () => {
      render(<OptimizedImage {...mockProps} background="bg-blue-100" />);
      
      const container = screen.getByTestId('image-container');
      expect(container).toHaveClass('bg-blue-100');
    });
  });

  describe('Error States', () => {
    it('should show fallback image on error', async () => {
      render(
        <OptimizedImage
          {...mockProps}
          src="/non-existent.jpg"
          fallbackSrc="/fallback.jpg"
        />
      );

      const image = screen.getByTestId('optimized-image');
      fireEvent.error(image);

      await waitFor(() => {
        expect(Image).toHaveBeenLastCalledWith(
          expect.objectContaining({
            src: '/fallback.jpg'
          }),
          expect.any(Object)
        );
      });
    });

    it('should handle missing fallback image', async () => {
      render(<OptimizedImage {...mockProps} src="/non-existent.jpg" />);

      const image = screen.getByTestId('optimized-image');
      fireEvent.error(image);

      await waitFor(() => {
        expect(Image).toHaveBeenLastCalledWith(
          expect.objectContaining({
            src: '/images/placeholder.jpg' // Default fallback
          }),
          expect.any(Object)
        );
      });
    });

    it('should maintain aspect ratio with fallback image', async () => {
      render(
        <OptimizedImage
          {...mockProps}
          src="/non-existent.jpg"
          fallbackSrc="/fallback.jpg"
          aspectRatio={1}
        />
      );

      const image = screen.getByTestId('optimized-image');
      fireEvent.error(image);

      const container = screen.getByTestId('image-container');
      expect(container).toHaveStyle({ paddingTop: '100%' });
    });

    it('should handle subsequent source changes after error', async () => {
      const { rerender } = render(
        <OptimizedImage {...mockProps} src="/non-existent.jpg" />
      );

      const image = screen.getByTestId('optimized-image');
      fireEvent.error(image);

      rerender(<OptimizedImage {...mockProps} src="/new-image.jpg" />);

      await waitFor(() => {
        expect(Image).toHaveBeenLastCalledWith(
          expect.objectContaining({
            src: '/new-image.jpg'
          }),
          expect.any(Object)
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('should have appropriate alt text', () => {
      render(<OptimizedImage {...mockProps} />);

      expect(Image).toHaveBeenCalledWith(
        expect.objectContaining({
          alt: 'Test image'
        }),
        expect.any(Object)
      );
    });

    it('should mark decorative images appropriately', () => {
      render(<OptimizedImage {...mockProps} alt="" aria-hidden="true" role="presentation" />);

      expect(Image).toHaveBeenCalledWith(
        expect.objectContaining({
          alt: '',
          role: 'presentation',
          'aria-hidden': 'true'
        }),
        expect.any(Object)
      );
    });

    it('should handle loading state announcements', () => {
      render(<OptimizedImage {...mockProps} />);
      
      const loadingStatus = screen.getByTestId('loading-status');
      expect(loadingStatus).toHaveAttribute('aria-live', 'polite');
      expect(loadingStatus).toHaveTextContent(/loading/i);
    });

    it('should announce load errors to screen readers', async () => {
      render(<OptimizedImage {...mockProps} src="/non-existent.jpg" />);

      const image = screen.getByTestId('optimized-image');
      fireEvent.error(image);

      await waitFor(() => {
        const errorStatus = screen.getByTestId('error-status');
        expect(errorStatus).toHaveAttribute('aria-live', 'assertive');
        expect(errorStatus).toHaveTextContent(/failed to load/i);
      });
    });
  });
});