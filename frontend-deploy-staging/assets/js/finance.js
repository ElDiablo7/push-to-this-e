// GRACE-X Finance & Accounting Module - Film Edition v7.0
(function() {
  'use strict';
  const MODULE_ID = 'finance';
  
  window.setupFinanceBrain = function() {
    if (!window.runModuleBrain) return;
    const outputEl = document.getElementById('finance-brain-output');
    const inputEl = document.getElementById('finance-brain-input');
    const sendBtn = document.getElementById('finance-brain-send');
    if (!outputEl || !inputEl || !sendBtn) return;
    
    async function handleAsk() {
      const question = inputEl.value.trim();
      if (!question) return;
      const userMsg = document.createElement('div');
      userMsg.className = 'brain-message brain-message-user';
      userMsg.textContent = question;
      outputEl.appendChild(userMsg);
      inputEl.value = '';
      outputEl.scrollTop = outputEl.scrollHeight;
      try {
        const response = await window.runModuleBrain(MODULE_ID, question);
        const aiMsg = document.createElement('div');
        aiMsg.className = 'brain-message brain-message-assistant';
        aiMsg.textContent = response;
        outputEl.appendChild(aiMsg);
        outputEl.scrollTop = outputEl.scrollHeight;
      } catch (error) {
        console.error('[Finance] Brain error:', error);
      }
    }
    sendBtn.addEventListener('click', handleAsk);
    inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAsk(); });
  };
  
  function initModule() {
    setTimeout(() => { if (typeof window.setupFinanceBrain === 'function') window.setupFinanceBrain(); }, 500);
  }
  
  if (window.GraceXMaster) {
    window.GraceXMaster.registerModule(MODULE_ID, {
      name: 'Finance & Accounting',
      category: 'film_production',
      capabilities: ['ai_assistant', 'cost_tracking', 'purchase_orders', 'payroll'],
      init: initModule
    });
  }
  
  document.addEventListener('gracex:module:loaded', (e) => { if (e.detail && e.detail.module === MODULE_ID) initModule(); });
  console.log('[Finance] Module script loaded');
})();
