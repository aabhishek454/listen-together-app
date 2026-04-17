import React, { useState, useEffect, useRef } from 'react';
import Identity from './components/Identity';
import WatchParty from './components/WatchParty';
import io from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(localStorage.getItem('mplayer_user'));
  const [state, setState] = useState({
    currentVideoId: 'dQw4w9WgXcQ',
    isPlaying: false,
    currentTime: 0,
    volume: 50,
    queue: [],
    messages: []
  });
  const socketRef = useRef();

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      reconnection: true
    });

    socketRef.current.on('initialState', (initialState) => {
      setState(initialState);
    });

    socketRef.current.on('videoChanged', (newState) => {
      setState(prev => ({ ...prev, ...newState }));
    });

    socketRef.current.on('playerStateChange', (newState) => {
      setState(prev => ({ ...prev, ...newState }));
    });

    socketRef.current.on('volumeAction', ({ volume }) => {
      setState(prev => ({ ...prev, volume }));
    });

    socketRef.current.on('queueUpdate', (queue) => {
      setState(prev => ({ ...prev, queue }));
    });

    socketRef.current.on('receiveMessage', (message) => {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user]);

  const emitEvent = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, { ...data, user });
    }
  };

  if (!user) {
    return <Identity setUser={setUser} />;
  }

  return (
    <div className="min-h-screen">
      <WatchParty 
        user={user} 
        state={state} 
        emitEvent={emitEvent} 
      />
    </div>
  );
}

export default App;
