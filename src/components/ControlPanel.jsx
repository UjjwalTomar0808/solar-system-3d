import { planetsData } from '../data/planets';
import './ControlPanel.css';

const ControlPanel = ({ planetSpeeds, setPlanetSpeeds, isPaused, setIsPaused }) => {
  const handleSpeedChange = (index, value) => {
    const newSpeeds = [...planetSpeeds];
    newSpeeds[index] = parseFloat(value);
    setPlanetSpeeds(newSpeeds);
  };

  const resetSpeeds = () => {
    setPlanetSpeeds(new Array(8).fill(1));
  };

  return (
    <div className="control-panel">
      <div className="control-header">
        <h2>Solar System Controls</h2>
        <div className="main-controls">
          <button 
            className={`pause-btn ${isPaused ? 'paused' : ''}`}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button className="reset-btn" onClick={resetSpeeds}>
            🔄 Reset Speeds
          </button>
        </div>
      </div>
      
      <div className="planet-controls">
        {planetsData.map((planet, index) => (
          <div key={planet.name} className="planet-control">
            <div className="planet-info">
              <div 
                className="planet-color" 
                style={{ backgroundColor: `#${planet.color.toString(16).padStart(6, '0')}` }}
              />
              <div className="planet-details">
                <span className="planet-name">{planet.name}</span>
                <span className="planet-description">{planet.info}</span>
              </div>
            </div>
            <div className="speed-control">
              <label htmlFor={`speed-${index}`}>Speed: {planetSpeeds[index].toFixed(1)}x</label>
              <input
                id={`speed-${index}`}
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={planetSpeeds[index]}
                onChange={(e) => handleSpeedChange(index, e.target.value)}
                className="speed-slider"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="instructions">
        <p>🖱️ Click and drag to rotate camera</p>
        <p>🖱️ Scroll to zoom in/out</p>
        <p>🎛️ Adjust sliders to control planet speeds</p>
      </div>
    </div>
  );
};

export default ControlPanel;