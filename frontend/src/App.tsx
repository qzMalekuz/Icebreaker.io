import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import WaitingRoom from './components/WaitingRoom';
import Session from './components/Session';
import Result from './components/Result';
import Safety from './components/Safety';
import Philosophy from './components/Philosophy';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/waiting" element={<WaitingRoom />} />
        <Route path="/session/:roomId" element={<Session />} />
        <Route path="/result/:roomId" element={<Result />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/philosophy" element={<Philosophy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
