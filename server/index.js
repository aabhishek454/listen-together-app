require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const ytSearch = require('yt-search');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// App State
let appState = {
  currentVideoId: 'dQw4w9WgXcQ', // Default video
  currentTitle: 'Never Gonna Give You Up',
  isPlaying: false,
  currentTime: 0,
  volume: 50,
  queue: [],
  lastUpdated: Date.now(),
  sender: null
};

// Chat History (Last 50 messages)
let chatMessages = [];

app.get('/api/youtube/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    const results = await ytSearch(q);
    const videos = results.videos.slice(0, 10).map(video => ({
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      channel: video.author.name
    }));

    res.json(videos);
  } catch (error) {
    console.error('YouTube Search Error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send initial state to the user joining
  socket.emit('initialState', {
    ...appState,
    currentTime: appState.isPlaying 
      ? appState.currentTime + (Date.now() - appState.lastUpdated) / 1000 
      : appState.currentTime,
    volume: appState.volume,
    queue: appState.queue,
    messages: chatMessages
  });

  socket.on('changeVideo', (data) => {
    appState = {
      ...appState,
      currentVideoId: data.videoId,
      currentTitle: data.title || 'Unknown Title',
      currentTime: 0,
      isPlaying: true,
      lastUpdated: Date.now(),
      sender: data.user
    };
    io.emit('videoChanged', appState);
  });

    socket.on('play', (data) => {
    appState = {
      ...appState,
      isPlaying: true,
      currentTime: data.currentTime,
      lastUpdated: Date.now(),
      sender: data.user
    };
    io.emit('playerStateChange', appState);
  });

  socket.on('pause', (data) => {
    appState = {
      ...appState,
      isPlaying: false,
      currentTime: data.currentTime,
      lastUpdated: Date.now(),
      sender: data.user
    };
    io.emit('playerStateChange', appState);
  });

  socket.on('seek', (data) => {
    appState = {
      ...appState,
      currentTime: data.currentTime,
      lastUpdated: Date.now(),
      sender: data.user
    };
    io.emit('playerStateChange', appState);
  });

  socket.on('volumeChange', (data) => {
    appState.volume = data.volume;
    io.emit('volumeAction', { volume: data.volume });
  });

  socket.on('addToQueue', (data) => {
    const newItem = {
      id: Date.now(),
      videoId: data.videoId,
      title: data.title,
      thumbnail: data.thumbnail
    };
    appState.queue.push(newItem);
    io.emit('queueUpdate', appState.queue);
  });

  socket.on('nextTrack', () => {
    if (appState.queue.length > 0) {
      const next = appState.queue.shift();
      appState = {
        ...appState,
        currentVideoId: next.videoId,
        currentTitle: next.title,
        currentTime: 0,
        isPlaying: true,
        lastUpdated: Date.now(),
        sender: 'System'
      };
      io.emit('videoChanged', appState);
      io.emit('queueUpdate', appState.queue);
    }
  });

  socket.on('removeFromQueue', (id) => {
    appState.queue = appState.queue.filter(item => item.id !== id);
    io.emit('queueUpdate', appState.queue);
  });

  socket.on('trackEnded', () => {
    if (appState.queue.length > 0) {
      const next = appState.queue.shift();
      appState = {
        ...appState,
        currentVideoId: next.videoId,
        currentTitle: next.title,
        currentTime: 0,
        isPlaying: true,
        lastUpdated: Date.now(),
        sender: 'System'
      };
      io.emit('videoChanged', appState);
      io.emit('queueUpdate', appState.queue);
    }
  });

  socket.on('sendMessage', (data) => {
    const newMessage = {
      id: Date.now(),
      user: data.user,
      text: data.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    chatMessages.push(newMessage);
    if (chatMessages.length > 50) chatMessages.shift();
    io.emit('receiveMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
