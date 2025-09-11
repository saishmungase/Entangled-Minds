// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from 'leaflet';
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// import { 
//   Navigation, 
//   MapPin, 
//   Route, 
//   Clock, 
//   Zap, 
//   Car, 
//   User, 
//   Bike, 
//   X, 
//   BarChart3,
//   TrendingUp,
//   TrendingDown,
//   Target,
//   Play
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { simulateQuantumOptimization } from "./optimzing-route";
// import { RouteComparisonCharts } from "./Comparison";

// let DefaultIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow,
//     iconSize: [25, 41],
//     iconAnchor: [12, 41]
// });

// const startIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow,
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     className: 'start-icon'
// });

// const endIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow,
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     className: 'end-icon'
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// export default function Routing() {
//   const [startPoint, setStartPoint] = useState(null);
//   const [endPoint, setEndPoint] = useState(null);
//   const [selectingPoint, setSelectingPoint] = useState(null);
//   const [routes, setRoutes] = useState([]);
//   const [activeRoute, setActiveRoute] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedMode, setSelectedMode] = useState('driving');
//   const [showComparison, setShowComparison] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   function MapClickHandler() {
//     useMapEvents({
//       click(e) {
//         const newPoint = [e.latlng.lat, e.latlng.lng];
//         if (selectingPoint === 'start') {
//           setStartPoint(newPoint);
//           setSelectingPoint(null);
//           setRoutes([]);
//         } else if (selectingPoint === 'end') {
//           setEndPoint(newPoint);
//           setSelectingPoint(null);
//           setRoutes([]);
//         }
//       },
//     });
//     return null;
//   }

//   async function fetchRoutes() {
//   if (startPoint && endPoint) {
//     setIsLoading(true);
//     const routes = [];

//     try {
//       const startCoord = `${startPoint[1]},${startPoint[0]}`;
//       const endCoord = `${endPoint[1]},${endPoint[0]}`;

//       const url = `https://router.project-osrm.org/route/v1/${selectedMode}/${startCoord};${endCoord}?alternatives=3&overview=full&geometries=geojson`;
//       const response = await fetch(url);
//       const data = await response.json();
      
//       if (data.routes) {
//         const optimizedRoutes = simulateQuantumOptimization(data.routes);
        
//         optimizedRoutes.forEach((route, index) => {
//           routes.push({
//             ...route,
//             type: selectedMode,
//             color: index === 0 ? '#6366f1' : '#94a3b8', 
//             routeNumber: index + 1,
//             isQuantum: index === 0,
//             isClassical: index !== 0,
//             label: index === 0 ? 'Quantum' : 'Classical',
//             quantumScore: route.quantumScore
//           });
//         });
//       }

//       setRoutes(routes);
//       setActiveRoute(0);
//     } catch (error) {
//       console.error("Error fetching routes:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }
// }

//   const formatDuration = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
//   };

//   const getModeIcon = (mode) => {
//     switch (mode) {
//       case 'driving': return <Car size={20} />;
//       case 'walking': return <User size={20} />;
//       case 'cycling': return <Bike size={20} />;
//       default: return <Car size={20} />;
//     }
//   };

//   const getQuantumRoute = () => routes.find(r => r.isQuantum);
//   const getClassicalRoute = () => routes.find(r => r.isClassical && !r.isQuantum);

//   const ComparisonModal = () => {
//     const quantumRoute = getQuantumRoute();
//     const classicalRoute = getClassicalRoute();

//     if (!quantumRoute || !classicalRoute || routes.length === 1) return null;

//     const timeDiff = classicalRoute.duration - quantumRoute.duration;
//     const distDiff = classicalRoute.distance - quantumRoute.distance;
//     const timeSavings = ((timeDiff / classicalRoute.duration) * 100);
//     const distSavings = ((distDiff / classicalRoute.distance) * 100);

//     const quantumSpeedup = Math.abs(timeSavings); 
//     const coherenceScore = quantumRoute.quantumScore * 100; 
//     const complexityReduction = (
//       (classicalRoute.geometry.coordinates.length - quantumRoute.geometry.coordinates.length) /
//       classicalRoute.geometry.coordinates.length * 100
//     );
//     const superpositionStates = Math.floor(Math.log2(routes.length)); 

