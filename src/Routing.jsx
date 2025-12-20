import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap, Tooltip, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { Car, Plus, RotateCw, X, BarChart3, Sparkles, Cpu, Terminal, CheckCircle2, Search, MapPin, Trash2, Zap, AlertTriangle } from 'lucide-react';
import AnalyticsModal from "./Comparison";

const createCustomIcon = (label, type = 'point') => L.divIcon({
  className: 'custom-div-icon',
  html: `<div class='marker-pin ${type}'><span>${label}</span></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const VEHICLE_COLORS = ['#06b6d4', '#f472b6', '#facc15', '#4ade80', '#a78bfa'];

function MapController({ centerPos }) {
  const map = useMap();
  React.useEffect(() => {
    if (centerPos) {
      map.flyTo(centerPos, 14, { duration: 2 });
    }
  }, [centerPos, map]);
  return null;
}

export default function MultiRouting() {
  const [points, setPoints] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isAddingPoints, setIsAddingPoints] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]); 
  const [numVehicles, setNumVehicles] = useState(2);
  const [depot, setDepot] = useState(null);
  
  const [activeVehicles, setActiveVehicles] = useState([]); 
  
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [classicalDistance, setClassicalDistance] = useState(0);
  const [trafficHotspots, setTrafficHotspots] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [trafficMode, setTrafficMode] = useState("normal");

  const addLog = (msg) => setLogs(prev => [...prev, msg]);
  useEffect(() => {
    addLog("🔌 Establishing connection to Quantum Cloud...");
    warmUpRender();
  }, []);

  function warmUpRender() {
    fetch("https://quantum-optimizer.onrender.com", { method: "GET" }).catch(e => console.log("Warming Render..."));
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const selectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setMapCenter([lat, lng]);
    setSearchResults([]);
    setSearchQuery("");
    if (!isAddingPoints) setIsAddingPoints(true);
  };

  const toggleVehicle = (index) => {
    setActiveVehicles(prev => {
      if (prev.includes(index)) return prev.filter(i => i !== index);
      return [...prev, index];
    });
  };

  const toggleTrafficMode = () => {
    const newMode = trafficMode === "normal" ? "heavy" : "normal";
    setTrafficMode(newMode);

    if (newMode === "heavy" && points.length > 0) {
      const hotspots = [];
      const numHotspots = Math.max(2, Math.floor(points.length / 2));
      for (let i = 0; i < numHotspots; i++) {
        const randomPoint = points[Math.floor(Math.random() * points.length)];
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lngOffset = (Math.random() - 0.5) * 0.02;
        hotspots.push({
          id: i,
          coords: [randomPoint.coords[0] + latOffset, randomPoint.coords[1] + lngOffset]
        });
      }
      setTrafficHotspots(hotspots);
    } else {
      setTrafficHotspots([]);
    }
  };

  const removePoint = (id) => {
    setPoints(prev => prev.filter(p => p.id !== id));
    setRoutes([]);
    setOptimizationResult(null);
  };

  const removeDepot = () => {
    setDepot(null);
    setRoutes([]);
    setOptimizationResult(null);
  }

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (isAddingPoints) {
          const newPoint = { 
            id: Date.now(), 
            coords: [e.latlng.lat, e.latlng.lng], 
            label: `P${points.length + 1}` 
          };
          if (!depot) {
            setDepot({ coords: [e.latlng.lat, e.latlng.lng], label: 'D' });
          } else {
            setPoints(prev => [...prev, newPoint]);
          }
        }
      },
    });
    return null;
  }

  async function fetchOptimizedRoutes() {
    if (!depot || points.length < 1) {
      alert("Please add a depot and at least one delivery point!");
      return;
    }

    setIsLoading(true);
    setLogs([]);
    setRoutes([]);
    setActiveVehicles([]); 
    addLog("⚡ Initializing Quantum Orchestrator...");
    
    const backendLocations = [
      { id: "0", name: "Depot", lat: depot.coords[0], lng: depot.coords[1] },
      ...points.map((p, idx) => ({
        id: p.id.toString(),
        name: p.label,
        lat: p.coords[0],
        lng: p.coords[1]
      }))
    ];

    try {
      addLog("📊 Calculating Classical Baseline...");
      const tomTomKey = "ELywRAU2paAyugBRkV2uaBSil76E1HD2";
      let classicDist = 0;
      
      const allCoords = [depot.coords, ...points.map(p => p.coords)];
      for(let i=0; i<allCoords.length-1; i++) {
        classicDist += calcCrowFlies(allCoords[i], allCoords[i+1]);
      }
      classicDist += calcCrowFlies(allCoords[allCoords.length-1], allCoords[0]);
      setClassicalDistance(classicDist * 1.6); 

      addLog(`🚀 Sending to Quantum API (${trafficMode} mode)...`);

      const payload = {
        locations: backendLocations,
        num_vehicles: numVehicles,
        traffic_intensity: trafficMode,
      };

      const railwayURL = "https://quantum-vrp-production.up.railway.app/api/optimize";
      const renderURL = "https://quantum-optimizer.onrender.com/api/optimize";

      let res;
      let source = "Railway";
      
      try {
        res = await fetch(railwayURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Railway failed");
      } catch (railwayErr) {
        addLog("⚠️ Railway unavailable — switching to Render backup...");
        
        res = await fetch(renderURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("All backend services failed.");
        source = "Render";
      }

      const data = await res.json();
      setOptimizationResult(data);
      addLog(`✅ Solution Found via: ${source} Cluster`);
      
      const processedRoutes = [];
      
      for (let v = 0; v < data.routes.length; v++) {
        const vehicle = data.routes[v];
        addLog(`🗺️ Mapping Route for Vehicle ${vehicle.vehicle_id}...`);
        
        let routeCoordinates = [];
        
        for (let i = 0; i < vehicle.steps.length - 1; i++) {
          const start = vehicle.steps[i];
          const end = vehicle.steps[i + 1];
          const url = `https://api.tomtom.com/routing/1/calculateRoute/${start.lat},${start.lng}:${end.lat},${end.lng}/json?key=${tomTomKey}&traffic=true`;
          
          try {
            const legRes = await fetch(url);
            const legData = await legRes.json();
            if (legData.routes?.[0]?.legs?.[0]?.points) {
              const legPoints = legData.routes[0].legs[0].points.map(p => [p.latitude, p.longitude]);
              routeCoordinates = [...routeCoordinates, ...legPoints];
            } else {
              routeCoordinates.push([start.lat, start.lng], [end.lat, end.lng]);
            }
          } catch (e) {
            routeCoordinates.push([start.lat, start.lng], [end.lat, end.lng]);
          }
          await new Promise(r => setTimeout(r, 100)); 
        }

        processedRoutes.push({
          vehicleId: vehicle.vehicle_id,
          points: routeCoordinates,
          color: VEHICLE_COLORS[v % VEHICLE_COLORS.length],
          distance: vehicle.total_distance_km,
          stopCount: vehicle.steps.length - 2 
        });
      }

      setRoutes(processedRoutes);
      addLog("✨ Optimization Complete!");

    } catch (error) {
      alert(`Error: ${error.message}`);
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  function calcCrowFlies(p1, p2) {
    const R = 6371; 
    const dLat = (p2[0]-p1[0]) * Math.PI/180;
    const dLon = (p2[1]-p1[1]) * Math.PI/180;
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(p1[0]*Math.PI/180) * Math.cos(p2[0]*Math.PI/180) * Math.sin(dLon/2)*Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden text-white font-sans selection:bg-indigo-500/30">
       <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #111827; }
        ::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #6366f1; }
        .marker-pin { width: 40px; height: 40px; border-radius: 50% 50% 50% 0; position: absolute; transform: rotate(-45deg); left: 50%; top: 50%; margin: -20px 0 0 -20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(99, 102, 241, 0.6); border: 3px solid white; z-index: 100;}
        .marker-pin.point { background: #4f46e5; }
        .marker-pin.depot { background: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.6); }
        .marker-pin span { transform: rotate(45deg); font-weight: 800; font-size: 12px; color: white; }
      `}</style>
      
      <div className="w-96 bg-gray-900 border-r border-gray-800 flex flex-col z-20 shadow-2xl relative">
        <div className="p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Cpu className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Quantum VRP</h1>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                <span className="text-xs text-green-400 font-mono">SYSTEM ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
          
          <div className="relative z-50">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Find Location</label>
            <div className="relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Search places (e.g. Taj Mahal)..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Search className="absolute left-3 top-3 text-gray-500" size={16} />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                  {searchResults.map((result, i) => (
                    <button 
                      key={i}
                      onClick={() => selectSearchResult(result)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm border-b border-gray-700/50 last:border-0"
                    >
                      <div className="font-medium text-white truncate">{result.display_name.split(',')[0]}</div>
                      <div className="text-xs text-gray-400 truncate">{result.display_name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Zap size={12} className="text-yellow-400"/> Scenario Modeling
              </label>
              {trafficMode === "heavy" && <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30 animate-pulse">SIMULATION ACTIVE</span>}
            </div>
            
            <button 
              onClick={toggleTrafficMode}
              className={`w-full p-3 rounded-lg border text-xs font-bold flex items-center justify-between transition-all duration-300 ${
                trafficMode === "heavy" 
                ? "bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                : "bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-5 rounded-full relative transition-colors ${trafficMode === "heavy" ? "bg-red-500" : "bg-gray-700"}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${trafficMode === "heavy" ? "left-4" : "left-1"}`} />
                </div>
                <span>High Congestion</span>
              </div>
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fleet Size</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(num => (
                <button key={num} onClick={() => setNumVehicles(num)}
                  className={`p-3 rounded-lg border transition-all ${numVehicles === num ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}>
                  <div className="flex flex-col items-center gap-1">
                    <Car size={16} />
                    <span className="text-xs font-bold">{num}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button 
              onClick={() => setIsAddingPoints(!isAddingPoints)}
              className={`w-full p-4 rounded-xl border flex items-center justify-center gap-2 transition-all font-medium ${isAddingPoints ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-gray-800 border-gray-700 hover:bg-gray-750 text-white'}`}
            >
              {isAddingPoints ? <><X size={18}/> Stop Adding</> : <><Plus size={18}/> Add Locations</>}
          </button>

          {(depot || points.length > 0) && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stops Queue</label>
              <div className="bg-gray-800/50 rounded-xl p-2 max-h-48 overflow-y-auto border border-gray-700 space-y-1">
                {depot && (
                   <div className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg border border-red-500/20 group">
                     <div className="flex items-center gap-3">
                       <div className="w-2 h-2 bg-red-500 rounded-full"/>
                       <span className="text-xs text-red-200 font-medium">Central Depot</span>
                     </div>
                     <button onClick={removeDepot} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Trash2 size={14}/>
                     </button>
                   </div>
                )}
                {points.map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg border border-gray-700 group">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"/>
                      <span className="text-xs text-gray-300">Point {idx + 1}</span>
                    </div>
                    <button onClick={() => removePoint(p.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Trash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={fetchOptimizedRoutes}
            disabled={!depot || points.length < 1 || isLoading}
            className={`w-full p-4 rounded-xl font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all
              ${isLoading ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25'}
            `}
          >
            {isLoading ? <RotateCw className="animate-spin"/> : <Sparkles size={18}/>}
            {isLoading ? "QUANTUM PROCESSING..." : "RUN OPTIMIZER"}
          </button>
          
          {isLoading && (
            <div className="bg-black rounded-lg p-4 font-mono text-xs border border-gray-800 h-32 overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-gray-800 pb-1">
                <Terminal size={12}/> Console
              </div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-green-400 animate-in slide-in-from-left-2 fade-in">
                    <span className="opacity-50 mr-2">{'>'}</span>{log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {optimizationResult && !isLoading && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
              
              <div className="flex justify-between items-center">
                 <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Assigned Routes</label>
                 <span className="text-[10px] text-gray-500">Click to filter map</span>
              </div>

              <div className="space-y-2">
                {routes.map((route, idx) => {
                  const isActive = activeVehicles.length === 0 || activeVehicles.includes(idx);
                  return (
                    <div 
                      key={idx}
                      onClick={() => toggleVehicle(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group
                        ${isActive 
                          ? 'bg-gray-800 border-indigo-500/50 shadow-lg shadow-black/20' 
                          : 'bg-gray-900 border-gray-800 opacity-60 hover:opacity-80'
                        }
                      `}
                    >
                       <div className="flex items-center gap-3">
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isActive ? 'border-transparent' : 'border-gray-600'}`} style={{backgroundColor: isActive ? route.color : 'transparent'}}>
                            {isActive && <CheckCircle2 size={14} className="text-black"/>}
                         </div>
                         <div>
                            <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>Vehicle {route.vehicleId}</div>
                            <div className="text-[10px] text-gray-500">{route.stopCount} Stops • {route.distance.toFixed(1)} km</div>
                         </div>
                       </div>
                       
                       <div className="text-right">
                          <div className="text-xs font-mono text-gray-500 group-hover:text-indigo-400 transition-colors">View</div>
                       </div>
                    </div>
                  )
                })}
              </div>

               <button 
                onClick={() => setShowAnalytics(true)}
                className="w-full p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-indigo-400 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
              >
                <BarChart3 size={16}/> View Full Analysis
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer center={[18.5204, 73.8567]} zoom={13} style={{ height: "100%", width: "100%", background: '#020617' }}>
          <TileLayer 
             url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
             attribution='&copy; CARTO'
          />
          <MapClickHandler />
          <MapController centerPos={mapCenter} />
          
          {depot && (
             <Marker position={depot.coords} icon={createCustomIcon('D', 'depot')}>
               <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>Central Depot</Tooltip>
             </Marker>
          )}
          
          {points.map((p, idx) => (
            <Marker key={p.id} position={p.coords} icon={createCustomIcon(`P${idx+1}`)}>
               <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>Point {idx + 1}</Tooltip>
            </Marker>
          ))}
          
          {routes.map((route, i) => {
            const isVisible = activeVehicles.length === 0 || activeVehicles.includes(i);
            if (!isVisible) return null;

            return (
              <Polyline 
                key={i} 
                positions={route.points} 
                pathOptions={{ 
                  color: route.color, 
                  weight: 6,
                  opacity: 1,
                  lineCap: 'round',
                  shadowBlur: 10,
                  shadowColor: route.color
                }} 
              />
            );
          })}
          
          {trafficMode === "heavy" && trafficHotspots.map(h => (
            <React.Fragment key={h.id}>
              <Circle 
                center={h.coords}
                pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.4, weight: 0 }}
                radius={800} 
              />
              <Marker 
                position={h.coords} 
                icon={L.divIcon({
                  className: 'traffic-icon',
                  html: `<div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-xl animate-pulse"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg></div>`,
                  iconSize: [32, 32]
                })}
              >
                 <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>High Congestion</Tooltip>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
        
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 pointer-events-none">
          {optimizationResult && (
             <div className="bg-black/80 backdrop-blur text-white px-4 py-2 rounded-full border border-green-500/30 flex items-center gap-2 shadow-xl">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
               <span className="text-xs font-bold">OPTIMIZED</span>
             </div>
          )}
        </div>
      </div>

      {showAnalytics && (
        <AnalyticsModal 
          optimizationResult={optimizationResult} 
          routes={routes} 
          onClose={() => setShowAnalytics(false)} 
          classicalDistance={classicalDistance}
        />
      )}
    </div>
  );
}