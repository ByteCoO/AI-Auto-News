import { Composition } from 'remotion';
import MyVideo from '../src/MyVideo';

export default function RemotionRoot() {
  return (
    <>
      <Composition
        id="MyShortVideo"
        component={MyVideo}
        durationInFrames={150}  // 30fps × 5s
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
}