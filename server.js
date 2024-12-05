const WebSocket = require('ws');
const ffmpeg = require('fluent-ffmpeg');
const stream = require('stream');
const url = require('url');

const wss = new WebSocket.Server({ port: 8080 });

const videoSources = {
    '/video1': 'video1.mp4',
    '/video2': 'video2.mp4'
};

wss.on('connection', function connection(ws, req) {
    const pathname = url.parse(req.url).pathname;
    const videoFile = videoSources[pathname] || 'video1.mp4';
    
    console.log(`客户端已连接，请求视频: ${videoFile}`);

    const videoStream = ffmpeg()
        .input(videoFile)
        .inputFormat('mp4')
        .outputOptions([
            '-c:v copy',
            '-c:a aac',
            '-b:a 128k',
            '-strict experimental',
            '-f mp4',
            '-movflags frag_keyframe+empty_moov+default_base_moof+omit_tfhd_offset+faststart',
            '-max_muxing_queue_size 1024'
        ])
        .on('start', (commandLine) => {
            console.log(`FFmpeg 开始运行 ${videoFile}:`, commandLine);
        })
        .on('progress', (progress) => {
            console.log(`处理进度 ${videoFile}:`, progress);
        })
        .on('error', (err) => {
            console.error(`FFmpeg 错误 ${videoFile}:`, err);
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        })
        .on('end', () => {
            console.log(`FFmpeg 处理完成 ${videoFile}`);
        });

    let totalSent = 0;

    const outputStream = new stream.Writable({
        write: function(chunk, encoding, next) {
            if (ws.readyState === WebSocket.OPEN) {
                totalSent += chunk.length;
                console.log(`发送数据 ${videoFile}: ${chunk.length} 字节, 总计: ${totalSent} 字节`);
                ws.send(chunk, { binary: true });
            }
            next();
        }
    });

    videoStream.pipe(outputStream);

    ws.on('close', () => {
        console.log(`客户端已断开 ${videoFile}`);
        videoStream.kill();
    });

    ws.on('error', (error) => {
        console.error(`WebSocket 错误 ${videoFile}:`, error);
        videoStream.kill();
    });
});

console.log('WebSocket服务器运行在 ws://localhost:8080');