
export const simulateQuantumOptimization = (routes) => {
  if (!routes || routes.length === 0) return [];
  
  const factors = {
    distance: 0.4,   
    duration: 0.3,    
    complexity: 0.3   
  };

  const routesWithScores = routes.map(route => {
    const distance = route.distance;
    const duration = route.duration;
    const complexity = route.geometry.coordinates.length; 

    const score = (
      (1 - (distance / Math.max(...routes.map(r => r.distance)))) * factors.distance +
      (1 - (duration / Math.max(...routes.map(r => r.duration)))) * factors.duration +
      (1 - (complexity / Math.max(...routes.map(r => r.geometry.coordinates.length)))) * factors.complexity
    );

    return {
      ...route,
      quantumScore: score
    };
  });

  return routesWithScores.sort((a, b) => b.quantumScore - a.quantumScore);
};