//     return (
//       <AnimatePresence>
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           style={{ zIndex: 9999 }}
//           className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-md flex items-center justify-center p-4"
//           onClick={() => setShowComparison(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             className="bg-gray-900 border border-indigo-500/20 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-black/50 p-6 relative border-b border-indigo-500/20">
//               <button
//                 onClick={() => setShowComparison(false)}
//                 className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
//               >
//                 <X size={20} className="text-gray-400" />
//               </button>
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-indigo-500/20 rounded-xl">
//                   <Zap size={28} className="text-indigo-400" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">Quantum Route Analysis</h2>
//                   <p className="text-indigo-400">
//                     Quantum-Classical Route Optimization Comparison
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-gray-900">
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-white mb-4">
//                   Quantum Optimization Parameters
//                 </h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="bg-black/30 p-4 rounded-xl border border-indigo-500/20">
//                     <div className="text-indigo-400 text-sm mb-1">Quantum Coherence</div>
//                     <div className="text-2xl font-bold text-white">{coherenceScore.toFixed(1)}%</div>
//                     <div className="text-xs text-gray-400 mt-1">Route stability score</div>
//                   </div>
//                   <div className="bg-black/30 p-4 rounded-xl border border-indigo-500/20">
//                     <div className="text-indigo-400 text-sm mb-1">Superposition States</div>
//                     <div className="text-2xl font-bold text-white">{superpositionStates}</div>
//                     <div className="text-xs text-gray-400 mt-1">Quantum bits utilized</div>
//                   </div>
//                   <div className="bg-black/30 p-4 rounded-xl border border-indigo-500/20">
//                     <div className="text-indigo-400 text-sm mb-1">Complexity Reduction</div>
//                     <div className="text-2xl font-bold text-white">
//                       {complexityReduction.toFixed(1)}%
//                     </div>
//                     <div className="text-xs text-gray-400 mt-1">Route optimization gain</div>
//                   </div>
//                   <div className="bg-black/30 p-4 rounded-xl border border-indigo-500/20">
//                     <div className="text-indigo-400 text-sm mb-1">Quantum Speedup</div>
//                     <div className="text-2xl font-bold text-white">{quantumSpeedup.toFixed(1)}%</div>
//                     <div className="text-xs text-gray-400 mt-1">Performance improvement</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6 mb-8">
//                 <motion.div
//                   initial={{ x: -20, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   className="bg-black/30 p-6 rounded-xl border border-indigo-500/20"
//                 >
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-indigo-500/20 rounded-lg">
//                       <Zap className="text-indigo-400" size={24} />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-semibold text-white">Quantum-Optimized Route</h3>
//                       <p className="text-indigo-400 text-sm">Using quantum superposition</p>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
//                       <span className="text-gray-400">Total Distance</span>
//                       <span className="font-semibold text-white">
//                         {(quantumRoute.distance / 1000).toFixed(2)} km
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
//                       <span className="text-gray-400">Route Duration</span>
//                       <span className="font-semibold text-white">
//                         {formatDuration(quantumRoute.duration)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
//                       <span className="text-gray-400">Quantum Score</span>
//                       <span className="font-semibold text-indigo-400">
//                         {(quantumRoute.quantumScore * 100).toFixed(1)}%
//                       </span>
//                     </div>
//                     <div className="text-xs text-indigo-400 mt-2">
//                       Optimized using quantum superposition and entanglement principles
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ x: 20, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   className="bg-black/30 p-6 rounded-xl border border-gray-500/20"
//                 >
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-gray-500/20 rounded-lg">
//                       <Route className="text-gray-400" size={24} />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-semibold text-white">Classical Route</h3>
//                       <p className="text-gray-400 text-sm">Traditional pathfinding</p>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
//                       <span className="text-gray-400">Total Distance</span>
//                       <span className="font-semibold text-white">
//                         {(classicalRoute.distance / 1000).toFixed(2)} km
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
//                       <span className="text-gray-400">Route Duration</span>
//                       <span className="font-semibold text-white">
//                         {formatDuration(classicalRoute.duration)}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
//                       <span className="text-gray-400">Avg Speed</span>
//                       <span className="font-semibold text-white">
//                         {((classicalRoute.distance / 1000) / (classicalRoute.duration / 3600)).toFixed(1)} km/h
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-400 mt-2">
//                       Standard routing using classical algorithms and real-time traffic
//                     </div>
//                   </div>
//                 </motion.div>
//               </div>

