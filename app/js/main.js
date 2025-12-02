const html = document.documentElement;
const body = document.body; // добавили
const menuBtn = document.querySelector('.menu-btn');
const header = document.querySelector('.header');
const headerMobile = document.querySelector('.header__mobile');
const anchors = document.querySelectorAll('.header__link, .header__link.mobile');
const allFocusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');

function closeMenu() {
  html.classList.remove('active');
  body.classList.remove('active');
  menuBtn.classList.remove('active');
  headerMobile.classList.remove('active');

  anchors.forEach(anchor => anchor.setAttribute('tabindex', '-1'));
  allFocusableElements.forEach(element => {
    element.removeAttribute('tabindex');
  });
}

menuBtn.addEventListener('click', () => {
  menuBtn.blur();
  const isMenuActive = html.classList.toggle('active');

  body.classList.toggle('active', isMenuActive); // добавили
  menuBtn.classList.toggle('active');
  headerMobile.classList.toggle('active');

  requestAnimationFrame(() => {
    if (isMenuActive) {
      anchors.forEach(anchor => anchor.removeAttribute('tabindex'));

      allFocusableElements.forEach(element => {
        if (!headerMobile.contains(element) && element !== menuBtn) {
          element.setAttribute('tabindex', '-1');
        }
      });
    } else {
      anchors.forEach(anchor => anchor.setAttribute('tabindex', '-1'));
      allFocusableElements.forEach(element => {
        element.removeAttribute('tabindex');
      });
    }
  });
});

// 📍 Клик вне меню — закрываем
document.addEventListener('click', (e) => {
  const clickInsideHeader = header.contains(e.target) || headerMobile.contains(e.target);

  if (!clickInsideHeader && html.classList.contains('active')) {
    closeMenu();
  }
});

function scrollToTarget(targetId) {
  const targetSection = document.querySelector(targetId);
  if (targetSection) {
    closeMenu();

    setTimeout(() => {
      const targetOffset = targetSection.offsetTop - 25;
      window.scrollTo({ top: targetOffset, behavior: 'smooth' });
    }, 700);
  }
}

function handleAnchorClick(event) {
  const isMobileLink = this.classList.contains('mobile');
  if (isMobileLink) {
    event.preventDefault();
    const href = this.getAttribute('href');
    const hrefParts = href.split('#');
    if (hrefParts.length === 2) {
      const targetId = '#' + hrefParts[1];
      scrollToTarget(targetId);
    }
  }
}

for (const anchor of anchors) {
  anchor.addEventListener('click', handleAnchorClick);
  anchor.addEventListener('touchstart', handleAnchorClick, { passive: true });
}