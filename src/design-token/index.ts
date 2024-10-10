import type { DeepReadonly } from 'ts-essentials';
import breakpointTokens from './breakpoint.json';
import colorTokens from './color.json';

export const breakpoints = breakpointTokens;

export const colors = colorTokens;

type Fonts = Record<
  string,
  {
    weight: `${number}`[];
    subsets: string[];
    variable: `--${string}`;
  }
>;

export const fonts = {
  'fira-code': {
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-fira-code',
  },
  'noto-sans-jp': {
    weight: ['400', '700', '800', '900'],
    subsets: ['latin'],
    variable: '--font-noto-sans-jp',
  },
} as const satisfies DeepReadonly<Fonts>;
