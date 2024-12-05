# WebSocket 视频流媒体服务器

这是一个基于 WebSocket 和 FFmpeg 的视频流媒体服务器,支持实时转码和流式传输 MP4 视频文件。

## 功能特点

- 基于 WebSocket 的实时视频流传输
- 支持多视频源切换
- 实时视频转码和压缩
- 浏览器端实时播放
- 详细的调试和状态信息

## 系统要求

- Node.js 12.0 或更高版本
- FFmpeg 4.0 或更高版本

## 安装

1. 安装 FFmpeg

**Ubuntu/Debian:**

    sudo apt update
    sudo apt install ffmpeg

**MacOS:**

    brew install ffmpeg

**Windows:**
- 从 [FFmpeg官网](https://ffmpeg.org/download.html) 下载
- 添加到系统环境变量

2. 安装项目依赖

    npm install

## 使用方法

1. 启动服务器:

    npm start

2. 打开客户端页面 `client.html`

3. 默认连接地址为 `ws://localhost:8080/video1`

## 视频源配置

在 `server.js` 中配置视频源:

    const videoSources = {
        '/video1': 'video1.mp4',
        '/video2': 'video2.mp4'
    };

将视频文件放置在项目根目录下。

## FFmpeg 参数说明

服务器使用以下 FFmpeg 配置进��视频转码:

- `-c:v copy`: 复制视频流,不进行重新编码
- `-c:a aac`: 使用 AAC 编码音频
- `-b:a 128k`: 音频比特率设置为 128kbps
- `-f mp4`: 输出格式为 MP4
- `-movflags`: 优化 MP4 流式传输
  - `frag_keyframe`: 在关键帧处分段
  - `empty_moov`: 快速启动播放
  - `default_base_moof`: 优化流式传输
  - `omit_tfhd_offset`: 减少头部大小
  - `faststart`: 优化首次加载速度

## 调试

- 服务器端日志包含:
  - 连接状态
  - FFmpeg 转码信息
  - 数据传输统计
  
- 客户端页面包含:
  - 连接状态显示
  - 数据接收统计
  - 详细调试日志

## 注意事项

1. 确保视频文件格式为 MP4
2. 视频文件应放置在正确的目录下
3. 检查端口 8080 是否被占用
4. 大文件传输可能需要调整 Node.js 内存限制

## 错误处理

- 服务器会自动处理断开连接
- 支持重新连接机制
- 详细的错误日志记录

## 性能优化

- 使用 FFmpeg copy 模式避免重新编码
- 实现了数据流管理
- 支持视频分段传输
- 优化了内存使用

## License

ISC 
