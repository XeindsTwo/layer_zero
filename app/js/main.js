let osName = "unknown";

const platform = navigator.platform.toLowerCase();
const userAgent = navigator.userAgent.toLowerCase();

if (platform.includes('win')) {
  if (userAgent.includes('windows nt 10.0')) osName = "windows 10";
  else if (userAgent.includes('windows nt 6.3')) osName = "windows 8.1";
  else if (userAgent.includes('windows nt 6.2')) osName = "windows 8";
  else if (userAgent.includes('windows nt 6.1')) osName = "windows 7";
  else if (userAgent.includes('windows nt 6.0')) osName = "windows vista";
  else if (userAgent.includes('windows nt 5.1') || userAgent.includes('windows xp')) osName = "windows xp";
  else osName = "windows";
} else if (platform.includes('mac')) {
  osName = "macos";
}

function detectMobile() {
  const ua = navigator.userAgent.toLowerCase();
  const isTouch = navigator.maxTouchPoints > 1;
  const isClassicMobile = /android|iphone|ipod|blackberry|bb10|iemobile|opera mini|webos/.test(ua);
  const isModernIpad = (ua.includes("macintosh") && isTouch) || ua.includes("ipad");
  const isSurfacePro = ua.includes("windows") && isTouch;

  const smallScreen = screen.width <= 768 || screen.height <= 768;
  const hasOrientation = typeof window.orientation !== 'undefined';

  return (
    isClassicMobile ||
    isModernIpad ||
    isSurfacePro ||
    smallScreen ||
    hasOrientation
  );
}

const isMobile = detectMobile();

if (isMobile) {
  const mobileScreen = document.getElementById('mobile-screen');
  if (mobileScreen) mobileScreen.style.display = 'block';

  const mainSection = document.querySelector('section.home');
  if (mainSection) mainSection.style.display = 'none';

  const header = document.querySelector('header');
  if (header) header.style.display = 'none';
} else {
  const mobileScreen = document.getElementById('mobile-screen');
  if (mobileScreen) mobileScreen.style.display = 'none';

  const mainSection = document.querySelector('section.home');
  if (mainSection) mainSection.style.display = '';

  const header = document.querySelector('header');
  if (header) header.style.display = '';
}

const input = document.getElementById('code');
const button = document.getElementById('getClientBtn');
const modal = document.getElementById('modalForm');
const openModalBtn = document.getElementById('home-btn');
const closeModalBtn = document.getElementById('modalCloseBtn');

openModalBtn.addEventListener('click', () => {
  modal.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.remove('active');
  }
});

let mouseDownInside = false;

modal.addEventListener('mousedown', (e) => {
  mouseDownInside = !!e.target.closest('.modal__inner');
});

modal.addEventListener('mouseup', (e) => {
  const mouseUpInside = !!e.target.closest('.modal__inner');
  if (!mouseDownInside && !mouseUpInside) {
    modal.classList.remove('active');
  }
});

input.addEventListener('input', function () {
  this.value = this.value.replace(/[^A-Za-z0-9]/g, '');

  if (this.value.length > 11) {
    this.value = this.value.slice(0, 11);
  }

  button.disabled = this.value.length !== 11;
});

button.addEventListener('click', async () => {
  const code = input.value;
  const os = osName.includes('mac') ? 'mac' : 'windows';

  const errorBlock = document.getElementById('modalError');
  errorBlock.style.display = 'none';
  input.classList.remove('error');

  try {
    const response = await fetch('/php/functions/public_validate_code.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `code=${encodeURIComponent(code)}&os=${encodeURIComponent(os)}`
    });

    const data = await response.json();

    if (data.status === 'ok' && data.download_link) {
      window.location.href = data.download_link;
    } else {
      showError();
    }
  } catch (err) {
    showError();
  }
});

function showError() {
  const errorBlock = document.getElementById('modalError');
  errorBlock.style.display = 'block';
  input.classList.add('error-input');
  button.disabled = true;

  setTimeout(() => {
    errorBlock.style.display = 'none';
    input.classList.remove('error-input');
    button.disabled = false;
  }, 1500);
}