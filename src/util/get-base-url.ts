import { match } from 'ts-pattern';

type GetBaseUrlConfig = {
  app: 'website';
};

const getWebsiteBaseUrl = () => {
  const baseUrl = (() => {
    if (process.env['NODE_ENV'] === 'production') {
      return new URL('https://das-man.vercel.app');
    }
    if (process.env['VERCEL_URL']) {
      return new URL(`https://${process.env['VERCEL_URL']}`);
    }
    if (process.env['NEXT_PUBLIC_VERCEL_URL']) {
      return new URL(`https://${process.env['NEXT_PUBLIC_VERCEL_URL']}`);
    }

    return new URL(`http://localhost:${process.env['PORT'] || 3000}`);
  })();

  return baseUrl;
};

/**
 * Get the base URL of the app.
 * @param app The app from which to get the base URL.
 * @returns The base URL of the app with trailing slash removed.
 * @example
 * ```ts
 * const baseUrl = getBaseUrl({ app: 'api' });
 * // => https://api.das-man.app
 * ```
 */
export const getBaseUrl = ({ app }: GetBaseUrlConfig) => {
  const baseUrl = match(app)
    .with('website', () => getWebsiteBaseUrl())
    .exhaustive();

  baseUrl.pathname = baseUrl.pathname.replace(/\/$/, '');

  return baseUrl;
};
