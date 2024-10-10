import { colors } from '@/design-token';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity:
export const getColorDefinition = (colorVariable: `--colors-${string}-${number}`): string | null => {
  const colorPath = colorVariable.split('--colors-')[1];
  if (!colorPath) {
    return null;
  }

  const colorTags = colorPath.split(new RegExp(/[-)]/g));
  const colorName = colorTags[0] as keyof typeof colors;
  const isPure = colorTags[0] === 'pure';
  const isLight = colorTags[1] === 'light';
  const isDark = colorTags[1] === 'dark';
  const isSemantic = !(isLight || isDark);
  const isAlpha = colorTags[2] === 'a';
  const isP3 = colorTags[2] === 'p3';
  const isP3Alpha = isP3 && colorTags[3] === 'a';
  const colorShade = (isP3Alpha ? colorTags[4] : isAlpha || isP3 ? colorTags[3] : colorTags[2]) as Exclude<
    keyof (typeof colors)[keyof typeof colors][keyof (typeof colors)[keyof typeof colors]],
    'a' | 'p3'
  >;

  if (isPure || isSemantic) {
    return null;
  }

  let color: string;
  if (isP3Alpha) {
    color = colors[colorName][isLight ? 'light' : 'dark'].p3.a[colorShade];
  } else if (isAlpha || isP3) {
    color = colors[colorName][isLight ? 'light' : 'dark'][isAlpha ? 'a' : 'p3'][colorShade];
  } else {
    color = colors[colorName][isLight ? 'light' : 'dark'][colorShade];
  }

  return color;
};
