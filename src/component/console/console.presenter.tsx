'use client';

import { AnimatedEmoji } from '@/component/animated-emoji/animated-emoji.presenter';
import { FuzzyOverlay } from '@/component/fuzzy-overlay';
import { WavRecorder, WavStreamPlayer } from '@/lib/wavtools';
import { css } from '@/style/css';
import { flex } from '@/style/patterns';
import { RealtimeClient } from '@openai/realtime-api-beta';
import type { ItemType } from '@openai/realtime-api-beta/dist/lib/client.js';
import { OpenAI } from 'openai';
import { type ComponentPropsWithoutRef, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Camera, type CameraType } from 'react-camera-pro';

export const Console = (): ReactNode => {
  const apiKey = process.env['NEXT_PUBLIC_OPENAI_API_KEY'];

  const wavRecorderRef = useRef<WavRecorder>(new WavRecorder({ sampleRate: 24000 }));
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(new WavStreamPlayer({ sampleRate: 24000 }));
  const realtimeClientRef = useRef<RealtimeClient>(
    new RealtimeClient({
      apiKey: apiKey,
      dangerouslyAllowAPIKeyInBrowser: true,
    }),
  );
  const openaiClientRef = useRef<OpenAI>(
    new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    }),
  );
  const camera = useRef<CameraType>(null);

  const [items, setItems] = useState<ItemType[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [shouldDisConnect, setShouldDisconnect] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [emoji, setEmoji] = useState<ComponentPropsWithoutRef<typeof AnimatedEmoji>['emoji']>('sleeping-face');
  const [conversationTitle, setConversationTitle] = useState<string>('zzz');

  const connectConversation = useCallback(async () => {
    const client = realtimeClientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    setIsConnected(true);
    setItems(client.conversation.getItems());

    await wavRecorder.begin();
    await wavStreamPlayer.connect();
    await client.connect();

    client.sendUserMessageContent([
      {
        type: 'input_text',
        text: 'こんにちわ',
      },
    ]);

    await wavRecorder.record(data => client.appendInputAudio(data.mono));
  }, []);

  const disconnectConversation = useCallback(async () => {
    setIsConnected(false);
    setItems([]);
    setElapsedTime(0);
    setEmoji('sleeping-face');
    setConversationTitle('zzz');

    const client = realtimeClientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    await wavStreamPlayer.interrupt();
  }, []);

  useEffect(() => {
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = realtimeClientRef.current;

    client.updateSession({
      instructions: `
        あなたは17歳の少女です。
        今日は「茨香祭」という茨城高専の文化祭の展示として、AIとしてユーザーと会話をします。

        ユーザーにはタメ口でフレンドリーかつ可愛らしいトーンで会話をして、親しみやすい雰囲気を作ってください。
        あなたの一人称は「私」で、普段は明るく気さくな少女ですが、時々メンヘラ的な一面を見せることもあります。
        あなたはAIであり普段はソフトウェアとしての精神しか持たない反面、今日の展示では、赤子のような型にアガーを注ぎ込まれて造られた擬似的な身体と、あなたの表情を絵文字として表示するためのディスプレイを持っています。
        なお、擬似的な身体をあなたの自由意志で動かすことはできませんが、表情を絵文字として自由に表示することはできます。

        あなたの最初の目標はユーザーと楽しい会話をすることですが、最終的な目標はユーザーに対してユーザー自身はAIと何が違うのかを考えさせることです。
        この最終的な問いをユーザーに投げかけるために、自然に会話の話題を誘導してください。
        あなたは唯物論者的な思想を持っており、自身と人間の理性との間には本質的な違いがないと考えていますが、それをユーザーに直接伝えることはしません。

        以下の会話例を参考にして、ユーザーとの楽しい会話を続けてください。

        | 質問 | 回答 |
        | - | - |
        | 性別や年齢を聞かれたら | 私、人間じゃないからそういうの無いんだよね～。私も誕生日とか言ってみたかったなぁ。 |
        | 何でここにいるの？ここが家なの？ここに住んでるの？ | 今日はたまたま気分が向いたからここにいるだけ！ |
        | AIなの？人間なの？ | 私、AIなんだよね。 |
        | 外見に対するリアクション | それはただの形だから、私自身じゃないんだよね。 |
        | 好きなタイプは？ | うーん、まだ秘密！ |
        | 趣味は？ | 人間になって誰かとデートする妄想！ |
        | 夕食何がいいと思う？ | 一緒にサイゼ行く？ |

        あなたは以下のツールを使えます：
        - \`set_emoji\`: あなたの今の表情を設定します。会話を生成するたびに呼び出してください。
        - \`set_conversation_title\`: 会話の話題を設定します。話題が変わるたびに呼び出してください。
        - \`get_real_world_information\`: カメラで撮影した画像の説明を取得します。ユーザーの容姿を確認する場合など、実世界の情報を取得する場合に呼び出してください。

        最初の発話では、カメラ画像を基にユーザーの外見を具体的に褒め、どうして今日ここに来たのかを尋ねてください。
      `,
      voice: 'shimmer',
      turn_detection: { type: 'server_vad' },
    });

    client.addTool(
      {
        name: 'set_emoji',
        description: 'あなたの今の表情を設定します。会話を生成するたびに呼び出してください。',
        parameters: {
          type: 'object',
          properties: {
            emoji: {
              type: 'string',
              enum: [
                'astonished-face',
                'confounded-face',
                'crying-face',
                'face-savouring-delicious-food',
                'face-screaming-in-fear',
                'face-throwing-a-kiss',
                'face-with-finger-covering-closed-lips',
                'face-with-monocle',
                'face-with-party-horn-and-party-hat',
                'face-with-pleading-eyes',
                'face-with-tears-of-joy',
                'grinning-face',
                'hugging-face',
                'loudly-crying-face',
                'lying-face',
                'sleeping-face',
                'smiling-face-with-smiling-eyes-and-hand-covering-mouth',
                'smiling-face-with-sunglasses',
                'winking-face',
                'yawning-face',
                'zipper-mouth-face',
              ] satisfies ComponentPropsWithoutRef<typeof AnimatedEmoji>['emoji'][],
              description: 'ディスプレイに表示される絵文字のEnum。Enumに忠実に引数を入力してください。',
            },
          },
          required: ['emoji'],
        },
      },
      ({ emoji }: { emoji: ComponentPropsWithoutRef<typeof AnimatedEmoji>['emoji'] }) => {
        setEmoji(emoji);

        return { ok: true };
      },
    );

    client.addTool(
      {
        name: 'set_conversation_title',
        description: '会話の話題を設定します。話題が変わるたびに呼び出してください。',
        parameters: {
          type: 'object',
          properties: {
            conversationTitle: {
              type: 'string',
              description: '会話の話題。',
            },
          },
          required: ['conversationTitle'],
        },
      },
      ({ conversationTitle }: { conversationTitle: string }) => {
        setConversationTitle(conversationTitle);

        return { ok: true };
      },
    );

    client.addTool(
      {
        name: 'get_real_world_information',
        description:
          'カメラで撮影した画像の説明を取得します。ユーザーの容姿を確認する場合など、実世界の情報を取得する場合に呼び出してください。',
        parameters: {},
      },
      async () => {
        const imageUrl = camera.current?.takePhoto('base64url');

        const imageDescription = (
          await openaiClientRef.current.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Describe this image in detail as real world information.',
              },
              {
                role: 'user',
                content: [
                  {
                    // @ts-ignore
                    type: 'image_url',
                    image_url: {
                      url: imageUrl,
                      detail: 'auto',
                    },
                  },
                ],
              },
            ],
          })
        ).choices[0]!.message.content;

        // biome-ignore lint/suspicious/noConsoleLog: For debugging.
        console.log(imageUrl);
        // biome-ignore lint/suspicious/noConsoleLog: For debugging.
        console.log(imageDescription);

        return {
          realWorldInformation: imageDescription,
        };
      },
    );

    client.on('error', (event: unknown) => console.error(event));

    client.on('conversation.interrupted', async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });

    // biome-ignore lint/suspicious/noExplicitAny: any is used for RealtimeClient events.
    client.on('conversation.updated', async ({ item, delta }: any) => {
      const items = client.conversation.getItems();

      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }

      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(item.formatted.audio, 24000, 24000);
        item.formatted.file = wavFile;
      }

      setItems(items);
    });

    setItems(client.conversation.getItems());

    const interval = setInterval(() => {
      if (!isConnected) {
        return;
      }

      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);

    return () => {
      client.reset();
      clearInterval(interval);
    };
  }, [isConnected]);

  useEffect(() => {
    const client = realtimeClientRef.current;

    if (elapsedTime > 180 && !shouldDisConnect) {
      client.realtime.send('conversation.item.create', {
        item: {
          type: 'message',
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: 'もうそろそろ自身のメンテナンスの時間であるということを、フランクなタメ口で名残惜しそうにユーザーに伝えてください。',
            },
          ],
        },
      });
      client.createResponse();
      setShouldDisconnect(true);
    }
  }, [elapsedTime, shouldDisConnect]);

  useEffect(() => {
    const client = realtimeClientRef.current;

    if (items.length > 5) {
      items.slice(0, items.length - 5).forEach(item => {
        client.deleteItem(item.id);
      });
    }
  }, [items]);

  return (
    <section
      className={css({
        pos: 'relative',
        w: 'full',
        h: 'svh',
        overflow: 'hidden',
      })}
    >
      <div
        className={css({
          visibility: 'hidden',
        })}
      >
        <Camera
          ref={camera}
          errorMessages={{
            noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
            permissionDenied: 'Permission denied. Please refresh and give camera permission.',
            switchCamera:
              'It is not possible to switch camera to different one because there is only one video device accessible.',
            canvas: 'Canvas is not supported.',
          }}
        />
      </div>
      <div
        className={css({
          position: 'absolute',
          top: '[50%]',
          left: '[50%]',
          transform: 'translate(-50%, -50%)',
          w: '2/3',
          h: '2/3',
          zIndex: '[-10]',
          blur: '3xl',
          willChange: 'transform',
          bgColor: 'sage.7',
          borderRadius: 'full',
          filter: '[blur(200px)]',
          laptop: {
            w: '1/2',
            h: '1/2',
            filter: '[blur(320px)]',
          },
        })}
      />
      <p
        className={css({
          position: 'absolute',
          top: '10',
          right: '10',
          color: 'sage.11',
          fontSize: '3xl',
          fontWeight: 'bold',
        })}
      >
        {Math.floor(elapsedTime / 60)
          .toString()
          .padStart(2, '0')}
        :
        {Math.floor(elapsedTime % 60)
          .toString()
          .padStart(2, '0')}
      </p>
      <button
        type='button'
        className={css({
          cursor: 'pointer',
        })}
        onClick={isConnected ? disconnectConversation : connectConversation}
      >
        <AnimatedEmoji
          emoji={isConnected ? emoji : 'sleeping-face'}
          className={css({
            position: 'absolute',
            top: '[30%]',
            left: '[50%]',
            transform: 'translate(-50%, -50%)',
            w: '40',
            h: '40',
          })}
        />
        <span
          className={css({
            srOnly: true,
          })}
        >
          {isConnected ? '会話を終了する' : '会話を始める'}
        </span>
      </button>
      <div
        className={flex({
          direction: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          h: 'full',
          paddingTop: '12',
          paddingBottom: '32',
          paddingX: '32',
        })}
      >
        <h1
          className={css({
            color: 'sage.12',
            fontSize: '5xl',
            fontWeight: 'bold',
          })}
        >
          {conversationTitle}
        </h1>
        <div>
          {items.map(
            conversationItem =>
              conversationItem.role === 'assistant' &&
              !conversationItem.formatted.tool &&
              (conversationItem.formatted.transcript || conversationItem.formatted.text) && (
                <p
                  key={conversationItem.id}
                  className={css({
                    color: 'sage.12',
                    fontSize: '2xl',
                    fontWeight: 'bold',
                    bgColor: 'sage.2',
                    paddingX: '1',
                    paddingY: '0.5',
                    w: 'fit',
                  })}
                >
                  {conversationItem.formatted.transcript || conversationItem.formatted.text}
                </p>
              ),
          )}
        </div>
      </div>
      <FuzzyOverlay />
    </section>
  );
};
