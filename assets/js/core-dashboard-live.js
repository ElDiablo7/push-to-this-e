// ============================================
// GRACE-X CORE DASHBOARD - LIVE DATA SYSTEM
// Film Edition v7.0 - Full Live UI
// ============================================

(function() {
  'use strict';

  const API_BASE = (typeof window !== 'undefined' && window.GRACEX_API_BASE) || 'http://localhost:3000';

  function escapeHtml(str) {
    if (str == null) return '';
    const s = String(str);
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  const CoreDashboardLive = {
    initialized: false,
    autoRefreshEnabled: true,
    refreshInterval: 10000, // 10 seconds — live feel
    refreshTimer: null,
    messageLogTimer: null,
    messageLogInterval: 5000,
    modulesList: [
      'core', 'production', 'assistant_directors', 'safety', 'finance',
      'locations', 'casting', 'creative', 'art', 'costume', 'hmu',
      'camera', 'lighting', 'grip', 'sound', 'sfx', 'stunts',
      'post', 'publicity', 'vault'
    ],

    init() {
      if (this.initialized) return;
      
      console.log('[CORE DASHBOARD] Initializing live data system...');
      
      // Wait for dashboard elements to exist
      this.waitForDashboard();
    },

    waitForDashboard() {
      const checkInterval = setInterval(() => {
        const dashboard = document.getElementById('core-status-dashboard');
        if (dashboard) {
          clearInterval(checkInterval);
          this.initialized = true;
          this.setupDashboard();
          console.log('[CORE DASHBOARD] Live system initialized ✅');
        }
      }, 500);

      // Timeout after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);
    },

    setupDashboard() {
      // Setup refresh button
      const refreshBtn = document.getElementById('dashboard-refresh');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => this.fetchAndUpdate());
      }

      // Setup auto-refresh toggle
      const autoRefreshToggle = document.getElementById('dashboard-auto-refresh');
      if (autoRefreshToggle) {
        autoRefreshToggle.checked = this.autoRefreshEnabled;
        autoRefreshToggle.addEventListener('change', (e) => {
          this.autoRefreshEnabled = e.target.checked;
          if (this.autoRefreshEnabled) {
            this.startAutoRefresh();
          } else {
            this.stopAutoRefresh();
          }
        });
      }

      // Setup section toggles
      this.setupSectionToggles();

      // Setup logs controls
      this.setupLogsControls();

      // Core Messaging Hub
      this.setupCoreMessaging();

      // Initial data fetch
      this.fetchAndUpdate();

      // Live message log
      this.fetchMessageLog();
      this.startMessageLogPoll();

      // Start auto-refresh if enabled
      if (this.autoRefreshEnabled) {
        this.startAutoRefresh();
      }
    },

    setupSectionToggles() {
      document.querySelectorAll('.section-header[data-toggle]').forEach(header => {
        header.addEventListener('click', () => {
          const contentId = header.getAttribute('data-toggle');
          const content = document.getElementById(contentId);
          const toggle = header.querySelector('.section-toggle');
          
          if (content) {
            const isCollapsed = content.style.display === 'none';
            content.style.display = isCollapsed ? 'block' : 'none';
            if (toggle) toggle.textContent = isCollapsed ? '▼' : '▶';
          }
        });
      });
    },

    setupLogsControls() {
      const clearBtn = document.getElementById('logs-clear');
      const exportBtn = document.getElementById('logs-export');
      const diagBtn = document.getElementById('logs-diagnostics');

      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clearLogs());
      }

      if (exportBtn) {
        exportBtn.addEventListener('click', () => this.exportLogs());
      }

      if (diagBtn) {
        diagBtn.addEventListener('click', () => this.runDiagnostics());
      }
    },

    setupCoreMessaging() {
      const sendBtn = document.getElementById('core-send-btn');
      const relayBtn = document.getElementById('core-relay-btn');
      if (sendBtn) {
        sendBtn.addEventListener('click', () => this.sendCoreMessage());
      }
      if (relayBtn) {
        relayBtn.addEventListener('click', () => this.relayCoreMessage());
      }
    },

    async sendCoreMessage() {
      const toSelect = document.getElementById('core-send-to');
      const messageEl = document.getElementById('core-send-message');
      if (!toSelect || !messageEl) return;
      const to = (toSelect.value || '').trim();
      const message = (messageEl.value || '').trim();
      if (!to) {
        this.addLog('WARNING', 'Select a department to send to');
        return;
      }
      if (!message) {
        this.addLog('WARNING', 'Enter a message');
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/api/core/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fromModule: 'core', toModule: to, message })
        });
        const data = await response.json();
        if (data.success) {
          messageEl.value = '';
          this.addLog('SUCCESS', `Sent to ${this.formatModuleName(to)}`);
          this.fetchMessageLog();
        } else {
          this.addLog('ERROR', data.error || 'Send failed');
        }
      } catch (err) {
        this.addLog('ERROR', `Send failed: ${err.message}`);
      }
    },

    async relayCoreMessage() {
      const fromSelect = document.getElementById('core-relay-from');
      const toSelect = document.getElementById('core-relay-to');
      const messageEl = document.getElementById('core-relay-message');
      if (!fromSelect || !toSelect || !messageEl) return;
      const from = (fromSelect.value || '').trim();
      const to = (toSelect.value || '').trim();
      const message = (messageEl.value || '').trim();
      if (!to) {
        this.addLog('WARNING', 'Select a department to receive');
        return;
      }
      if (from === to) {
        this.addLog('WARNING', 'From and To must be different');
        return;
      }
      if (!message) {
        this.addLog('WARNING', 'Enter a message');
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/api/core/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fromModule: from, toModule: to, message })
        });
        const data = await response.json();
        if (data.success) {
          messageEl.value = '';
          this.addLog('SUCCESS', `Relay ${this.formatModuleName(from)} → ${this.formatModuleName(to)}`);
          this.fetchMessageLog();
        } else {
          this.addLog('ERROR', data.error || 'Relay failed');
        }
      } catch (err) {
        this.addLog('ERROR', `Relay failed: ${err.message}`);
      }
    },

    async fetchMessageLog() {
      const logEl = document.getElementById('core-message-log');
      const updateEl = document.getElementById('core-message-log-update');
      if (!logEl) return;
      try {
        const response = await fetch(`${API_BASE}/api/core/messages?limit=50`);
        const data = await response.json();
        if (data.success && Array.isArray(data.messages)) {
          if (data.messages.length === 0) {
            logEl.innerHTML = '<div class="core-log-placeholder">Messages through Core appear here.</div>';
          } else {
            logEl.innerHTML = data.messages.map(m => {
              const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : '—';
              return `<div class="core-log-msg"><span class="core-log-time">${time}</span> <span class="core-log-route">${this.formatModuleName(m.fromModule)} → ${this.formatModuleName(m.toModule)}</span> <span class="core-log-body">${escapeHtml(m.message || '')}</span></div>`;
            }).join('');
          }
          if (updateEl) updateEl.textContent = new Date().toLocaleTimeString();
        }
      } catch (err) {
        logEl.innerHTML = '<div class="core-log-placeholder core-log-error">Could not load messages.</div>';
        if (updateEl) updateEl.textContent = 'Error';
      }
    },

    startMessageLogPoll() {
      this.stopMessageLogPoll();
      this.messageLogTimer = setInterval(() => this.fetchMessageLog(), this.messageLogInterval);
    },

    stopMessageLogPoll() {
      if (this.messageLogTimer) {
        clearInterval(this.messageLogTimer);
        this.messageLogTimer = null;
      }
    },

    async fetchAndUpdate() {
      try {
        console.log('[CORE DASHBOARD] Fetching live data...');
        
        // Fetch from backend
        const response = await fetch(`${API_BASE}/api/system/status`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        // Update all dashboard sections
        this.updateSystemOverview(data);
        this.updateModuleStatus(data);
        this.updateLiveFeeds(data);
        this.updateLastUpdate();
        
        this.addLog('INFO', 'Dashboard updated successfully');
        console.log('[CORE DASHBOARD] Data updated ✅');
        
      } catch (error) {
        console.error('[CORE DASHBOARD] Fetch error:', error);
        this.addLog('ERROR', `Failed to fetch system data: ${error.message}`);
        this.showOfflineStatus();
      }
    },

    updateSystemOverview(data) {
      // Uptime
      const uptimeEl = document.getElementById('sys-uptime');
      if (uptimeEl && data.uptime !== undefined) {
        uptimeEl.textContent = this.formatUptime(data.uptime);
      }

      // Current mode
      const modeEl = document.getElementById('sys-mode');
      if (modeEl) {
        modeEl.textContent = 'Film Edition';
      }

      // Active module
      const activeModuleEl = document.getElementById('sys-active-module');
      if (activeModuleEl) {
        const currentHash = window.location.hash.replace('#/', '') || 'core';
        activeModuleEl.textContent = this.formatModuleName(currentHash);
      }

      // Brain status
      const brainStatusEl = document.getElementById('sys-brain-status');
      if (brainStatusEl && data.backend) {
        brainStatusEl.textContent = data.backend.status || 'Online';
        brainStatusEl.className = 'stat-value stat-status-good';
      }

      // TTS status
      const ttsStatusEl = document.getElementById('sys-tts-status');
      if (ttsStatusEl) {
        const ttsEnabled = window.GRACEX_TTS && window.GRACEX_TTS.isEnabled();
        ttsStatusEl.textContent = ttsEnabled ? 'Enabled' : 'Disabled';
        ttsStatusEl.className = ttsEnabled ? 'stat-value stat-status-good' : 'stat-value stat-status-warning';
      }

      // Memory
      const memoryEl = document.getElementById('sys-memory');
      if (memoryEl && data.memory) {
        const usedMB = Math.round(data.memory.heapUsed / 1024 / 1024);
        const totalMB = Math.round(data.memory.heapTotal / 1024 / 1024);
        memoryEl.textContent = `${usedMB}MB / ${totalMB}MB`;
      }
    },

    updateModuleStatus(data) {
      const grid = document.getElementById('module-status-grid');
      if (!grid) return;

      grid.innerHTML = ''; // Clear existing

      this.modulesList.forEach(moduleId => {
        const isActive = data.modules && data.modules.list && 
                        data.modules.list.includes(moduleId);
        
        const moduleCard = document.createElement('div');
        moduleCard.className = 'module-status-card';
        moduleCard.innerHTML = `
          <div class="module-status-indicator ${isActive ? 'status-green' : 'status-grey'}"></div>
          <div class="module-status-name">${this.formatModuleName(moduleId)}</div>
          <div class="module-status-state">${isActive ? 'Active' : 'Standby'}</div>
        `;
        
        moduleCard.addEventListener('click', () => {
          window.location.hash = `#/${moduleId}`;
        });

        grid.appendChild(moduleCard);
      });
    },

    updateLiveFeeds(data) {
      // Brain API
      this.updateFeedStatus('feed-brain', 'feed-brain-status', 
        data.backend && data.backend.status === 'online', 
        data.backend && data.backend.status ? data.backend.status : 'Offline'
      );

      // Sport
      this.updateFeedStatus('feed-sport', 'feed-sport-status', true, 'Ready');

      // Racing
      this.updateFeedStatus('feed-racing', 'feed-racing-status', false, 'Standby');

      // TTS
      const ttsActive = window.GRACEX_TTS && window.GRACEX_TTS.isEnabled();
      this.updateFeedStatus('feed-tts', 'feed-tts-status', ttsActive, ttsActive ? 'Active' : 'Disabled');

      // Speech recognition
      const speechAvailable = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      this.updateFeedStatus('feed-speech', 'feed-speech-status', speechAvailable, speechAvailable ? 'Ready' : 'Not Available');

      // Storage
      const storageAvailable = typeof(Storage) !== 'undefined';
      this.updateFeedStatus('feed-storage', 'feed-storage-status', storageAvailable, storageAvailable ? 'Available' : 'Not Available');

      // Update sync time
      const syncTimeEl = document.getElementById('feed-last-sync');
      if (syncTimeEl) {
        syncTimeEl.textContent = new Date().toLocaleTimeString();
      }
    },

    updateFeedStatus(indicatorId, statusId, isOnline, statusText) {
      const indicator = document.getElementById(indicatorId);
      const status = document.getElementById(statusId);

      if (indicator) {
        indicator.className = 'feed-indicator';
        if (isOnline) {
          indicator.classList.add('feed-green');
        } else if (statusText.toLowerCase().includes('standby')) {
          indicator.classList.add('feed-yellow');
        } else {
          indicator.classList.add('feed-grey');
        }
      }

      if (status) {
        status.textContent = statusText;
      }
    },

    updateLastUpdate() {
      const lastUpdateEl = document.getElementById('dashboard-last-update');
      if (lastUpdateEl) {
        const now = new Date();
        lastUpdateEl.textContent = `Updated: ${now.toLocaleTimeString()}`;
      }
    },

    showOfflineStatus() {
      const lastUpdateEl = document.getElementById('dashboard-last-update');
      if (lastUpdateEl) {
        lastUpdateEl.textContent = 'Updated: Connection failed';
        lastUpdateEl.style.color = '#ef4444';
        setTimeout(() => {
          lastUpdateEl.style.color = '';
        }, 3000);
      }
    },

    addLog(type, message) {
      const logsPanel = document.getElementById('logs-panel');
      if (!logsPanel) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString();

      const logEntry = document.createElement('div');
      logEntry.className = `log-entry log-${type.toLowerCase()}`;
      logEntry.innerHTML = `
        <span class="log-time">${timeStr}</span>
        <span class="log-type">${type}</span>
        <span class="log-msg">${message}</span>
      `;

      logsPanel.appendChild(logEntry);

      // Keep only last 50 logs
      while (logsPanel.children.length > 50) {
        logsPanel.removeChild(logsPanel.firstChild);
      }

      // Auto-scroll to bottom
      logsPanel.scrollTop = logsPanel.scrollHeight;
    },

    clearLogs() {
      const logsPanel = document.getElementById('logs-panel');
      if (logsPanel) {
        logsPanel.innerHTML = '';
        this.addLog('INFO', 'Logs cleared');
      }
    },

    exportLogs() {
      const logsPanel = document.getElementById('logs-panel');
      if (!logsPanel) return;

      const logs = Array.from(logsPanel.querySelectorAll('.log-entry'))
        .map(entry => entry.textContent.trim())
        .join('\n');

      const blob = new Blob([logs], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gracex-logs-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      this.addLog('INFO', 'Logs exported');
    },

    async runDiagnostics() {
      this.addLog('INFO', 'Running system diagnostics...');

      // Check backend
      try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
          this.addLog('SUCCESS', 'Backend: Online ✅');
        } else {
          this.addLog('WARNING', `Backend: HTTP ${response.status}`);
        }
      } catch (error) {
        this.addLog('ERROR', 'Backend: Offline ❌');
      }

      // Check browser features
      this.addLog('INFO', `Speech Recognition: ${('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) ? 'Available ✅' : 'Not Available ❌'}`);
      this.addLog('INFO', `Local Storage: ${typeof(Storage) !== 'undefined' ? 'Available ✅' : 'Not Available ❌'}`);
      this.addLog('INFO', `Web Speech API: ${typeof(SpeechSynthesisUtterance) !== 'undefined' ? 'Available ✅' : 'Not Available ❌'}`);

      // Check modules
      const moduleCount = this.modulesList.length;
      this.addLog('INFO', `Modules Registered: ${moduleCount}`);

      // Check Master Control
      if (window.GraceXMaster) {
        this.addLog('SUCCESS', 'Master Control: Active ✅');
      } else {
        this.addLog('WARNING', 'Master Control: Not found');
      }

      this.addLog('INFO', 'Diagnostics complete');
    },

    startAutoRefresh() {
      this.stopAutoRefresh(); // Clear any existing timer
      
      this.refreshTimer = setInterval(() => {
        this.fetchAndUpdate();
      }, this.refreshInterval);

      console.log('[CORE DASHBOARD] Auto-refresh enabled (10s)');
    },

    stopAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
      console.log('[CORE DASHBOARD] Auto-refresh disabled');
    },

    formatUptime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    formatModuleName(moduleId) {
      const names = {
        'core': 'Master Control',
        'production': 'Production Management',
        'assistant_directors': '1st AD / Call Sheets',
        'safety': 'Safety & Compliance',
        'finance': 'Finance & Accounting',
        'locations': 'Locations',
        'casting': 'Casting',
        'creative': 'Creative Direction',
        'art': 'Art & Set Design',
        'costume': 'Costume & Wardrobe',
        'hmu': 'Hair & Makeup',
        'camera': 'Camera Department',
        'lighting': 'Lighting & Electric',
        'grip': 'Grip Department',
        'sound': 'Sound Department',
        'sfx': 'Special Effects',
        'stunts': 'Stunts',
        'post': 'Post Production',
        'publicity': 'Publicity & Marketing',
        'vault': 'Asset Vault'
      };
      return names[moduleId] || moduleId.charAt(0).toUpperCase() + moduleId.slice(1);
    }
  };

  // Export to window
  window.CoreDashboardLive = CoreDashboardLive;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => CoreDashboardLive.init(), 1000);
    });
  } else {
    setTimeout(() => CoreDashboardLive.init(), 1000);
  }

  // Re-initialize when Core module is loaded via router
  document.addEventListener('gracex:module:loaded', (event) => {
    if (event.detail && event.detail.module === 'core') {
      setTimeout(() => CoreDashboardLive.init(), 500);
    }
  });

  console.log('[CORE DASHBOARD LIVE] System loaded');

})();
