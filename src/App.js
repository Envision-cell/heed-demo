

// src/App.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeroBanner  from './HeroBanner';
import JetBoard from './components/EjetSection';
import EjetSection from './components/JetBoard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"    element={<HeroBanner />} />
        <Route path="/jetboard" element={<JetBoard/>} />
        <Route path="/ejet" element={<EjetSection />} />
      </Routes>
    </BrowserRouter>
  );
}
