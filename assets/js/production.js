// GRACE-X Production Management Module
// Film Edition v7.0
(function() {
  'use strict';
  
  const MODULE_ID = 'production';
  
  // Setup AI Brain Integration
  window.setupProductionBrain = function() {
    if (!window.runModuleBrain) {
      console.warn('[Production] Brain system not available');
      return;
    }
    
    const outputEl = document.getElementById('production-brain-output');
    const inputEl = document.getElementById('production-brain-input');
    const sendBtn = document.getElementById('production-brain-send');
    const clearBtn = document.getElementById('production-brain-clear');
    const micBtn = document.getElementById('production-brain-mic');
    
    if (!outputEl || !inputEl || !sendBtn) return;
    
    async function handleAsk() {
      const question = inputEl.value.trim();
      if (!question) return;
      
      // Add user message
      const userMsg = document.createElement('div');
      userMsg.className = 'brain-message brain-message-user';
      userMsg.textContent = question;
      outputEl.appendChild(userMsg);
      
      inputEl.value = '';
      outputEl.scrollTop = outputEl.scrollHeight;
      
      try {
        const response = await window.runModuleBrain(MODULE_ID, question);
        
        // Add AI response
        const aiMsg = document.createElement('div');
        aiMsg.className = 'brain-message brain-message-assistant';
        aiMsg.textContent = response;
        outputEl.appendChild(aiMsg);
        outputEl.scrollTop = outputEl.scrollHeight;
      } catch (error) {
        console.error('[Production] Brain error:', error);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'brain-message brain-message-system';
        errorMsg.textContent = 'Error: Could not get response. Please try again.';
        outputEl.appendChild(errorMsg);
      }
    }
    
    sendBtn.addEventListener('click', handleAsk);
    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAsk();
    });
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        outputEl.innerHTML = '<div class="brain-message brain-message-system">Conversation cleared. How can I help?</div>';
      });
    }
    
    if (micBtn && window.GRACEX_VoiceInput) {
      micBtn.addEventListener('click', () => {
        window.GRACEX_VoiceInput.start(MODULE_ID, (transcript) => {
          inputEl.value = transcript;
          handleAsk();
        });
      });
    }
  };
  
  // Module initialization
  function initProductionModule() {
    console.log('[Production] Module initializing...');
    
    // Setup brain after short delay
    setTimeout(() => {
      if (typeof window.setupProductionBrain === 'function') {
        window.setupProductionBrain();
      }
    }, 500);
    
    // Initialize department-specific features here
    initBudgetTracking();
    initSchedule();
    initApprovals();
    initChangeControl();
  }
  
  function initBudgetTracking() {
    // Budget tracking functionality
    const addBtn = document.getElementById('production-add-budget');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        console.log('[Production] Adding budget line');
        // Budget logic here
      });
    }
  }
  
  function initSchedule() {
    // Schedule functionality
    const addBtn = document.getElementById('production-add-schedule');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        console.log('[Production] Adding schedule phase');
        // Schedule logic here
      });
    }
  }
  
  function initApprovals() {
    // Approval workflow functionality
    const requestBtn = document.getElementById('production-request-approval');
    if (requestBtn) {
      requestBtn.addEventListener('click', () => {
        console.log('[Production] Requesting approval');
        // Approval logic here
      });
    }
  }
  
  function initChangeControl() {
    // Change control functionality
    const logBtn = document.getElementById('production-log-change');
    if (logBtn) {
      logBtn.addEventListener('click', () => {
        console.log('[Production] Logging change');
        // Change control logic here
      });
    }
  }
  
  // Register with Master Control
  if (window.GraceXMaster) {
    window.GraceXMaster.registerModule(MODULE_ID, {
      name: 'Production Management',
      category: 'film_production',
      department: 'production_office',
      capabilities: ['ai_assistant', 'budget_tracking', 'scheduling', 'approvals'],
      init: initProductionModule
    });
  }
  
  // Auto-initialize on module load
  document.addEventListener('gracex:module:loaded', (event) => {
    if (event.detail && event.detail.module === MODULE_ID) {
      initProductionModule();
    }
  });
  
  console.log('[Production] Module script loaded');

})();
