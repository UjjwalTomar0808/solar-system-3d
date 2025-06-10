import { useState } from 'react';
import SolarSystem from './components/SolarSystem';
import ControlPanel from './components/ControlPanel';
import './App.css';

function App() {
  const [planetSpeeds, setPlanetSpeeds] = useState(new Array(8).fill(1));
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="App">
      <SolarSystem 
        planetSpeeds={planetSpeeds} 
        isPaused={isPaused}
      />
      <ControlPanel 
        planetSpeeds={planetSpeeds}
        setPlanetSpeeds={setPlanetSpeeds}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />
    </div>
  );
}

export default App;