//               <motion.div
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 className="bg-black/30 p-6 rounded-xl border border-indigo-500/20 mb-8"
//               >
//                 <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
//                   <TrendingUp size={20} className="text-indigo-400" />
//                   Performance Analysis
//                 </h3>
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="text-center">
//                     <div className="text-3xl font-bold mb-2 text-white flex items-center justify-center gap-2">
//                       {timeSavings > 0 ? <TrendingDown size={24} className="text-green-400" /> : <TrendingUp size={24} className="text-red-400" />}
//                       {timeSavings > 0 ? '-' : '+'}{Math.abs(timeSavings).toFixed(1)}%
//                     </div>
//                     <div className="text-gray-400 font-medium">Time Difference</div>
//                     <div className="text-sm text-gray-400 mt-1">
//                       {timeSavings > 0 ? 'Faster' : 'Slower'} by {Math.abs(Math.round(timeDiff / 60))} minutes
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-3xl font-bold mb-2 text-white flex items-center justify-center gap-2">
//                       {distSavings > 0 ? <TrendingDown size={24} className="text-green-400" /> : <TrendingUp size={24} className="text-red-400" />}
//                       {distSavings > 0 ? '-' : '+'}{Math.abs(distSavings).toFixed(1)}%
//                     </div>
//                     <div className="text-gray-400 font-medium">Distance Difference</div>
//                     <div className="text-sm text-gray-400 mt-1">
//                       {distSavings > 0 ? 'Shorter' : 'Longer'} by {Math.abs(distDiff / 1000).toFixed(2)} km
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               <div className="mt-8">
//                 <RouteComparisonCharts
//                   quantumRoute={quantumRoute} 
//                   classicalRoute={classicalRoute} 
//                 />
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </AnimatePresence>
//     );
//   };

//   return (
//     <div className="h-screen bg-black flex overflow-hidden">
//       <motion.div
//         initial={{ x: -300 }}
//         animate={{ x: sidebarCollapsed ? -340 : 0 }}
//         className="w-80 bg-gray-900 shadow-2xl relative z-10 flex flex-col border-r border-gray-700"
//       >
//         <div className="p-6 border-b border-gray-700">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
//                 <Zap className="text-black" size={20} />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-white">Entangle Minds </h1>
//                 <p className="text-sm text-gray-400">Quantum Computing based Navigation</p>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <label className="text-sm font-medium text-white">Travel Mode</label>
//             <div className="grid grid-cols-3 gap-2">
//               {[
//                 { value: 'driving', icon: <Car size={16} />, label: 'Drive' },
//                 { value: 'walking', icon: <User size={16} />, label: 'Walk' },
//                 { value: 'cycling', icon: <Bike size={16} />, label: 'Bike' }
//               ].map((mode) => (
//                 <button
//                   key={mode.value}
//                   onClick={() => {
//                     setSelectedMode(mode.value);
//                     setRoutes([]);
//                     setActiveRoute(null);
//                   }}
//                   className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
//                     selectedMode === mode.value
//                       ? 'border-white bg-gray-800 text-white'
//                       : 'border-gray-600 text-gray-400 hover:border-gray-500'
//                   }`}
//                 >
//                   {mode.icon}
//                   <span className="text-xs font-medium">{mode.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="p-6 space-y-4 flex-1 overflow-y-auto">
//           <div className="space-y-3">
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setSelectingPoint('start')}
//               className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
//                 selectingPoint === 'start'
//                   ? 'border-white bg-gray-800'
//                   : startPoint
//                     ? 'border-gray-500 bg-gray-800'
//                     : 'border-gray-600 hover:border-gray-500'
//               }`}
//             >
//               <MapPin className={`${selectingPoint === 'start' ? 'text-white' : startPoint ? 'text-white' : 'text-gray-400'}`} size={20} />
//               <div className="text-left">
//                 <div className="font-medium text-white">
//                   {startPoint ? "Start Point Set" : "Set Start Point"}
//                 </div>
//                 <div className="text-sm text-gray-400">
//                   {selectingPoint === 'start' ? 'Click on map' : 'Tap to select'}
//                 </div>
//               </div>
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setSelectingPoint('end')}
//               className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
//                 selectingPoint === 'end'
//                   ? 'border-white bg-gray-800'
//                   : endPoint
//                     ? 'border-gray-500 bg-gray-800'
//                     : 'border-gray-600 hover:border-gray-500'
//               }`}
//             >
//               <Target className={`${selectingPoint === 'end' ? 'text-white' : endPoint ? 'text-white' : 'text-gray-400'}`} size={20} />
//               <div className="text-left">
//                 <div className="font-medium text-white">
//                   {endPoint ? "End Point Set" : "Set End Point"}
//                 </div>
//                 <div className="text-sm text-gray-400">
//                   {selectingPoint === 'end' ? 'Click on map' : 'Tap to select'}
//                 </div>
//               </div>
//             </motion.button>
//           </div>

