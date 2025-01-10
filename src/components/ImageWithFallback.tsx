// // src/components/ImageWithFallback.tsx

// import Image from 'next/image';
// import { useState } from 'react';

// interface ImageWithFallbackProps {
//   src: string;
//   alt: string;
//   fallbackSrc?: string;
//   fill?: boolean;
//   className?: string;
//   width?: number;
//   height?: number;
// }

// export default function ImageWithFallback({
//   src,
//   alt,
//   fallbackSrc = '/images/placeholder.jpg',
//   ...props
// }: ImageWithFallbackProps) {
//   const [error, setError] = useState(false);

//   return (
//     <Image
//       {...props}
//       src={error ? fallbackSrc : src}
//       alt={alt}
//       onError={() => setError(true)}
//     />
//   );
// }