'use client';

import { type ComponentPropsWithoutRef, type ReactNode, Suspense, lazy, memo, useEffect, useState } from 'react';
import { match } from 'ts-pattern';
import astonishedFaceAnimationData from './animation-data/astonished-face.json';
import confoundedFaceAnimationData from './animation-data/confounded-face.json';
import cryingFaceAnimationData from './animation-data/crying-face.json';
import faceSavouringDeliciousFoodAnimationData from './animation-data/face-savouring-delicious-food.json';
import faceScreamingInFearAnimationData from './animation-data/face-screaming-in-fear.json';
import faceThrowingAKissAnimationData from './animation-data/face-throwing-a-kiss.json';
import faceWithFingerCoveringClosedLipsAnimationData from './animation-data/face-with-finger-covering-closed-lips.json';
import faceWithMonocleAnimationData from './animation-data/face-with-monocle.json';
import faceWithPartyHornAndPartyHatAnimationData from './animation-data/face-with-party-horn-and-party-hat.json';
import faceWithPleadingEyesAnimationData from './animation-data/face-with-pleading-eyes.json';
import faceWithTearsOfJoyAnimationData from './animation-data/face-with-tears-of-joy.json';
import grinningFaceAnimationData from './animation-data/grinning-face.json';
import hugingFaceAnimationData from './animation-data/hugging-face.json';
import loudlyCryingFaceAnimationData from './animation-data/loudly-crying-face.json';
import lyingFaceAnimationData from './animation-data/lying-face.json';
import sleepingFaceAnimationData from './animation-data/sleeping-face.json';
import smilingFaceWithSmilingEyesAndHandCoveringMouthAnimationData from './animation-data/smiling-face-with-smiling-eyes-and-hand-covering-mouth.json';
import smilingFaceWithSunglassesAnimationData from './animation-data/smiling-face-with-sunglasses.json';
import winkingFaceAnimationData from './animation-data/winking-face.json';
import yawningFaceAnimationData from './animation-data/yawning-face.json';
import zipperMouthFaceAnimationData from './animation-data/zipper-mouth-face.json';

type AnimatedEmojiProps = ComponentPropsWithoutRef<'div'> & {
  emoji:
    | 'astonished-face'
    | 'confounded-face'
    | 'crying-face'
    | 'face-savouring-delicious-food'
    | 'face-screaming-in-fear'
    | 'face-throwing-a-kiss'
    | 'face-with-finger-covering-closed-lips'
    | 'face-with-monocle'
    | 'face-with-party-horn-and-party-hat'
    | 'face-with-pleading-eyes'
    | 'face-with-tears-of-joy'
    | 'grinning-face'
    | 'hugging-face'
    | 'loudly-crying-face'
    | 'lying-face'
    | 'sleeping-face'
    | 'smiling-face-with-smiling-eyes-and-hand-covering-mouth'
    | 'smiling-face-with-sunglasses'
    | 'winking-face'
    | 'yawning-face'
    | 'zipper-mouth-face';
};

const AnimatedEmojiPresenter = ({ ...props }: AnimatedEmojiProps): ReactNode => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const Lottie = lazy(async () => await import('lottie-react'));

  useEffect(() => {
    typeof window !== 'undefined' && setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Suspense fallback={null}>
      <Lottie
        animationData={match(props.emoji)
          .with('astonished-face', () => astonishedFaceAnimationData)
          .with('confounded-face', () => confoundedFaceAnimationData)
          .with('crying-face', () => cryingFaceAnimationData)
          .with('face-savouring-delicious-food', () => faceSavouringDeliciousFoodAnimationData)
          .with('face-screaming-in-fear', () => faceScreamingInFearAnimationData)
          .with('face-throwing-a-kiss', () => faceThrowingAKissAnimationData)
          .with('face-with-finger-covering-closed-lips', () => faceWithFingerCoveringClosedLipsAnimationData)
          .with('face-with-monocle', () => faceWithMonocleAnimationData)
          .with('face-with-party-horn-and-party-hat', () => faceWithPartyHornAndPartyHatAnimationData)
          .with('face-with-pleading-eyes', () => faceWithPleadingEyesAnimationData)
          .with('face-with-tears-of-joy', () => faceWithTearsOfJoyAnimationData)
          .with('grinning-face', () => grinningFaceAnimationData)
          .with('hugging-face', () => hugingFaceAnimationData)
          .with('loudly-crying-face', () => loudlyCryingFaceAnimationData)
          .with('lying-face', () => lyingFaceAnimationData)
          .with('sleeping-face', () => sleepingFaceAnimationData)
          .with(
            'smiling-face-with-smiling-eyes-and-hand-covering-mouth',
            () => smilingFaceWithSmilingEyesAndHandCoveringMouthAnimationData,
          )
          .with('smiling-face-with-sunglasses', () => smilingFaceWithSunglassesAnimationData)
          .with('winking-face', () => winkingFaceAnimationData)
          .with('yawning-face', () => yawningFaceAnimationData)
          .with('zipper-mouth-face', () => zipperMouthFaceAnimationData)
          .otherwise(() => {
            console.error(`Invalid emoji value: ${props.emoji}`);
            return grinningFaceAnimationData;
          })}
        {...props}
      />
    </Suspense>
  );
};

export const AnimatedEmoji = memo(AnimatedEmojiPresenter);
