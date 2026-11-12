const studioConfig = window.STUDIO_CONFIG || {};
const brandName = studioConfig.brandName || 'Devnex Tech Studio';

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

document.querySelectorAll('[data-brand]').forEach((element) => {
  element.textContent = brandName;
});

document.querySelectorAll('[data-founder-name]').forEach((element) => {
  element.textContent = studioConfig.founderName || 'Your Name';
});
document.querySelectorAll('[data-founder-intro]').forEach((element) => {
  element.textContent = studioConfig.founderIntro || '';
});

document.querySelectorAll('[data-founder-portfolio]').forEach((link) => {
  const portfolioUrl = (studioConfig.personalPortfolioUrl || '').trim();
  let parsedUrl;
  try {
    parsedUrl = new URL(portfolioUrl);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl && parsedUrl.protocol === 'https:') {
    link.href = parsedUrl.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.hidden = false;
    const note = document.querySelector('[data-founder-portfolio-note]');
    if (note) note.hidden = true;
  } else {
    const note = document.querySelector('[data-founder-portfolio-note]');
    if (note) note.hidden = false;
  }
});

const titleElement = document.querySelector('title[data-title-template]');
if (titleElement) {
  document.title = titleElement.dataset.titleTemplate.replace(/\{brand\}/g, brandName);
}
const siteNameMeta = document.querySelector('meta[property="og:site_name"]');
if (siteNameMeta) siteNameMeta.content = brandName;
const openGraphTitle = document.querySelector('meta[property="og:title"]');
if (openGraphTitle) openGraphTitle.content = document.title;

document.querySelectorAll('.logo-word').forEach((element) => {
  const words = brandName.trim().split(/\s+/);
  const accentWord = words.pop() || brandName;
  element.textContent = `${words.join(' ')}${words.length ? ' ' : ''}`;
  const accent = document.createElement('span');
  accent.textContent = accentWord;
  element.append(accent);
});

document.querySelectorAll('a.logo').forEach((link) => {
  link.setAttribute('aria-label', `${brandName} home`);
});

const businessEmail = (studioConfig.businessEmail || '').trim();
if (businessEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
  document.querySelectorAll('[data-contact-email], [data-footer-email], [data-privacy-email]').forEach((link) => {
    link.href = `mailto:${businessEmail}`;
    link.textContent = businessEmail;
  });
  document.querySelectorAll('[data-email-method]').forEach((element) => {
    element.hidden = false;
  });
  document.querySelectorAll('[data-footer-email], [data-privacy-email]').forEach((link) => {
    link.hidden = false;
  });
}

document.querySelectorAll('[data-whatsapp-method]').forEach((element) => {
  const configuredNumber = (studioConfig.whatsappNumber || '').trim();
  const internationalNumber = /^\+[1-9]\d{7,14}$/.test(configuredNumber);
  if (internationalNumber) {
    const link = element.querySelector('[data-contact-whatsapp]');
    const message = encodeURIComponent(`Hello ${brandName}, I'd like to discuss a project.`);
    link.href = `https://wa.me/${configuredNumber.slice(1)}?text=${message}`;
    element.hidden = false;
  }
});

document.querySelectorAll('[data-social-links]').forEach((container) => {
  const links = studioConfig.socialLinks || {};
  Object.entries(links).forEach(([label, url]) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'https:') return;
      const link = document.createElement('a');
      link.href = parsedUrl.href;
      link.textContent = label;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      container.append(link);
    } catch (error) {
      console.warn(`Ignoring invalid social link for ${label}.`, error);
    }
  });
});

document.querySelectorAll('[data-project-image][data-src]').forEach((image) => {
  const source = image.dataset.src.trim();
  if (!source) return;

  image.addEventListener('load', () => {
    const artwork = image.closest('.project-art');
    artwork.classList.add('has-project-image');
    artwork.removeAttribute('role');
    artwork.removeAttribute('aria-label');
    image.hidden = false;
  }, { once: true });

  image.addEventListener('error', () => {
    console.warn(`Could not load portfolio image: ${source}`);
  }, { once: true });

  image.src = source;
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  document.documentElement.classList.add('reveal-ready');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));
}
