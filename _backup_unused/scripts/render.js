const { renderMedia } = require('@remotion/renderer');
const path = require('path');

(async () => {
  // 确保先跑：npm run dev
  await renderMedia({
    serveUrl: 'http://localhost:3000',
    composition: 'MyShortVideo',
    codec: 'h264',
    outputLocation: path.resolve('./out/video.mp4'),
    parallelism: 4,
  });
  console.log('✅ 渲染完成：out/video.mp4');
})();