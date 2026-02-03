/**
 * GRACE-X Investor Pack - Chart.js Implementation
 * Module valuation, revenue growth, valuation multiples
 */
(function() {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.color = '#94a3b8';
  Chart.defaults.borderColor = 'rgba(100, 116, 139, 0.2)';
  Chart.defaults.font.family = "'Segoe UI', sans-serif";

  var chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e2e8f0', font: { size: 13, weight: 600 } } },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#06b6d4',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(6, 182, 212, 0.5)',
        borderWidth: 1,
        padding: 12
      }
    }
  };

  var el1 = document.getElementById('moduleValuationChart');
  if (el1) {
    new Chart(el1.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Production', 'Call Sheets', 'Safety', 'Camera', 'Locations'],
        datasets: [
          { label: 'Min Valuation (£K)', data: [180, 180, 144, 108, 108], backgroundColor: 'rgba(6, 182, 212, 0.6)', borderColor: 'rgba(6, 182, 212, 1)', borderWidth: 2 },
          { label: 'Max Valuation (£K)', data: [1400, 1400, 1000, 720, 720], backgroundColor: 'rgba(16, 185, 129, 0.6)', borderColor: 'rgba(16, 185, 129, 1)', borderWidth: 2 }
        ]
      },
      options: Object.assign({}, chartOpts, {
        indexAxis: 'y',
        scales: {
          x: { grid: { color: 'rgba(100, 116, 139, 0.1)' }, ticks: { color: '#94a3b8', callback: function(v) { return '£' + v + 'K'; } } },
          y: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { size: 13, weight: 600 } } }
        }
      })
    });
  }

  var el2 = document.getElementById('revenueGrowthChart');
  if (el2) {
    new Chart(el2.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Now', '6 Months', '12 Months', '18 Months', '24 Months'],
        datasets: [
          { label: 'Conservative (70% prob)', data: [0, 400, 2500, 8000, 15000], borderColor: 'rgba(6, 182, 212, 1)', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderWidth: 3, tension: 0.4, fill: true },
          { label: 'Moderate (20% prob)', data: [0, 2500, 10000, 25000, 40000], borderColor: 'rgba(16, 185, 129, 1)', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderWidth: 3, tension: 0.4, fill: true },
          { label: 'Optimistic (10% prob)', data: [0, 10000, 40000, 100000, 200000], borderColor: 'rgba(245, 158, 11, 1)', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 3, tension: 0.4, fill: true }
        ]
      },
      options: Object.assign({}, chartOpts, {
        scales: {
          x: { grid: { color: 'rgba(100, 116, 139, 0.1)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(100, 116, 139, 0.1)' }, ticks: { color: '#94a3b8', callback: function(v) { return '£' + (v / 1000).toFixed(0) + 'K'; } } }
        }
      })
    });
  }

  var el3 = document.getElementById('valuationMultiplesChart');
  if (el3) {
    new Chart(el3.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Pre-Revenue', '£24K ARR', '£120K ARR', '£240K ARR', '£600K+ ARR'],
        datasets: [
          { label: 'Min Valuation', data: [5, 72, 600, 1440, 4800], backgroundColor: 'rgba(6, 182, 212, 0.6)', borderColor: 'rgba(6, 182, 212, 1)', borderWidth: 2 },
          { label: 'Max Valuation', data: [15, 144, 960, 2400, 7200], backgroundColor: 'rgba(16, 185, 129, 0.6)', borderColor: 'rgba(16, 185, 129, 1)', borderWidth: 2 }
        ]
      },
      options: Object.assign({}, chartOpts, {
        scales: {
          x: { grid: { display: false }, ticks: { color: '#e2e8f0', font: { size: 12, weight: 500 } } },
          y: { grid: { color: 'rgba(100, 116, 139, 0.1)' }, ticks: { color: '#94a3b8', callback: function(v) { return '£' + (v / 1000).toFixed(0) + 'M'; } } }
        }
      })
    });
  }
})();
