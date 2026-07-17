'use client'

import { cn } from "@/lib/utils";
import BookCoverSvg from "./BookCoverSvg";
import { Image as IKImage } from '@imagekit/next';
import config from "@/lib/config";

type BookCoverVariant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: 'book-cover_extra_small',
  small: 'book-cover_small',
  medium: 'book-cover_medium',
  regular: 'book-cover_regular',
  wide: 'book-cover_wide',
}

interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor?: string;
  coverImage?: string;
}

const BookCover = ({ 
  variant = 'regular', 
  className, 
  coverColor = '#012B48', 
  coverImage = 'https://placehold.co/400x600.png' 
}: Props) => {
  const normalizedCoverImage = coverImage?.trim() || 'https://placehold.co/400x600.png';
  const isFullUrl = /^https?:\/\//i.test(normalizedCoverImage);
  
  // Construct full ImageKit URL if it's a path
  const imageSrc = isFullUrl 
    ? normalizedCoverImage 
    : `${config.env.imagekit.urlEndpoint}${normalizedCoverImage}`;

  return (
    <div className={cn('relative transition-all duration-300', variantStyles[variant], className)}>
      <BookCoverSvg coverColor={coverColor}/>

      <div className="absolute z-10" style={{ left: '12%', width: '87.5%', height: '88%'}}>
        <img
          src={imageSrc}
          alt="Book cover"
          className="h-full w-full rounded-sm object-fill"
          loading="lazy"
        />
      </div>
    </div>
  )
}

export default BookCover