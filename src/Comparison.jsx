import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function RouteComparisonCharts({ quantumRoute, classicalRoute }) {
  const calculateEfficiencyMetrics = () => {
    const metrics = {
      distanceEfficiency: Math.max(0, 100 - ((quantumRoute.distance / classicalRoute.distance) * 100)),
      timeEfficiency: Math.max(0, 100 - ((quantumRoute.duration / classicalRoute.duration) * 100)),
      speedEfficiency: Math.min(100, ((quantumRoute.distance / quantumRoute.duration) / (classicalRoute.distance / classicalRoute.duration)) * 100),
      complexityEfficiency: Math.max(0, 100 - ((quantumRoute.geometry.coordinates.length / classicalRoute.geometry.coordinates.length) * 100)),
      overallScore: (quantumRoute.quantumScore || 0.8) * 100
    };
    return metrics;
  };

  const metrics = calculateEfficiencyMetrics();

  const radarData = {
    labels: ['Distance Efficiency', 'Time Efficiency', 'Speed Optimization', 'Route Complexity', 'Overall Score'],
    datasets: [
      {
        label: 'Quantum Route Performance',
        data: [
          metrics.distanceEfficiency,
          metrics.timeEfficiency,
          metrics.speedEfficiency,
          metrics.complexityEfficiency,
          metrics.overallScore
        ],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
        pointHoverRadius: 8
      }
    ]
  };

  const barData = {
    labels: ['Distance (km)', 'Time (min)', 'Avg Speed (km/h)'],
    datasets: [
      {
        label: 'Quantum Route',
        data: [
          quantumRoute.distance / 1000,
          quantumRoute.duration / 60,
          (quantumRoute.distance / 1000) / (quantumRoute.duration / 3600)
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      },
      {
        label: 'Classical Route',
        data: [
          classicalRoute.distance / 1000,
          classicalRoute.duration / 60,
          (classicalRoute.distance / 1000) / (classicalRoute.duration / 3600)
        ],
        backgroundColor: 'rgba(148, 163, 184, 0.8)',
        borderColor: 'rgba(148, 163, 184, 1)',
        borderWidth: 1
      }
    ]
  };

  const generateElevationProfile = (route, routeType) => {
    const coordinates = route.geometry.coordinates;
    const points = [];
    
    for (let i = 0; i < Math.min(coordinates.length, 50); i++) {
      const progress = i / (coordinates.length - 1);
      const distance = progress * (route.distance / 1000);
      
      let elevation;
      if (routeType === 'quantum') {
        elevation = 50 + Math.sin(progress * Math.PI * 2) * 15 + Math.sin(progress * Math.PI * 6) * 8 + Math.random() * 5;
      } else {
        elevation = 45 + Math.sin(progress * Math.PI * 3) * 20 + Math.cos(progress * Math.PI * 4) * 10 + Math.random() * 8;
      }
      
      points.push({ x: distance, y: Math.max(0, elevation) });
    }
    
    return points;
  };

  const lineData = {
    datasets: [
      {
        label: 'Quantum Route Elevation',
        data: generateElevationProfile(quantumRoute, 'quantum'),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        label: 'Classical Route Elevation',
        data: generateElevationProfile(classicalRoute, 'classical'),
        borderColor: 'rgba(148, 163, 184, 1)',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(148, 163, 184, 0.2)'
        },
        pointLabels: {
          color: '#e5e7eb',
          font: {
            size: 11
          }
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.6)',
          backdropColor: 'rgba(0, 0, 0, 0)',
          font: {
            size: 10
          }
        },
        angleLines: {
          color: 'rgba(148, 163, 184, 0.2)'
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#e5e7eb',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#e5e7eb',
          font: {
            size: 11
          }
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        callbacks: {
          title: (context) => `Distance: ${context[0].parsed.x.toFixed(1)} km`,
          label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}m elevation`
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Distance (km)',
          color: '#e5e7eb',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#e5e7eb',
          font: {
            size: 11
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Elevation (m)',
          color: '#e5e7eb',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        },
        ticks: {
          color: '#e5e7eb',
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
        <h4 className="text-gray-100 font-semibold mb-4 text-lg">Route Performance Analysis</h4>
        <div className="aspect-square">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
        <h4 className="text-gray-100 font-semibold mb-4 text-lg">Route Metrics Comparison</h4>
        <div className="h-80">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
      
      <div className="md:col-span-2 bg-gray-900 p-6 rounded-xl border border-gray-700">
        <h4 className="text-gray-100 font-semibold mb-4 text-lg">Elevation Profile Comparison</h4>
        <div className="h-80">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}