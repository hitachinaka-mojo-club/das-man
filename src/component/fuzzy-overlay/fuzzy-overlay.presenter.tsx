'use client';

import { getBackgroundImage } from '@/component/image';
import { css } from '@/style/css';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import NoiseImage from './noise.png';

export const FuzzyOverlay = (): ReactNode => (
  <motion.div
    initial={{ transform: 'translateX(-10%) translateY(-10%)' }}
    animate={{
      transform: 'translateX(10%) translateY(10%)',
    }}
    transition={{
      repeat: Number.POSITIVE_INFINITY,
      duration: 0.2,
      ease: 'linear',
      repeatType: 'mirror',
    }}
    style={{
      backgroundImage: getBackgroundImage({ src: NoiseImage, alt: '', quality: 1 }),
    }}
    className={css({
      pointerEvents: 'none',
      position: 'absolute',
      inset: '-96',
      opacity: '[15%]',
    })}
  />
);
