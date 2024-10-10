import { ThemeProvider } from '@/component/theme-provider';
import { colors } from '@/design-token';
import { firaCode, getFontVariables, notoSansJp } from '@/font/family';
import { css } from '@/style/css';
import '@/style/global.css';
import { getBaseUrl } from '@/util/get-base-url';
import type { Metadata, NextPage, Viewport } from 'next';
import type { ReactNode } from 'react';

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: NextPage<RootLayoutProps> = async ({ children }) => (
  <html lang='en' className={getFontVariables([firaCode, notoSansJp])} suppressHydrationWarning>
    <head />
    <body
      className={css({
        pos: 'relative',
        bg: 'teal.1',
        fontFamily: 'sans',
      })}
    >
      <div
        aria-hidden
        className={css({
          pos: 'absolute',
          zIndex: '[-20]',
          w: 'full',
          h: 'full',
          bgPattern: 'teal.light.a.7',
          maskImage: 'linear-gradient(to bottom, black, transparent 80%)',
          opacity: '0.32',
          _dark: {
            bgPattern: 'teal.dark.a.7',
          },
        })}
      />
      <ThemeProvider attribute='data-theme' enableSystem defaultTheme='dark'>
        {children}
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;

export const generateMetadata = (): Metadata => {
  const title = 'das-man | An Interface for Naive Existence';
  const description = 'das man is an interface for naive existence.';

  return {
    description,
    metadataBase: getBaseUrl({ app: 'website' }),
    openGraph: {
      title,
      description,
      locale: 'ja_JP',
      url: getBaseUrl({ app: 'website' }),
    },
    title: {
      default: title,
      template: '%s | das-man',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
};

export const generateViewport = async (): Promise<Viewport> => ({
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: colors.teal.light['7'] },
    { media: '(prefers-color-scheme: dark)', color: colors.teal.dark['7'] },
  ],
});