//           <motion.button
//             whileHover={{ scale: !startPoint || !endPoint || isLoading ? 1 : 1.02 }}
//             whileTap={{ scale: !startPoint || !endPoint || isLoading ? 1 : 0.98 }}
//             onClick={fetchRoutes}
//             disabled={!startPoint || !endPoint || isLoading}
//             className={`w-full p-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
//               !startPoint || !endPoint || isLoading
//                 ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
//                 : 'bg-white text-black hover:shadow-lg'
//             }`}
//           >
//             {isLoading ? (
//               <>
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 >
//                   <Navigation size={20} />
//                 </motion.div>
//                 Analyzing Routes...
//               </>
//             ) : (
//               <>
//                 <Play size={20} />
//                 Find Routes
//               </>
//             )}
//           </motion.button>

//           {routes.length > 1 && (
//             <motion.button
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setShowComparison(true)}
//               className="w-full p-4 bg-gray-800 text-white rounded-xl font-semibold flex items-center justify-center gap-3 hover:shadow-lg transition-all border border-gray-600"
//             >
//               <BarChart3 size={20} />
//               Compare Routes
//             </motion.button>
//           )}

//           {routes.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-3"
//             >
//               <h3 className="font-semibold text-white flex items-center gap-2">
//                 <Route size={18} />
//                 Available Routes
//               </h3>
//               <div className="space-y-2">
//                 {routes.map((route, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     onClick={() => setActiveRoute(index)}
//                     className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
//                       activeRoute === index
//                         ? 'border-white bg-gray-800'
//                         : 'border-gray-600 hover:border-gray-500'
//                     }`}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center gap-2">
//                         {getModeIcon(route.type)}
//                         <span className="font-medium text-white">
//                           Route {index + 1}
//                         </span>
//                       </div>
//                       <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-black">
//                         {route.label}
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3 text-sm">
//                       <div>
//                         <div className="text-gray-400">Distance</div>
//                         <div className="font-semibold text-white">{(route.distance / 1000).toFixed(1)} km</div>
//                       </div>
//                       <div>
//                         <div className="text-gray-400">Time</div>
//                         <div className="font-semibold text-white">{formatDuration(route.duration)}</div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {activeRoute !== null && routes[activeRoute] && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="p-4 bg-gray-800 rounded-xl border border-gray-600"
//             >
//               <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
//                 <Clock size={16} />
//                 Route Details
//               </h4>
//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Total Distance</span>
//                   <span className="font-semibold text-white">{(routes[activeRoute].distance / 1000).toFixed(2)} km</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Estimated Time</span>
//                   <span className="font-semibold text-white">{formatDuration(routes[activeRoute].duration)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Average Speed</span>
//                   <span className="font-semibold text-white">
//                     {((routes[activeRoute].distance / 1000) / (routes[activeRoute].duration / 3600)).toFixed(1)} km/h
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Route Type</span>
//                   <span className="font-semibold text-white">
//                     {routes[activeRoute].label}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Optimization Score</span>
//                   <span className="font-semibold text-white">
//                     {(routes[activeRoute].quantumScore * 100).toFixed(1)}%
//                   </span>
//                 </div>
//                 {routes[activeRoute].isQuantum && (
//                   <div className="mt-3 text-xs text-gray-400">
//                     This quantum-optimized route considers multiple factors including distance, 
//                     time, and route complexity using quantum-inspired algorithms.
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>

//       <button
//         onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//         className="absolute top-4 right-4 z-20 p-3 bg-gray-900 border border-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-all"
//       >
//         <Navigation size={20} className="text-white" />
//       </button>

