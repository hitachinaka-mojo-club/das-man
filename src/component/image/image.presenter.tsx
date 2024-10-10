'use client';

import NextImage, { getImageProps, type ImageLoader, type StaticImageData } from 'next/image';
import type { ComponentPropsWithoutRef } from 'react';

type ImageProps = ComponentPropsWithoutRef<typeof NextImage>;

export const Image = NextImage;

export const getBackgroundImage = ({ ...props }: ImageProps) => {
  const imageSet = getImageProps(props)
    .props.srcSet?.split(', ')
    .map(src => src.split(' '))
    .map(([url, dpi]) => `url("${url}") ${dpi}`)
    .join(', ');

  return `image-set(${imageSet})`;
};

export type { ImageLoader, StaticImageData };
