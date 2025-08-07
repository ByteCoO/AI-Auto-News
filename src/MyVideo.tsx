import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  staticFile,
  Img,
  interpolate,
} from 'remotion';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        color: '#fff',
        fontSize: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 文字淡入 */}
      <Sequence from={0} durationInFrames={60}>
        <div style={{ opacity }}>你好，Remotion！</div>
      </Sequence>

      {/* 图片缩放 */}
      <Sequence from={60} durationInFrames={90}>
        <Img
          src={staticFile('logo.png')}
          style={{
            width: 300,
            transform: `scale(${interpolate(frame, [60, 150], [0.5, 1])})`,
          }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export default MyVideo;