//       <div className="flex-1 relative" style={{ zIndex: 1 }}>
//         <MapContainer 
//           center={[19.076, 72.8777]} 
//           zoom={12} 
//           style={{ height: "100%", width: "100%", zIndex: 1 }}
//           zoomControl={false}
//         >
//           <TileLayer 
//             attribution='&copy; OpenStreetMap contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
//           />
//           <MapClickHandler />

//           {startPoint && <Marker position={startPoint} icon={startIcon} />}
//           {endPoint && <Marker position={endPoint} icon={endIcon} />}

//           {activeRoute !== null && routes[activeRoute] && (
//             <Polyline
//               positions={routes[activeRoute].geometry.coordinates.map(([lng, lat]) => [lat, lng])}
//               color={routes[activeRoute].color}
//               weight={5}
//               opacity={0.8}
//             />
//           )}
//         </MapContainer>
//       </div>
//       {showComparison && <ComparisonModal />}
//     </div>
//   );
// }
























































import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { Car, Plus, RotateCw, X } from 'lucide-react';

// Custom marker styles
const createCustomIcon = (number, isDepot = false) => L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div class='marker-pin ${isDepot ? 'depot' : ''}'>
      <span>${isDepot ? 'D' : number}</span>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Vehicle colors for different routes
const VEHICLE_COLORS = [
  '#FF6B6B',  // Coral Red
  '#4ECDC4',  // Turquoise
  '#45B7D1',  // Sky Blue
  '#96CEB4',  // Sage Green
  '#FFEEAD',  // Soft Yellow
  '#9B59B6',  // Purple
  '#3498DB',  // Blue
  '#E74C3C',  // Red
  '#2ECC71',  // Green
  '#F1C40F'   // Yellow
];

