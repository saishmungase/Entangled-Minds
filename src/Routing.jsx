import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { Car, Plus, RotateCw, X, BarChart3, Sparkles, TrendingUp, Clock, Zap, Route } from 'lucide-react';

const createCustomIcon = (number, isDepot = false) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div class='marker-pin ${isDepot ? 'depot' : ''}'><span>${isDepot ? 'D' : number}</span></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const VEHICLE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71', '#F1C40F'];

function AnalyticsModal({ optimizationResult, routes, onClose, classicalDistance, trafficData }) {
  if (!optimizationResult) return null;
  const routeColors = VEHICLE_COLORS.slice(0, routes.length);
  const quantumDistance = optimizationResult.total_distance || 0;
  const calculatedTotal = routes.reduce((sum, r) => sum + (r.distance || 0), 0);
  const displayDistance = quantumDistance > 0 ? quantumDistance : calculatedTotal;
  const quantumImprovement = classicalDistance > 0 ? ((classicalDistance - displayDistance) / classicalDistance * 100).toFixed(1) : 0;
  const isImprovement = parseFloat(quantumImprovement) > 0;
  const totalTrafficDelay = trafficData.reduce((sum, [, , delay]) => sum + delay, 0);
  const avgTrafficDelay = trafficData.length > 0 ? totalTrafficDelay / trafficData.length : 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-lg" onClick={onClose} />
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="relative p-6 border-b border-gray-700 bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg"><Sparkles className="text-white" size={24} /></div>
              <div><h2 className="text-2xl font-bold text-white">Quantum Analytics</h2><p className="text-indigo-300 text-sm mt-1">Advanced Route Optimization Insights</p></div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-blue-500/20 rounded-lg"><Route className="text-blue-400" size={20} /></div><span className="text-gray-400 text-sm">Total Distance</span></div><div className="text-3xl font-bold text-white">{displayDistance.toFixed(1)}<span className="text-lg text-gray-400 ml-2">km</span></div></div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-purple-500/20 rounded-lg"><Clock className="text-purple-400" size={20} /></div><span className="text-gray-400 text-sm">Compute Time</span></div><div className="text-3xl font-bold text-white">{optimizationResult.execution_time.toFixed(2)}<span className="text-lg text-gray-400 ml-2">sec</span></div></div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-pink-500/20 rounded-lg"><TrendingUp className="text-pink-400" size={20} /></div><span className="text-gray-400 text-sm">Circuit Depth</span></div><div className="text-3xl font-bold text-white">{optimizationResult.quantum_circuit_depth}</div></div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700"><div className="flex items-center gap-3 mb-2"><div className="p-2 bg-green-500/20 rounded-lg"><Zap className="text-green-400" size={20} /></div><span className="text-gray-400 text-sm">Quantum Shots</span></div><div className="text-3xl font-bold text-white">{optimizationResult.quantum_shots_used}</div></div>
          </div>
          {classicalDistance > 0 && displayDistance > 0 && (
            <div className={`mb-6 p-6 rounded-2xl border ${isImprovement ? 'bg-green-900/40 border-green-500/30' : 'bg-red-900/40 border-red-500/30'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-xl p-4"><div className="text-gray-400 text-xs mb-1">Classical</div><div className="text-red-400 font-bold text-2xl">{classicalDistance.toFixed(1) * 2} km</div></div>
                <div className="bg-black/30 rounded-xl p-4"><div className="text-gray-400 text-xs mb-1">Optimized</div><div className={`font-bold text-2xl ${isImprovement ? 'text-green-400' : 'text-red-400'}`}>{displayDistance.toFixed(1)} km</div></div>
                <div className="bg-black/30 rounded-xl p-4"><div className="text-gray-400 text-xs mb-1">Improvement</div><div className="text-purple-400 font-bold text-2xl">{isImprovement ? '↓' : '↑'} {Math.abs(quantumImprovement)}%</div></div>
              </div>
            </div>
          )}
          <div className="mb-6"><h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><BarChart3 size={24} className="text-indigo-400" />Vehicle Routes</h3>
            <div className="space-y-3">
              {routes.map((route, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: routeColors[index] }} /><span className="text-white font-semibold">Vehicle {index + 1}</span></div>
                    <div className="px-3 py-1 bg-white/10 rounded-full text-white text-sm">{route.stopCount || 0} stops</div>
                  </div>
                  <div className="text-white font-medium">{(route.distance || 0).toFixed(2)} km</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {optimizationResult.routes[index].map((pointIdx, i) => (
                      <React.Fragment key={i}>
                        <div className={`px-3 py-1 rounded-lg text-sm ${pointIdx === 0 ? 'bg-red-500/20 text-red-300' : 'bg-indigo-500/20 text-indigo-300'}`}>{pointIdx === 0 ? 'Depot' : `P${pointIdx}`}</div>
                        {i < optimizationResult.routes[index].length - 1 && <div className="text-gray-500">→</div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MultiRouting() {
  const [points, setPoints] = useState([]); 
  const [routes, setRoutes] = useState([]);
  const [isAddingPoints, setIsAddingPoints] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [numVehicles, setNumVehicles] = useState(2);
  const [depot, setDepot] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [classicalDistance, setClassicalDistance] = useState(0);
  const [trafficData, setTrafficData] = useState([]);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (isAddingPoints) {
          const newPoint = [e.latlng.lat, e.latlng.lng];
          if (!depot) { setDepot(newPoint); } 
          else { setPoints(prev => [...prev, { id: prev.length + 1, coords: newPoint, label: `Point ${prev.length + 1}` }]); }
        }
      },
    });
    return null;
  }

  function calculateDistance(point1, point2) {
    const [lat1, lon1] = point1; const [lat2, lon2] = point2; const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  async function fetchOptimizedRoutes() {
    if (!depot || points.length < 1) { alert("Please add a depot and at least one delivery point!"); return; }
    setIsLoading(true);
    try {
      const TOMTOM_API_KEY = "ELywRAU2paAyugBRkV2uaBSil76E1HD2";
      const allPoints = [depot, ...points.map(p => p.coords)];
      const distances = []; const traffic = [];
      let classicalDist = 0; const visited = new Set([0]); let current = 0;
      
      for (let i = 0; i < allPoints.length - 1; i++) {
        let nearest = -1; let minDist = Infinity;
        for (let j = 0; j < allPoints.length; j++) {
          if (!visited.has(j)) {
            const dist = calculateDistance(allPoints[current], allPoints[j]);
            if (dist < minDist) { minDist = dist; nearest = j; }
          }
        }
        if (nearest !== -1) { classicalDist += minDist; visited.add(nearest); current = nearest; }
      }
      classicalDist += calculateDistance(allPoints[current], allPoints[0]);
      setClassicalDistance(classicalDist);

      for (let i = 0; i < allPoints.length; i++) {
        for (let j = i + 1; j < allPoints.length; j++) {
          const [lat1, lon1] = allPoints[i]; const [lat2, lon2] = allPoints[j];
          const url = `https://api.tomtom.com/routing/1/calculateRoute/${lat1},${lon1}:${lat2},${lon2}/json?key=${TOMTOM_API_KEY}&traffic=true`;
          try {
            const res = await fetch(url); const routeData = await res.json();
            if (routeData.routes?.[0]?.summary) {
              const summary = routeData.routes[0].summary;
              const distKm = summary.lengthInMeters / 1000;
              const trafficDelayMin = summary.trafficDelayInSeconds ? summary.trafficDelayInSeconds / 60 : 0;
              distances.push([i, j, parseFloat(distKm.toFixed(3))]);
              traffic.push([i, j, parseFloat(Math.max(0, trafficDelayMin).toFixed(2))]);
            }
          } catch (error) { console.error(`Error ${i}→${j}:`, error); }
          await new Promise(r => setTimeout(r, 500));
        }
      }
      setTrafficData(traffic);

      const res = await fetch("https://quantum-optimizer.onrender.com/optimize", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num_locations: allPoints.length - 1, num_vehicles: numVehicles, distances, traffic })
      });
      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      const data = await res.json();
      setOptimizationResult(data);

      const routeColors = VEHICLE_COLORS.slice(0, numVehicles);
      const processedRoutes = [];
      
      for (let v = 0; v < data.routes.length; v++) {
        const vehicleRoute = data.routes[v]; const routePoints = [];
        for (let i = 0; i < vehicleRoute.length - 1; i++) {
          const startPoint = allPoints[vehicleRoute[i]]; const endPoint = allPoints[vehicleRoute[i + 1]];
          if (!startPoint || !endPoint) continue;
          const segUrl = `https://api.tomtom.com/routing/1/calculateRoute/${startPoint[0]},${startPoint[1]}:${endPoint[0]},${endPoint[1]}/json?key=${TOMTOM_API_KEY}&traffic=true`;
          try {
            const segRes = await fetch(segUrl); const segData = await segRes.json();
            if (segData.routes?.[0]?.legs?.[0]?.points) {
              routePoints.push(...segData.routes[0].legs[0].points.map(p => [p.latitude, p.longitude]));
            } else { routePoints.push(startPoint, endPoint); }
          } catch { routePoints.push(startPoint, endPoint); }
          await new Promise(r => setTimeout(r, 600));
        }
        processedRoutes.push({ points: routePoints, vehicleId: v, color: routeColors[v], distance: data.delivery_times[v] || 0, stopCount: vehicleRoute.length - 2 });
      }
      setRoutes(processedRoutes);
    } catch (error) { alert(`Error: ${error.message}`); } finally { setIsLoading(false); }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex overflow-hidden">
      <style>{`.marker-pin { width: 30px; height: 30px; border-radius: 50% 50% 50% 0; background: #4F46E5; position: absolute; transform: rotate(-45deg); left: 50%; top: 50%; margin: -15px 0 0 -15px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.5); } .marker-pin.depot { background: #DC2626; } .marker-pin span { color: white; font-weight: bold; font-size: 12px; transform: rotate(45deg); }`}</style>
      <div className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl relative z-10 flex flex-col border-r border-gray-700">
        <div className="h-full flex flex-col overflow-hidden">
          <div className="p-6 flex-shrink-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-b border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg"><Sparkles className="text-white" size={20} /></div>
              <div><h1 className="text-xl font-bold text-white">Quantum Router</h1><p className="text-xs text-gray-400">AI-Powered Optimization</p></div>
            </div>
            <div className="space-y-3">
              <label className="text-white font-semibold text-sm flex items-center gap-2"><Car size={16} className="text-indigo-400" />Fleet Size</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button key={num} onClick={() => setNumVehicles(num)} disabled={isLoading}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all ${numVehicles === num ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Car size={16} /><span className="text-xs mt-1 font-semibold">{num}</span>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setIsAddingPoints(!isAddingPoints)} disabled={isLoading}
              className={`w-full p-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all mt-4 shadow-lg ${isAddingPoints ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' : 'bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isAddingPoints ? <><X size={20} />Stop Adding</> : <><Plus size={20} />Add Locations</>}
            </button>
            {isAddingPoints && <div className="mt-3 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg"><p className="text-indigo-300 text-xs">{!depot ? 'Click map to set depot' : 'Click map to add delivery points'}</p></div>}
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {(depot || points.length > 0) && (
              <div className="space-y-4 mt-6">
                <h3 className="text-white font-semibold">Locations ({points.length + (depot ? 1 : 0)})</h3>
                <div className="space-y-2">
                  {depot && <div className="flex justify-between items-center p-3 bg-red-900/30 rounded-xl text-white border border-red-500/20"><span>Depot</span><button onClick={() => { setDepot(null); setPoints([]); setRoutes([]); setOptimizationResult(null); }} disabled={isLoading} className="text-red-400 hover:text-red-300 text-sm px-2 py-1 hover:bg-red-500/20 rounded">Reset</button></div>}
                  {points.map((point) => (
                    <div key={point.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-xl text-white"><span>{point.label}</span><button onClick={() => { setPoints(points.filter(p => p.id !== point.id)); setRoutes([]); setOptimizationResult(null); }} disabled={isLoading} className="text-red-400 hover:text-red-300 text-sm px-2 py-1 hover:bg-red-500/20 rounded">Remove</button></div>
                  ))}
                </div>
                <button onClick={fetchOptimizedRoutes} disabled={!depot || points.length < 1 || isLoading}
                  className={`w-full p-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg ${!depot || points.length < 1 || isLoading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'}`}>
                  {isLoading ? <><RotateCw className="animate-spin" size={20} />Optimizing...</> : <><Sparkles size={20} />Optimize Routes</>}
                </button>
              </div>
            )}
            {optimizationResult && !isLoading && (
              <div className="space-y-4 mt-6">
                <button onClick={() => setShowAnalytics(true)} className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold flex items-center justify-center gap-3">
                  <BarChart3 size={20} />View Analytics
                </button>
                <div className="space-y-3">
                  {routes.map((route, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-xl border border-gray-700 cursor-pointer hover:scale-[1.02] transition-all" onClick={() => setActiveRoute(activeRoute === index ? null : index)}>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} /><span className="text-white font-semibold">Vehicle {index + 1}</span></div>
                        {activeRoute === index && <div className="bg-white text-black text-xs px-3 py-1 rounded-full font-semibold">Active</div>}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-700/50 rounded-lg p-2"><div className="text-gray-400 text-xs">Stops</div><div className="text-white font-semibold">{route.stopCount || 0}</div></div>
                        <div className="bg-gray-700/50 rounded-lg p-2"><div className="text-gray-400 text-xs">Distance</div><div className="text-white font-semibold">{route.distance.toFixed(1)} km</div></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/20">
                  <div className="text-gray-400 text-sm mb-2">Total Distance</div>
                  <div className="text-white font-bold text-2xl">{optimizationResult.total_distance ? optimizationResult.total_distance.toFixed(2) : '0.00'} km</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 relative">
        <MapContainer center={[19.076, 72.8777]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler />
          {depot && <Marker position={depot} icon={createCustomIcon('D', true)} />}
          {points.map((point) => <Marker key={point.id} position={point.coords} icon={createCustomIcon(point.id)} />)}
          {routes.map((route, index) => (
            (activeRoute === null || activeRoute === index) && route.points.length > 0 && (
              <Polyline key={index} positions={route.points} color={route.color} weight={activeRoute === index ? 6 : 4} opacity={activeRoute === index ? 1 : 0.8} />
            )
          ))}
        </MapContainer>
      </div>
      {showAnalytics && <AnalyticsModal optimizationResult={optimizationResult} routes={routes} onClose={() => setShowAnalytics(false)} classicalDistance={classicalDistance} trafficData={trafficData} />}
    </div>
  );
}