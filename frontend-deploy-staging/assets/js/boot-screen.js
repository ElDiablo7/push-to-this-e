/* ============================================
   GRACE-X BOOT SCREEN CONTROLLER
   Enterprise Startup Sequence
   ============================================ */

(function(window) {
  'use strict';

  const GraceXBoot = {
    initialized: false,
    startTime: Date.now(),
    modules: [
      'CORE BRAIN SYSTEM',
      'STATE MANAGER',
      'ROUTER',
      'RAM CACHE',
      'ANALYTICS ENGINE',
      'MASTER BRAIN',
      'MASTER CONTROL',
      'CALL SHEETS',
      'RISK & SAFETY',
      'BUILDER MODULE',
      'SPORT MODULE',
      'GUARDIAN MODULE',
      'OSINT MODULE',
      'ACCOUNTING MODULE',
      'FORGE MODULE',
      'LASER™ ULTRA',
      'NETWORK MANAGER',
      'UI CONTROLS'
    ],
    currentModuleIndex: 0,
    bootDuration: 17000, // ~17s — two boot clips with crossfade
    skipRequested: false,
    crossfadeDone: false,

    init() {
      if (this.initialized) return;
      this.initialized = true;

      // Check if user wants to skip boot (localStorage preference)
      const skipBoot = localStorage.getItem('gracex_skip_boot') === 'true';
      if (skipBoot) {
        this.skipBoot();
        return;
      }

      console.log('🚀 GRACE-X BOOT SEQUENCE INITIATED');
      
      this.createBootScreen();
      this.startBootSequence();
      this.setupEventListeners();
    },

    createBootScreen() {
      const bootScreen = document.createElement('div');
      bootScreen.id = 'gracex-boot-screen';
      bootScreen.innerHTML = `
        <!-- Full-screen boot video (two clips, crossfade) - WITH SOUND -->
        <div class="boot-video-layer" id="boot-video-layer">
          <video id="boot-video-1" class="boot-video boot-video-active" src="assets/video/boot-1.mp4" playsinline preload="auto"></video>
          <video id="boot-video-2" class="boot-video" src="assets/video/boot-2.mp4" playsinline preload="auto"></video>
        </div>
        
        <!-- Skip Hint (minimal, bottom corner) -->
        <div class="boot-skip-hint">
          Press any key to skip
        </div>
      `;
      
      document.body.insertBefore(bootScreen, document.body.firstChild);
      
      // Start boot video (two clips, crossfade); fallback to timer if video fails
      this.startBootVideo();
    },

    startBootVideo() {
      const video1 = document.getElementById('boot-video-1');
      const video2 = document.getElementById('boot-video-2');
      if (!video1 || !video2) return;

      const self = this;
      function fallbackNoVideo() {
        console.warn('[BOOT] Video failed, completing boot after 6s');
        setTimeout(() => self.completeBoot(), 6000);
      }

      function doCrossfade() {
        if (self.crossfadeDone) return;
        self.crossfadeDone = true;
        video1.classList.remove('boot-video-active');
        video2.classList.add('boot-video-active');
        video2.play().catch(() => {});
      }

      video1.addEventListener('error', fallbackNoVideo);
      video2.addEventListener('error', fallbackNoVideo);
      video1.addEventListener('canplaythrough', () => {
        video1.play().catch(() => fallbackNoVideo());
      });
      video1.addEventListener('timeupdate', () => {
        const d = video1.duration;
        if (!self.crossfadeDone && isFinite(d) && d > 0 && video1.currentTime >= Math.max(0, d - 1)) {
          doCrossfade();
        }
      });
      video1.addEventListener('ended', () => {
        if (!self.crossfadeDone) doCrossfade();
      });
      video2.addEventListener('ended', () => self.completeBoot());

      if (video1.readyState >= 3) {
        video1.play().catch(() => fallbackNoVideo());
      }
    },

    startBootSequence() {
      // Video-only boot - no overlay elements to update
      // Boot completion is handled by video end event in startBootVideo()
      console.log('🎬 Boot video playing with sound...');
    },

    completeBoot() {
      const video1 = document.getElementById('boot-video-1');
      const video2 = document.getElementById('boot-video-2');
      if (video1) video1.pause();
      if (video2) video2.pause();
      
      // Fade out immediately
      this.fadeOutBoot();
    },

    fadeOutBoot() {
      const bootScreen = document.getElementById('gracex-boot-screen');
      const app = document.getElementById('app');
      
      bootScreen.classList.add('fade-out');
      
      setTimeout(() => {
        bootScreen.classList.add('hidden');
        
        // Show main app with fade-in
        if (app) {
          app.style.display = 'flex';
          // Trigger fade-in animation
          setTimeout(() => {
            app.classList.add('app-ready');
          }, 50); // Small delay to ensure transition triggers
        }
        
        console.log('✅ GRACE-X BOOT COMPLETE - System Ready');
        
        // Dispatch custom event for other systems to know boot is complete
        window.dispatchEvent(new CustomEvent('gracex:boot-complete'));
      }, 1000);
    },

    skipBoot() {
      const bootScreen = document.getElementById('gracex-boot-screen');
      const app = document.getElementById('app');
      
      if (bootScreen) {
        bootScreen.classList.add('hidden');
      }
      
      // Show app immediately when skipping
      if (app) {
        app.style.display = 'flex';
        app.classList.add('app-ready');
      }
      
      console.log('⏭️ GRACE-X BOOT SKIPPED');
      window.dispatchEvent(new CustomEvent('gracex:boot-complete'));
    },

    setupEventListeners() {
      // Press any key to skip
      const skipHandler = (e) => {
        if (this.skipRequested) return;
        
        this.skipRequested = true;
        
        // ESC = skip always
        if (e.key === 'Escape') {
          localStorage.setItem('gracex_skip_boot', 'true');
          console.log('🔇 Boot screen disabled for future sessions');
        }
        
        this.completeBoot();
        document.removeEventListener('keydown', skipHandler);
      };
      
      document.addEventListener('keydown', skipHandler);
      
      // Click to skip
      const bootScreen = document.getElementById('gracex-boot-screen');
      bootScreen.addEventListener('click', () => {
        if (!this.skipRequested) {
          this.skipRequested = true;
          this.completeBoot();
        }
      });
    },

    getBuildVersion() {
      // Try to extract version from script tags
      const scripts = document.querySelectorAll('script[src*="?v="]');
      if (scripts.length > 0) {
        const src = scripts[0].src;
        const match = src.match(/\?v=([^&]+)/);
        return match ? match[1] : 'TITAN';
      }
      return 'TITAN';
    },

    // Public method to re-enable boot screen
    enableBootScreen() {
      localStorage.removeItem('gracex_skip_boot');
      console.log('✅ Boot screen re-enabled');
    }
  };

  // Export to window
  window.GraceXBoot = GraceXBoot;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      GraceXBoot.init();
    });
  } else {
    GraceXBoot.init();
  }

})(window);
