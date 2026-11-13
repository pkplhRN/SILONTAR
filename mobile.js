'use strict';

const frame = document.getElementById('app-frame');
const statusPanel = document.getElementById('status-panel');
const statusMessage = document.getElementById('status-message');
const directLink = document.getElementById('direct-link');
const retryButton = document.getElementById('retry-button');
const connection = document.getElementById('connection');
const installButton = document.getElementById('install-button');
const installHelp = document.getElementById('install-help');
document.getElementById('close-install-help').addEventListener('click', () => installHelp.close());
const standalone = window.matchMedia('(display-mode: standalone)');
const appUrl = readAppUrl();
let loadTimeout;
let installPrompt;

function readAppUrl() {
  try {
    const url = new URL(window.SILONTAR_HOST_CONFIG?.webAppUrl);
    return url.origin === 'https://script.google.com' && !url.username && !url.password &&
      /^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) ? url.href : '';
  } catch {
    return '';
  }
}

function setStatus(message, canRetry) {
  statusPanel.hidden = false;
  statusMessage.textContent = message;
  retryButton.hidden = !canRetry;
}

function updateConnection() {
  connection.hidden = navigator.onLine !== false;
  // Do not reload the iframe on reconnection: a user may be filling out a form.
}

function loadPortal() {
  clearTimeout(loadTimeout);
  if (navigator.onLine === false) {
    setStatus('Tidak ada koneksi internet. Sambungkan internet, lalu coba lagi.', true);
    return;
  }
  if (!appUrl) {
    setStatus('Konfigurasi portal belum tersedia. Periksa file config.js di folder utama situs, lalu coba lagi.', true);
    return;
  }
  frame.hidden = true;
  setStatus('Memuat layanan persampahan Kabupaten Rote Ndao…', false);
  frame.src = appUrl;
  loadTimeout = setTimeout(() => {
    setStatus('Portal belum selesai dimuat. Coba lagi atau pilih Buka di browser.', true);
  }, 18000);
}

frame.addEventListener('load', () => {
  if (!frame.getAttribute('src')) return;
  clearTimeout(loadTimeout);
  // A cross-origin iframe's load event does not prove its contents are usable.
  // The direct link stays available if the browser or Google blocks the embed.
  statusPanel.hidden = true;
  frame.hidden = false;
});
retryButton.addEventListener('click', () => appUrl ? loadPortal() : location.reload());
if (appUrl) {
  directLink.href = appUrl;
  directLink.hidden = false;
}
window.addEventListener('online', updateConnection);
window.addEventListener('offline', updateConnection);
updateConnection();
loadPortal();

function updateInstallButton() {
  installButton.hidden = standalone.matches || navigator.standalone === true;
}
updateInstallButton();
standalone.addEventListener?.('change', updateInstallButton);
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
});
window.addEventListener('appinstalled', () => {
  installPrompt = null;
  installButton.hidden = true;
});
installButton.addEventListener('click', async () => {
  if (installPrompt) {
    const prompt = installPrompt;
    installPrompt = null;
    try {
      await prompt.prompt();
      if ((await prompt.userChoice).outcome === 'accepted') installButton.hidden = true;
      return;
    } catch {
      // Provide the browser-menu steps when the native prompt is unavailable.
    }
  }
  installHelp.showModal();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch((error) => {
    console.warn('Halaman bantuan offline tidak dapat dipasang:', error.message);
  });
}
