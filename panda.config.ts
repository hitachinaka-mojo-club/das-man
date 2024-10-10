import { defineConfig, definePreset } from '@pandacss/dev';
import { preset as pandaPreset } from '@pandacss/preset-panda';
import { breakpoints, colors, fonts } from './src/design-token';
import { getColorDefinition } from './src/util/pandacss/get-color-definition';
import { mapColorsSemanticTokens } from './src/util/pandacss/map-colors-semantic-tokens';

const preset = definePreset({
  ...pandaPreset,
  conditions: {
    p3: '@media (color-gamut: p3)',
    srgb: '@media (color-gamut: srgb)',
    rec2020: '@media (color-gamut: rec2020)',
    dark: "[data-theme='dark'] &",
  },
  theme: {
    ...pandaPreset.theme,
    breakpoints,
    tokens: {
      ...Object.fromEntries(Object.entries(pandaPreset.theme.tokens).filter(([key]) => key !== 'colors')),
      fonts: {
        sans: {
          value: [
            `var(${fonts['noto-sans-jp'].variable})`,
            'ui-sans-serif',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            '"Noto Sans"',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"',
          ],
        },
        mono: {
          value: [
            `var(${fonts['fira-code'].variable})`,
            'ui-monospace',
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            '"Liberation Mono"',
            '"Courier New"',
            'monospace',
          ],
        },
      },
    },
    semanticTokens: {
      colors: {
        ...mapColorsSemanticTokens(colors),
        pure: {
          light: {
            DEFAULT: {
              value: '#ffffff',
            },
            a: {
              0: {
                value: '#ffffffff',
              },
              1: {
                value: '#ffffffe6',
              },
              2: {
                value: '#ffffffcc',
              },
              3: {
                value: '#ffffffb3',
              },
              4: {
                value: '#ffffff99',
              },
              5: {
                value: '#ffffff80',
              },
              6: {
                value: '#ffffff66',
              },
              7: {
                value: '#ffffff4d',
              },
              8: {
                value: '#ffffff33',
              },
              9: {
                value: '#ffffff1a',
              },
              10: {
                value: '#ffffff00',
              },
            },
          },
          dark: {
            DEFAULT: {
              value: '#000000',
            },
            a: {
              0: {
                value: '#000000ff',
              },
              1: {
                value: '#000000e6',
              },
              2: {
                value: '#000000cc',
              },
              3: {
                value: '#000000b3',
              },
              4: {
                value: '#00000099',
              },
              5: {
                value: '#00000080',
              },
              6: {
                value: '#00000066',
              },
              7: {
                value: '#0000004d',
              },
              8: {
                value: '#00000033',
              },
              9: {
                value: '#0000001a',
              },
              10: {
                value: '#00000000',
              },
            },
          },
          a: {
            0: {
              value: {
                base: '{colors.pure.light.a.0}',
                _dark: '{colors.pure.dark.a.0}',
              },
            },
            1: {
              value: {
                base: '{colors.pure.light.a.1}',
                _dark: '{colors.pure.dark.a.1}',
              },
            },
            2: {
              value: {
                base: '{colors.pure.light.a.2}',
                _dark: '{colors.pure.dark.a.2}',
              },
            },
            3: {
              value: {
                base: '{colors.pure.light.a.3}',
                _dark: '{colors.pure.dark.a.3}',
              },
            },
            4: {
              value: {
                base: '{colors.pure.light.a.4}',
                _dark: '{colors.pure.dark.a.4}',
              },
            },
            5: {
              value: {
                base: '{colors.pure.light.a.5}',
                _dark: '{colors.pure.dark.a.5}',
              },
            },
            6: {
              value: {
                base: '{colors.pure.light.a.6}',
                _dark: '{colors.pure.dark.a.6}',
              },
            },
            7: {
              value: {
                base: '{colors.pure.light.a.7}',
                _dark: '{colors.pure.dark.a.7}',
              },
            },
            8: {
              value: {
                base: '{colors.pure.light.a.8}',
                _dark: '{colors.pure.dark.a.8}',
              },
            },
            9: {
              value: {
                base: '{colors.pure.light.a.9}',
                _dark: '{colors.pure.dark.a.9}',
              },
            },
            10: {
              value: {
                base: '{colors.pure.light.a.10}',
                _dark: '{colors.pure.dark.a.10}',
              },
            },
          },
        },
      },
    },
  },
  utilities: {
    extend: {
      // NOTE: This utility accepts only tokens such as amber.light.1 and amber.dark.p.a.1,
      // but not semantic tokens such as amber.1 or pure colors such as pure.light.
      bgPattern: {
        values: 'colors',
        transform: value => {
          const color = getColorDefinition(value);
          if (!color) {
            return undefined;
          }

          return {
            // backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            //   <svg width="80" height="80" viewBox="0 0 1600 1600" fill="${color}" xmlns="http://www.w3.org/2000/svg">
            //     <path d="M248.669 157.76C250.444 155.984 250.444 153.106 248.669 151.331C246.894 149.556 244.015 149.556 242.24 151.331L200 193.572L157.76 151.331C155.984 149.556 153.106 149.556 151.331 151.331C149.556 153.106 149.556 155.984 151.331 157.76L193.572 200L151.331 242.24C149.556 244.015 149.556 246.894 151.331 248.669C153.106 250.444 155.984 250.444 157.76 248.669L200 206.428L242.24 248.669C244.015 250.444 246.894 250.444 248.669 248.669C250.444 246.894 250.444 244.015 248.669 242.24L206.428 200L248.669 157.76Z" />
            //     <path d="M1048.67 957.76C1050.44 955.984 1050.44 953.106 1048.67 951.331C1046.89 949.556 1044.02 949.556 1042.24 951.331L1000 993.572L957.76 951.331C955.984 949.556 953.106 949.556 951.331 951.331C949.556 953.106 949.556 955.984 951.331 957.76L993.572 1000L951.331 1042.24C949.556 1044.02 949.556 1046.89 951.331 1048.67C953.106 1050.44 955.984 1050.44 957.76 1048.67L1000 1006.43L1042.24 1048.67C1044.02 1050.44 1046.89 1050.44 1048.67 1048.67C1050.44 1046.89 1050.44 1044.02 1048.67 1042.24L1006.43 1000L1048.67 957.76Z" />
            //   </svg>
            // `)}")`,
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${color}" stroke-dasharray="5 3" transform="scale(1, -1)"><path d="M0 .5H31.5V32"/></svg>
            `)}")`,
          };
        },
      },
    },
  },
});

const config = defineConfig({
  presets: [preset],
  preflight: true,
  minify: true,
  importMap: '@/style',
  outdir: './src/style',
  include: ['./src/**/*.{ts,tsx}'],
  watch: true,
  // forceConsistentTypeExtension: true,
  strictTokens: true,
  jsxFramework: 'react',
});

export default config;
