import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type FieldType = 'empty' | 'bus-stop' | 'gas-station' | 'traffic-light' | 'workshop' | 'obstacle' | 'nanocar';
type TrafficLightState = 'red' | 'red-yellow' | 'green';

interface Field {
  type: FieldType;
  number?: number;
  waitingPeople?: number;
  lightState?: TrafficLightState;
}

interface CityPlan {
  name: string;
  gridSize: number;
  grid: Field[][];
}

interface Tool {
  type: FieldType;
  icon: string;
  label: string;
  color: string;
}

const TOOLS: Tool[] = [
  { type: 'bus-stop', icon: '🚏', label: 'Haltestelle', color: '#00d4ff' },
  { type: 'gas-station', icon: '⛽', label: 'Tankstelle', color: '#ffaa00' },
  { type: 'traffic-light', icon: '🚦', label: 'Ampel', color: '#ff4444' },
  { type: 'workshop', icon: '🔧', label: 'Werkstatt', color: '#9b59b6' },
  { type: 'obstacle', icon: '🚧', label: 'Hindernis', color: '#e74c3c' },
  { type: 'nanocar', icon: '🚐', label: 'NanoCar', color: '#00ff88' },
  { type: 'empty', icon: '⬜', label: 'Löschen', color: '#666' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const App: React.FC = () => {
  const GRID_SIZE = 16;
  const CELL_SIZE = 50;
  
  const [grid, setGrid] = useState<Field[][]>(() => 
    Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({ type: 'empty' }))
    )
  );
  
  const [selectedTool, setSelectedTool] = useState<FieldType>('bus-stop');
  const [planName, setPlanName] = useState('Mein NanoCar Stadtplan');
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    drawGrid();
  }, [grid, hoveredCell]);

  const getNextNumber = (type: FieldType): number => {
    let maxNumber = 0;
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.type === type && cell.number) {
          maxNumber = Math.max(maxNumber, cell.number);
        }
      });
    });
    return maxNumber + 1;
  };

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const field = grid[y][x];
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;

        // Hover effect
        if (hoveredCell && hoveredCell.x === x && hoveredCell.y === y) {
          ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
        }

        // Grid lines
        ctx.strokeStyle = '#2a2a3e';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);

        // Draw field content
        drawField(ctx, field, px, py);
      }
    }
  };

  const drawField = (ctx: CanvasRenderingContext2D, field: Field, px: number, py: number) => {
    const centerX = px + CELL_SIZE / 2;
    const centerY = py + CELL_SIZE / 2;

    switch (field.type) {
      case 'bus-stop':
        ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
        ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚏', centerX, centerY - 5);
        
        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 14px "Space Mono"';
        ctx.fillText(`#${field.number}`, centerX, py + 12);
        
        if (field.waitingPeople !== undefined) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px "Space Mono"';
          ctx.fillText(`👥${field.waitingPeople}`, centerX, py + CELL_SIZE - 8);
        }
        break;

      case 'gas-station':
        ctx.fillStyle = 'rgba(255, 170, 0, 0.2)';
        ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⛽', centerX, centerY - 5);
        
        ctx.fillStyle = '#ffaa00';
        ctx.font = 'bold 14px "Space Mono"';
        ctx.fillText(`#${field.number}`, centerX, py + 12);
        break;

      case 'traffic-light':
        ctx.fillStyle = 'rgba(255, 68, 68, 0.2)';
        ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        ctx.fillStyle = '#333';
        ctx.fillRect(px + 15, py + 15, 20, 25);
        
        const lightColors = {
          red: ['#ff4444', '#222', '#222'],
          'red-yellow': ['#ff4444', '#ffaa00', '#222'],
          green: ['#222', '#222', '#44ff44']
        };
        const colors = lightColors[field.lightState || 'red'];
        
        colors.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px + 25, py + 20 + i * 7, 3, 0, Math.PI * 2);
          ctx.fill();
        });
        
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 14px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(`#${field.number}`, centerX, py + 12);
        break;

      case 'workshop':
        ctx.fillStyle = 'rgba(155, 89, 182, 0.2)';
        ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🔧', centerX, centerY - 5);
        
        ctx.fillStyle = '#9b59b6';
        ctx.font = 'bold 14px "Space Mono"';
        ctx.fillText(`#${field.number}`, centerX, py + 12);
        break;

      case 'obstacle':
        ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
        ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚧', centerX, centerY);
        break;

      case 'nanocar':
        ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
        ctx.fillRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚐', centerX, centerY - 5);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 14px "Space Mono"';
        ctx.fillText(`#${field.number}`, centerX, py + 12);
        break;
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      placeField(x, y);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      setHoveredCell({ x, y });
    } else {
      setHoveredCell(null);
    }
  };

  const placeField = (x: number, y: number) => {
    const newGrid = grid.map(row => [...row]);
    
    if (selectedTool === 'empty') {
      newGrid[y][x] = { type: 'empty' };
    } else if (selectedTool === 'obstacle') {
      newGrid[y][x] = { type: 'obstacle' };
    } else {
      const number = getNextNumber(selectedTool);
      const newField: Field = { 
        type: selectedTool, 
        number 
      };
      
      if (selectedTool === 'bus-stop') {
        newField.waitingPeople = 0;
      } else if (selectedTool === 'traffic-light') {
        newField.lightState = 'red';
      }
      
      newGrid[y][x] = newField;
    }
    
    setGrid(newGrid);
  };

  const changePeople = (x: number, y: number, delta: number) => {
    const newGrid = grid.map(row => [...row]);
    const field = newGrid[y][x];
    
    if (field.type === 'bus-stop' && field.waitingPeople !== undefined) {
      field.waitingPeople = Math.max(0, Math.min(20, field.waitingPeople + delta));
      setGrid(newGrid);
    }
  };

  const cycleTrafficLight = (x: number, y: number, forward: boolean) => {
    const newGrid = grid.map(row => [...row]);
    const field = newGrid[y][x];
    
    if (field.type === 'traffic-light' && field.lightState) {
      const states: TrafficLightState[] = ['red', 'red-yellow', 'green'];
      const currentIndex = states.indexOf(field.lightState);
      
      let nextIndex;
      if (forward) {
        nextIndex = (currentIndex + 1) % states.length;
      } else {
        nextIndex = (currentIndex - 1 + states.length) % states.length;
      }
      
      field.lightState = states[nextIndex];
      setGrid(newGrid);
    }
  };

  const clearGrid = () => {
    if (window.confirm('Möchtest du wirklich den gesamten Stadtplan löschen?')) {
      setGrid(Array(GRID_SIZE).fill(null).map(() => 
        Array(GRID_SIZE).fill(null).map(() => ({ type: 'empty' }))
      ));
    }
  };

  const savePlan = () => {
    const plan: CityPlan = {
      name: planName,
      gridSize: GRID_SIZE,
      grid: grid
    };
    const json = JSON.stringify(plan, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${planName.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadPlan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const plan: CityPlan = JSON.parse(event.target?.result as string);
        setGrid(plan.grid);
        setPlanName(plan.name);
      } catch (error) {
        alert('Fehler beim Laden des Stadtplans!');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStats = () => {
    let busStops = 0, gasStations = 0, trafficLights = 0, workshops = 0, obstacles = 0, nanocars = 0;
    
    grid.forEach(row => {
      row.forEach(field => {
        switch (field.type) {
          case 'bus-stop': busStops++; break;
          case 'gas-station': gasStations++; break;
          case 'traffic-light': trafficLights++; break;
          case 'workshop': workshops++; break;
          case 'obstacle': obstacles++; break;
          case 'nanocar': nanocars++; break;
        }
      });
    });
    
    return { busStops, gasStations, trafficLights, workshops, obstacles, nanocars };
  };

  const stats = getStats();

  // Get all interactive elements for control panel
  const getInteractiveElements = () => {
    const elements: Array<{ x: number; y: number; field: Field }> = [];
    
    grid.forEach((row, y) => {
      row.forEach((field, x) => {
        if (field.type === 'bus-stop' || field.type === 'traffic-light') {
          elements.push({ x, y, field });
        }
      });
    });
    
    return elements;
  };

  const interactiveElements = getInteractiveElements();

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>NanoCars</h1>
          <div className="subtitle">Stadtplan-Designer</div>
          <input
            type="text"
            className="plan-name-input"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
          />
        </div>

        <div className="main-grid">
          {/* Toolbox */}
          <div className="panel toolbox">
            <h3 className="panel-title">🛠️ Werkzeuge</h3>
            
            {TOOLS.map(tool => (
              <button
                key={tool.type}
                className={`tool-btn ${selectedTool === tool.type ? 'active' : ''}`}
                onClick={() => setSelectedTool(tool.type)}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span>{tool.label}</span>
              </button>
            ))}

            <div className="stats">
              <strong>📊 Statistik</strong>
              <div>🚏 Haltestellen: {stats.busStops}</div>
              <div>⛽ Tankstellen: {stats.gasStations}</div>
              <div>🚦 Ampeln: {stats.trafficLights}</div>
              <div>🔧 Werkstätten: {stats.workshops}</div>
              <div>🚧 Hindernisse: {stats.obstacles}</div>
              <div>🚐 NanoCars: {stats.nanocars}</div>
            </div>
          </div>

          {/* Canvas */}
          <div className="panel">
            <div className="action-buttons">
              <button className="action-btn" onClick={savePlan}>
                💾 Speichern
              </button>
              <label className="action-btn secondary">
                📂 Laden
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={loadPlan}
                  style={{ display: 'none' }}
                />
              </label>
              <button className="action-btn secondary" onClick={clearGrid}>
                🗑️ Alles löschen
              </button>
            </div>

            <canvas
              ref={canvasRef}
              width={GRID_SIZE * CELL_SIZE}
              height={GRID_SIZE * CELL_SIZE}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setHoveredCell(null)}
              className="canvas"
            />

            <div className="tip">
              <strong>💡 Tipp:</strong> Klicke auf ein Feld, um es zu platzieren. 
              Nutze die Steuerung rechts für Haltestellen (Personen ±) und Ampeln (Farbe ±).
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <h4 className="control-title">🎮 Steuerung</h4>
        
        {interactiveElements.length === 0 ? (
          <div className="empty-controls">Keine steuerbaren Elemente</div>
        ) : (
          interactiveElements.map(({ x, y, field }) => {
            if (field.type === 'bus-stop') {
              return (
                <div key={`${x}-${y}`} className="control-item">
                  <div className="control-item-title" style={{ color: '#00d4ff' }}>
                    🚏 Haltestelle #{field.number}
                  </div>
                  <div className="control-buttons">
                    <button 
                      className="control-btn"
                      onClick={() => changePeople(x, y, -1)}
                    >
                      −
                    </button>
                    <span>👥 {field.waitingPeople}</span>
                    <button 
                      className="control-btn"
                      onClick={() => changePeople(x, y, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            }
            
            if (field.type === 'traffic-light') {
              const stateLabels = {
                'red': '🔴 Rot',
                'red-yellow': '🟡 Rot-Gelb',
                'green': '🟢 Grün'
              };
              return (
                <div key={`${x}-${y}`} className="control-item">
                  <div className="control-item-title" style={{ color: '#ff4444' }}>
                    🚦 Ampel #{field.number}
                  </div>
                  <div className="control-buttons">
                    <button 
                      className="control-btn"
                      onClick={() => cycleTrafficLight(x, y, false)}
                    >
                      ←
                    </button>
                    <span style={{ fontSize: '11px' }}>
                      {stateLabels[field.lightState || 'red']}
                    </span>
                    <button 
                      className="control-btn"
                      onClick={() => cycleTrafficLight(x, y, true)}
                    >
                      →
                    </button>
                  </div>
                </div>
              );
            }
            
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default App;
