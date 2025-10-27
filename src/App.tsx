import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { EntryPage } from '@/pages';
import { KalahPage } from '@/pages/games/kalah';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route
            path="/games"
            element={<Navigate to="/game/kalah" replace />}
          />
          <Route path="/game/kalah" element={<KalahPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
