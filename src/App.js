

// src/App.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeroBanner  from './HeroBanner';
import EjetSection from './components/EjetSection';
import JetBoard from './components/JetBoard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"    element={<HeroBanner />} />
        <Route path="/ejet" element={<EjetSection />} />
        <Route path="/jetboard" element={<JetBoard/>} />
      </Routes>
    </BrowserRouter>
  );
}