export default function MultiRouting() {
  const [points, setPoints] = useState([]); 
  const [routes, setRoutes] = useState([]);
  const [isAddingPoints, setIsAddingPoints] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [numVehicles, setNumVehicles] = useState(2);
  const [depot, setDepot] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (isAddingPoints) {
          const newPoint = [e.latlng.lat, e.latlng.lng];
          if (!depot) {
            setDepot(newPoint);
          } else {
            setPoints(prev => [...prev, { 
              id: prev.length + 1,
              coords: newPoint,
              label: `Point ${prev.length + 1}`
            }]);
          }
        }
      },
    });
    return null;
  }

  // Helper function to get route path between two points
  async function getRouteBetweenPoints(startPoint, endPoint) {
    const startCoord = `${startPoint[1]},${startPoint[0]}`;
    const endCoord = `${endPoint[1]},${endPoint[0]}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${startCoord};${endCoord}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes[0]) {
      return {
        coordinates: data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        distance: data.routes[0].distance / 1000, // Convert to km
        duration: data.routes[0].duration
      };
    }
    return null;
  }

  function calculateDistance(point1, point2) {
    const [lat1, lon1] = point1;
    const [lat2, lon2] = point2;
    const R = 6371; // Earth's radius in km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Enhanced route optimization algorithm to ensure unique paths
  function optimizeRoutesWithUniqueAssignment(depot, points, numVehicles) {
    const actualVehicles = Math.min(numVehicles, points.length);
    let unassignedPoints = [...points];
    let totalDistance = 0;

    // Initialize routes for each vehicle starting from depot
    const routes = Array(actualVehicles).fill(null).map((_, index) => ({
      path: [0], // Start with depot (index 0)
      points: [depot],
      distance: 0,
      vehicleId: index
    }));

    // Create distance matrix for all points (including depot)
    const allPoints = [depot, ...points.map(p => p.coords)];
    const distanceMatrix = {};
    
    for (let i = 0; i < allPoints.length; i++) {
      distanceMatrix[i] = {};
      for (let j = 0; j < allPoints.length; j++) {
        if (i !== j) {
          distanceMatrix[i][j] = calculateDistance(allPoints[i], allPoints[j]);
        }
      }
    }

    // Assign points using a balanced approach to avoid route overlap
    while (unassignedPoints.length > 0) {
      // Find the vehicle with the shortest current route for balancing
      const shortestRoute = routes.reduce((min, route) => 
        route.distance < min.distance ? route : min
      );

      const currentPoint = shortestRoute.points[shortestRoute.points.length - 1];
      
      // Find the nearest unassigned point to current position
      let nearestPoint = null;
      let nearestIndex = -1;
      let minDistance = Infinity;

      unassignedPoints.forEach((point, index) => {
        const distance = calculateDistance(currentPoint, point.coords);
        if (distance < minDistance) {
          minDistance = distance;
          nearestPoint = point;
          nearestIndex = index;
        }
      });

      if (nearestPoint) {
        // Add point to the shortest route
        shortestRoute.path.push(nearestPoint.id);
        shortestRoute.points.push(nearestPoint.coords);
        shortestRoute.distance += minDistance;

        // Remove assigned point from unassigned list
        unassignedPoints.splice(nearestIndex, 1);
      }
    }

    // Add return to depot for each route and calculate final distances
    routes.forEach(route => {
      if (route.points.length > 1) { // Only add return if route has actual points
        const lastPoint = route.points[route.points.length - 1];
        const distanceToDepot = calculateDistance(lastPoint, depot);
        route.path.push(0); // Return to depot
        route.points.push(depot);
        route.distance += distanceToDepot;
        totalDistance += route.distance;
      }
    });

    // Filter out empty routes
    const validRoutes = routes.filter(route => route.path.length > 2);

    return {
      routes: validRoutes.map(r => r.path),
      distances: validRoutes.map(r => r.distance),
      total_distance: totalDistance,
      solution_method: "Balanced Nearest Neighbor with Unique Assignment",
      execution_time: 0,
      is_quantum_solution: false,
      notes: "Routes optimized to ensure unique paths for each vehicle"
    };
  }

  // Generate dynamic colors if needed
  function generateDynamicColors(numColors) {
    const baseColors = [...VEHICLE_COLORS];
    
    if (numColors <= baseColors.length) {
      return baseColors.slice(0, numColors);
    }

    // Generate additional colors if needed
    while (baseColors.length < numColors) {
      const hue = (baseColors.length * 137.508) % 360; // Golden angle approximation
      const saturation = 70;
      const lightness = 60;
      baseColors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return baseColors;
  }

  async function fetchOptimizedRoutes() {
    if (!depot || points.length < 1) return;
    
    setIsLoading(true);
    try {
      const result = optimizeRoutesWithUniqueAssignment(depot, points, numVehicles);
      setOptimizationResult(result);

      // Get colors based on number of vehicles
      const routeColors = generateDynamicColors(numVehicles);
      const processedRoutes = [];
      
      for (let vehicleIndex = 0; vehicleIndex < result.routes.length; vehicleIndex++) {
        const vehicleRoute = result.routes[vehicleIndex];
        const routePoints = [];
        let totalDistance = 0;
        
        for (let i = 0; i < vehicleRoute.length - 1; i++) {
          const startPointIndex = vehicleRoute[i];
          const endPointIndex = vehicleRoute[i + 1];
          
          const startPoint = startPointIndex === 0 ? depot : points[startPointIndex - 1].coords;
          const endPoint = endPointIndex === 0 ? depot : points[endPointIndex - 1].coords;
          
          const routeSegment = await getRouteBetweenPoints(startPoint, endPoint);
          if (routeSegment) {
            routePoints.push(...routeSegment.coordinates);
            totalDistance += routeSegment.distance;
          }
          
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        processedRoutes.push({
          points: routePoints,
          vehicleId: vehicleIndex,
          color: routeColors[vehicleIndex],
          distance: totalDistance,
          stopCount: vehicleRoute.length - 2 // Exclude depot start and end
        });
      }

      setRoutes(processedRoutes);
    } catch (error) {
      console.error("Error calculating routes:", error);
      alert("Error calculating routes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      {/* Sidebar with Custom Scrollbar */}
      <div className="w-80 bg-gray-900 shadow-2xl relative z-10 flex flex-col border-r border-gray-700">
        <style jsx>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #4B5563 #1F2937;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1F2937;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4B5563;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #6B7280;
          }
          .marker-pin {
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            background: #4F46E5;
            position: absolute;
            transform: rotate(-45deg);
            left: 50%;
            top: 50%;
            margin: -15px 0 0 -15px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .marker-pin.depot {
            background: #DC2626;
          }
          .marker-pin span {
            color: white;
            font-weight: bold;
            font-size: 12px;
            transform: rotate(45deg);
          }
        `}</style>

        <div className="h-full flex flex-col overflow-hidden">
          <div className="p-6 flex-shrink-0">
            {/* Vehicle Selection */}
            <div className="space-y-2">
              <label className="text-white font-semibold">Number of Vehicles</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumVehicles(num)}
                    className={`p-3 rounded-lg flex-1 ${
                      numVehicles === num 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    <Car size={16} className="mx-auto" />
                    <span className="text-xs mt-1 block">{num}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Points Button */}
            <button
              onClick={() => setIsAddingPoints(!isAddingPoints)}
              className={`w-full p-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all mt-4 ${
                isAddingPoints 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {isAddingPoints ? (
                <><X size={20} />Stop Adding</>
              ) : (
                <><Plus size={20} />Add Points</>
              )}
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
            {/* Points List */}
            {(depot || points.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold sticky top-0 bg-gray-900 py-2 z-10">
                  Locations ({points.length + (depot ? 1 : 0)})
                </h3>
                <div className="space-y-2">
                  {depot && (
                    <div className="flex justify-between items-center p-3 bg-indigo-900/50 rounded-lg text-white">
                      <span>🏭 Depot</span>
                      <button
                        onClick={() => {
                          setDepot(null);
                          setPoints([]);
                          setRoutes([]);
                          setOptimizationResult(null);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                  {points.map((point) => (
                    <div
                      key={point.id}
                      className="flex justify-between items-center p-3 bg-gray-800 rounded-lg text-white"
                    >
                      <span>📍 {point.label}</span>
                      <button
                        onClick={() => {
                          setPoints(points.filter(p => p.id !== point.id));
                          setRoutes([]);
                          setOptimizationResult(null);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Optimize Button */}
                <button
                  onClick={fetchOptimizedRoutes}
                  disabled={!depot || points.length < 1 || isLoading}
                  className={`w-full p-4 rounded-xl font-semibold flex items-center justify-center gap-3 ${
                    !depot || points.length < 1 || isLoading
                      ? 'bg-gray-700 text-gray-500'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {isLoading ? (
                    <><RotateCw className="animate-spin" size={20} />Optimizing...</>
                  ) : (
                    'Optimize Routes'
                  )}
                </button>
              </div>
            )}

            {/* Results Display */}
            {optimizationResult && (
              <div className="space-y-4 mt-6">
                <h3 className="text-white font-semibold sticky top-0 bg-gray-900 py-2 z-10">
                  Route Summary
                </h3>
                <div className="space-y-3">
                  {routes.map((route, index) => (
                    <div
                      key={index}
                      className={`bg-gray-800 p-4 rounded-xl border-l-4 cursor-pointer transition-all ${
                        activeRoute === index ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ borderColor: route.color }}
                      onClick={() => setActiveRoute(activeRoute === index ? null : index)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-white font-medium">🚛 Vehicle {index + 1}</div>
                        {activeRoute === index && (
                          <div className="bg-white text-black text-xs px-2 py-1 rounded-full">
                            Active
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between text-sm">
                        <div className="text-gray-400">
                          Stops: {route.stopCount || 0}
                        </div>
                        <div className="text-gray-400">
                          {route.distance.toFixed(2)} km
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setActiveRoute(null)}
                    className="w-full p-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-all"
                  >
                    Show All Routes
                  </button>

                  <div className="bg-gray-800 p-4 rounded-xl">
                    <div className="text-gray-400 text-sm">Total Distance</div>
                    <div className="text-white font-medium text-lg">
                      {optimizationResult.total_distance.toFixed(2)} km
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {optimizationResult.notes}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map section */}
      <div className="flex-1 relative">
        <MapContainer 
          center={[19.076, 72.8777]} 
          zoom={12} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler />

          {/* Render Depot */}
          {depot && (
            <Marker
              position={depot}
              icon={createCustomIcon('D', true)}
            />
          )}

          {/* Render Points */}
          {points.map((point) => (
            <Marker
              key={point.id}
              position={point.coords}
              icon={createCustomIcon(point.id)}
            />
          ))}

          {/* Render Routes */}
          {routes.map((route, index) => (
            (activeRoute === null || activeRoute === index) && (
              <Polyline
                key={`route-${index}`}
                positions={route.points}
                color={route.color}
                weight={activeRoute === index ? 6 : 4}
                opacity={activeRoute === index ? 1 : 0.8}
                dashArray={activeRoute === index ? '0' : '10, 10'}
              />
            )
          ))}
        </MapContainer>
      </div>
    </div>
  );
}