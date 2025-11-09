document.addEventListener('DOMContentLoaded', function () {
  const root = document.getElementById('root');

  const state = {
    status: 'Listo',
    recording: false,
    paused: false,
    hasRecording: false,
    uploaded: false,
    showHelp: false,
    reportVisible: false,
    reportData: null
  };

  function showWalletPopup(data) {
    let existing = document.getElementById('wallet-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'wallet-modal';
    modal.className = 'report-modal'; 
    modal.innerHTML = `
      <div class="report-box">
        <h3>Wallet detectada ✅</h3>
        <div class="report-row"><div class="label">UID:</div><div class="value">${data.uid}</div></div>
        <div class="report-row"><div class="label">ID:</div><div class="value">${data.id}</div></div>
        <div class="report-row"><div class="label">Timestamp:</div><div class="value">${data.ts}</div></div>
        <button id="wallet-close" class="report-close">Cerrar</button>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = document.getElementById('wallet-close');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
  }
 
  function svgIconMic() {
    return `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M19 11v1a7 7 0 0 1-14 0v-1" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 19v2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
      </svg>`;
  }

  function svgIconPause() {
    return `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="6" y="5" width="4" height="14" rx="1" fill="#fff" />
        <rect x="14" y="5" width="4" height="14" rx="1" fill="#fff" />
      </svg>`;
  }

  function svgIconUpload() {
    return `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M12 3v10" stroke="#5b93c8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M5 10l7-7 7 7" stroke="#5b93c8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M21 21H3" stroke="#5b93c8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`;
  }


  function render() {
    root.innerHTML = `
      <div class="card" role="application" aria-label="Interfaz de grabación">
        <div class="header">
          <div class="header-center">
            <div class="title">Graba tu actualización</div>
            <div class="subtitle">Pulsa el botón naranja para empezar. Pulsa \"Guardar y enviar\" cuando termines.</div>
          </div>
          <button id="btn-help" class="btn blue help-btn" aria-label="Ayuda">Ayuda</button>
        </div>

        <div class="controls-row">
          <button id="btn-start" class="btn green">
            ${svgIconMic()}
            <span id="btn-start-text">${state.recording ? 'Detener' : 'Comenzar'}</span>
          </button>

          <button id="btn-pause" class="btn blue" disabled>
            ${svgIconPause()}
            <span id="btn-pause-text">Pausar</span>
          </button>
        </div>

        <div class="center-action-wrap">
          <button id="btn-upload" class="btn disabled" disabled aria-disabled="true">
            ${svgIconUpload()}
            <span>Guardar y enviar</span>
          </button>
        </div>

        <div id="status" class="status" aria-live="polite">Estado: ${state.status}</div>

  <!-- press indicator removed -->

        <div class="footer-links" role="contentinfo">
          <a id="link-profile" href="#">Configurar perfil</a>
          <div class="divider"></div>
          <a id="link-report" href="#">Ver informe semanal</a>
        </div>

        ${state.showHelp ? `
          <div id="help-overlay" class="help-overlay" role="dialog" aria-modal="true">
            <div class="help-box">
              <h2>Ayuda rápida</h2>
              <p>1) Pulsa "Comenzar" para grabar tu mensaje.<br/>2) Pulsa "Pausar" para detener temporalmente.<br/>3) Cuando hayas terminado, pulsa "Guardar y enviar" para enviar la grabación.</p>
              <button id="help-close" class="help-close">Cerrar</button>
            </div>
          </div>
        ` : ''}

            ${state.reportVisible ? `
              <div id="report-modal" class="report-modal" role="dialog" aria-modal="true">
                <div class="report-box">
                  <h3>Informe semanal</h3>
                  <div class="report-row"><div class="label">Ventas totales</div><div class="value">${state.reportData ? state.reportData.sales_total : '$12,345'}</div></div>
                  <div class="report-row"><div class="label">Grabaciones realizadas</div><div class="value">${state.reportData ? state.reportData.recordings_total : '24'}</div></div>
                  <div class="report-row"><div class="label">Grabaciones enviadas</div><div class="value">${state.reportData ? state.reportData.recordings_sent : '22'}</div></div>
                  <div class="report-row"><div class="label">Usuarios activos</div><div class="value">${state.reportData ? state.reportData.active_users : '8'}</div></div>
                  <button id="report-close" class="report-close">Cerrar</button>
                </div>
              </div>
            ` : ''}
      </div>
    `;

    const btnStart = document.getElementById('btn-start');
    const btnStartText = document.getElementById('btn-start-text');
    const btnPause = document.getElementById('btn-pause');
    const btnPauseText = document.getElementById('btn-pause-text');
    const btnUpload = document.getElementById('btn-upload');
    const statusEl = document.getElementById('status');
    const btnHelp = document.getElementById('btn-help');

    if (btnHelp) btnHelp.addEventListener('click', function () {
      state.showHelp = true;
      render();
    });

    const helpClose = document.getElementById('help-close');
    if (helpClose) helpClose.addEventListener('click', function () {
      state.showHelp = false;
      render();
    });

    if (btnStart) btnStart.addEventListener('click', function () {
      if (!state.recording) {
        state.recording = true; state.paused = false; state.hasRecording = false; state.uploaded = false;
      } else {
        state.recording = false; state.paused = false; state.hasRecording = true;
      }
      updateStatus(); render();
    });

    if (btnPause) btnPause.addEventListener('click', function () {
      if (!state.recording) return;
      state.paused = !state.paused;
      updateStatus(); render();
    });

    if (btnUpload) btnUpload.addEventListener('click', function () {
      if (state.recording || !state.hasRecording) return;
      state.status = 'Enviando...'; render();
      setTimeout(function () {
        state.uploaded = true; state.hasRecording = false; updateStatus(); render();
      }, 1200);
    });

   
    const linkReport = document.getElementById('link-report');
    if (linkReport) linkReport.addEventListener('click', function (e) {
      e.preventDefault();
     
      fetch('/report?period=week')
        .then(r => {
          if (!r.ok) throw new Error('Network response not ok');
          return r.json();
        })
        .then(data => {
          state.reportData = data;
          state.reportVisible = true;
          render();
        })
        .catch(() => {

          state.reportData = {
            sales_total: '$12,345', 
            recordings_total: 24,
            recordings_sent: 22,
            active_users: 8
          };
          state.reportVisible = true;
          render();
        });
    });

    const reportClose = document.getElementById('report-close');
    if (reportClose) reportClose.addEventListener('click', function () {
      state.reportVisible = false; render();
    });

    if (btnPause) btnPause.disabled = !state.recording;
    if (btnPauseText) btnPauseText.textContent = state.paused ? 'Reanudar' : 'Pausar';

    if (btnUpload) {
      const enabled = state.hasRecording && !state.recording;
      btnUpload.disabled = !enabled;
      btnUpload.classList.toggle('disabled', !enabled);
      btnUpload.setAttribute('aria-disabled', (!enabled).toString());
    }

    if (btnStartText) btnStartText.textContent = state.recording ? 'Detener' : 'Comenzar';

    if (statusEl) statusEl.textContent = 'Estado: ' + state.status;
  }

  function updateStatus() {
    if (state.recording && !state.paused) {
      state.status = 'Grabando...'; state.uploaded = false;
    } else if (state.recording && state.paused) {
      state.status = 'En pausa';
    } else if (state.uploaded) {
      state.status = 'Enviado';
    } else if (state.hasRecording) {
      state.status = 'Grabación lista';
    } else {
      state.status = 'Listo';
    }
  }

  updateStatus(); render();
});
