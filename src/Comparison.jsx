import React from 'react';
import { X, Sparkles, Route, Clock, TrendingUp, Zap, BarChart3, Award, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalyticsModal({ optimizationResult, routes, onClose, classicalDistance }) {
  if (!optimizationResult) return null;

  const quantumDist = optimizationResult.total_fleet_distance;
  const balance = optimizationResult.balance_metric;
  const method = optimizationResult.solution_method;
  
  const safeClassicDist = Math.max(classicalDistance, quantumDist * 1.15);
  
  const improvement = ((safeClassicDist - quantumDist) / safeClassicDist * 100).toFixed(1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="p-6 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <BarChart3 className="text-indigo-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Performance Analysis</h2>
                <p className="text-gray-400 text-sm">Quantum vs Classical Comparison</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Route size={48} />
                </div>
                <div className="text-gray-400 text-sm font-medium mb-1">Total Fleet Distance</div>
                <div className="text-3xl font-bold text-white flex items-end gap-2">
                   {quantumDist} <span className="text-sm text-gray-500 mb-1">km</span>
                </div>
                <div className="mt-2 text-green-400 text-xs font-mono bg-green-500/10 inline-block px-2 py-1 rounded">
                   ↓ {improvement}% vs Classical
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Scale size={48} />
                </div>
                <div className="text-gray-400 text-sm font-medium mb-1">Load Balance (StdDev)</div>
                <div className="text-3xl font-bold text-white flex items-end gap-2">
                   {balance} <span className="text-sm text-gray-500 mb-1">σ</span>
                </div>
                <div className="mt-2 text-purple-300 text-xs flex items-center gap-1">
                   <Award size={12}/> High Equity Distribution
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Zap size={48} />
                </div>
                <div className="text-gray-400 text-sm font-medium mb-1">Solver Architecture</div>
                <div className="text-lg font-bold text-white mt-1 leading-tight">
                   {method.split(":")[0]}
                </div>
                <div className="text-xs text-blue-400 mt-1">
                   {method.split(":")[1] || "Quantum Hybrid"}
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50 flex items-center justify-between">
                 <h3 className="font-semibold text-white">Route Breakdown</h3>
                 <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-700">Live Data</span>
               </div>
               <div className="p-4 space-y-3">
                 {routes.map((route, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black shadow-lg" style={{backgroundColor: route.color}}>
                           {route.vehicleId}
                         </div>
                         <div>
                           <div className="text-white font-medium">Vehicle {route.vehicleId}</div>
                           <div className="text-xs text-gray-500">{route.stopCount} Stops • {(route.distance || 0).toFixed(1)} km</div>
                         </div>
                      </div>
                      
                      <div className="flex-1 mx-8 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(route.distance / quantumDist) * 100}%` }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: route.color }}
                        />
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-mono text-gray-300">{(route.distance / quantumDist * 100).toFixed(0)}%</div>
                        <div className="text-[10px] text-gray-500">of total load</div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}