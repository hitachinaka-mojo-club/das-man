type ColorShade = `${number}`;

type ColorToken = `#${string}` | `color(display-p3 ${number} ${number} ${number}${'' | ` / ${number}`})`;

type ColorTokenSet = {
  light: Record<ColorShade, string> &
    Record<'a', Record<ColorShade, string>> &
    Record<'p3', Record<ColorShade, string> & Record<'a', Record<ColorShade, string>>>;
  dark: Record<ColorShade, string> &
    Record<'a', Record<ColorShade, string>> &
    Record<'p3', Record<ColorShade, string> & Record<'a', Record<ColorShade, string>>>;
};

type ColorsTokens = Record<string, ColorTokenSet>;

type ColorSemanticToken = `{colors.${string}}`;

type ColorsSemanticTokens = {
  [key: string]: {
    [key: ColorShade]: {
      value: {
        base: ColorSemanticToken;
        _dark: ColorSemanticToken;
      };
    };
    light: {
      [key: ColorShade]: {
        value: {
          base: ColorToken;
          _p3: ColorSemanticToken;
        };
      };
      a: {
        [key: ColorShade]: {
          value: {
            base: ColorToken;
            _p3: ColorSemanticToken;
          };
        };
      };
      p3: {
        [key: ColorShade]: {
          value: ColorToken;
        };
        a: {
          [key: ColorShade]: {
            value: ColorToken;
          };
        };
      };
    };
    dark: {
      [key: ColorShade]: {
        value: {
          base: ColorToken;
          _p3: ColorSemanticToken;
        };
      };
      a: {
        [key: ColorShade]: {
          value: {
            base: ColorToken;
            _p3: ColorSemanticToken;
          };
        };
      };
      p3: {
        [key: ColorShade]: {
          value: ColorToken;
        };
        a: {
          [key: ColorShade]: {
            value: ColorToken;
          };
        };
      };
    };
    a: {
      [key: ColorShade]: {
        value: {
          base: ColorSemanticToken;
          _dark: ColorSemanticToken;
        };
      };
    };
    p3: {
      [key: ColorShade]: {
        value: {
          base: ColorSemanticToken;
          _dark: ColorSemanticToken;
        };
      };
      a: {
        [key: ColorShade]: {
          value: {
            base: ColorSemanticToken;
            _dark: ColorSemanticToken;
          };
        };
      };
    };
  };
};

export const mapColorsSemanticTokens = (colorTokens: ColorsTokens): ColorsSemanticTokens =>
  Object.fromEntries(
    Object.entries(colorTokens).map(([colorName, colorToken]) => {
      const colorSemanticTokes: ColorsSemanticTokens[string] = {
        ...Object.fromEntries(
          Object.entries(colorToken.light)
            .map(([shade]) => [
              shade,
              {
                value: {
                  base: `{colors.${colorName}.light.${shade}}` as ColorSemanticToken,
                  _dark: `{colors.${colorName}.dark.${shade}}` as ColorSemanticToken,
                },
              },
            ])
            .filter(([shade]) => shade !== 'p3'),
        ),
        light: {
          ...Object.fromEntries(
            Object.entries(colorToken.light)
              .map(([shade, token]) => [
                shade,
                {
                  value: {
                    base: token,
                    _p3: `{colors.${colorName}.light.p3.${shade}}`,
                  },
                },
              ])
              .filter(([shade]) => shade !== 'a' && shade !== 'p3'),
          ),
          a: Object.fromEntries(
            Object.entries(colorToken.light.a).map(([shade, token]) => [
              shade,
              {
                value: {
                  base: token,
                  _p3: `{colors.${colorName}.light.p3.a.${shade}}`,
                },
              },
            ]),
          ),
          p3: {
            ...Object.fromEntries(
              Object.entries(colorToken.light.p3)
                .map(([shade, color]) => [
                  shade,
                  {
                    value: color,
                  },
                ])
                .filter(([shade]) => shade !== 'a'),
            ),
            a: Object.fromEntries(
              Object.entries(colorToken.light.p3.a).map(([shade, color]) => [
                shade,
                {
                  value: color,
                },
              ]),
            ),
          },
        },
        dark: {
          ...Object.fromEntries(
            Object.entries(colorToken.light)
              .map(([shade, token]) => [
                shade,
                {
                  value: {
                    base: token,
                    _p3: `{colors.${colorName}.dark.p3.${shade}}`,
                  },
                },
              ])
              .filter(([shade]) => shade !== 'a' && shade !== 'p3'),
          ),
          a: Object.fromEntries(
            Object.entries(colorToken.dark.a).map(([shade, token]) => [
              shade,
              {
                value: {
                  base: token,
                  _p3: `{colors.${colorName}.dark.p3.a.${shade}}`,
                },
              },
            ]),
          ),
          p3: {
            ...Object.fromEntries(
              Object.entries(colorToken.dark.p3)
                .map(([shade, color]) => [
                  shade,
                  {
                    value: color,
                  },
                ])
                .filter(([shade]) => shade !== 'a'),
            ),
            a: Object.fromEntries(
              Object.entries(colorToken.dark.p3.a).map(([shade, color]) => [
                shade,
                {
                  value: color,
                },
              ]),
            ),
          },
        },
        a: {
          ...Object.fromEntries(
            Object.entries(colorToken.light.a).map(([shade]) => [
              shade,
              {
                value: {
                  base: `{colors.${colorName}.light.a.${shade}}`,
                  _dark: `{colors.${colorName}.dark.a.${shade}}`,
                },
              },
            ]),
          ),
        },
        p3: {
          ...Object.fromEntries(
            Object.entries(colorToken.light.p3).map(([shade]) => [
              shade,
              {
                value: {
                  base: `{colors.${colorName}.light.p3.${shade}}`,
                  _dark: `{colors.${colorName}.dark.p3.${shade}}`,
                },
              },
            ]),
          ),
          a: {
            ...Object.fromEntries(
              Object.entries(colorToken.light.p3.a).map(([shade]) => [
                shade,
                {
                  value: {
                    base: `{colors.${colorName}.light.p3.a.${shade}}`,
                    _dark: `{colors.${colorName}.dark.p3.a.${shade}}`,
                  },
                },
              ]),
            ),
          },
        },
      };

      return [colorName, colorSemanticTokes];
    }),
  );
