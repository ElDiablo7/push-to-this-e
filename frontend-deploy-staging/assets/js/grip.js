// GRACE-X Grip Department Module - Film Edition v7.0
(function() {
  'use strict';
  const MODULE_ID = 'grip';
  
  window.setupGripBrain = function() {
    if (!window.runModuleBrain) return;
    const outputEl = document.getElementById('grip-brain-output');
    const inputEl = document.getElementById('grip-brain-input');
    const sendBtn = document.getElementById('grip-brain-send');
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
        console.error('[Grip] Brain error:', error);
      }
    }
    sendBtn.addEventListener('click', handleAsk);
    inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAsk(); });
  };
  
  function initModule() {
    setTimeout(() => { if (typeof window.setupGripBrain === 'function') window.setupGripBrain(); }, 500);
  }
  
  if (window.GraceXMaster) {
    window.GraceXMaster.registerModule(MODULE_ID, {
      name: 'Grip Department',
      category: 'film_production',
      capabilities: ['ai_assistant', 'rigging', 'camera_support'],
      init: initModule
    });
  }
  
  document.addEventListener('gracex:module:loaded', (e) => { if (e.detail && e.detail.module === MODULE_ID) initModule(); });
  console.log('[Grip] Module script loaded');
})();
