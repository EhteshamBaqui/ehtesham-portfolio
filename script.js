// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const menuWrapper = document.querySelector('.navbar-menu-wrapper');
if (hamburger && menuWrapper) {
  hamburger.addEventListener('click', () => menuWrapper.classList.toggle('active'));

  // Close menu when a link is clicked
  const menuLinks = menuWrapper.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => menuWrapper.classList.remove('active'));
  });
}





// Role switching: switch hero content between AI/ML Engineer and Software Engineer on hover
const aiRole = document.getElementById('ai-role');
const softwareRole = document.getElementById('software-role');
const heroTitle = document.querySelector('.body-title h1');
const heroDesc = document.querySelector('.body-title p');

let currentRole = 'ai'; // Track current role to avoid redundant triggers

async function updateRoleUI(selectedRole) {
  if (!heroTitle || !heroDesc || !aiRole || !softwareRole) return;
  if (selectedRole === currentRole) return;

  currentRole = selectedRole;

  // Add fade-out effect
  heroTitle.classList.add('fade-out');
  heroDesc.classList.add('fade-out');

  // Wait for fade-out to complete
  await new Promise(resolve => setTimeout(resolve, 300));

  if (selectedRole === 'software') {
    softwareRole.classList.add('active-role');
    aiRole.classList.remove('active-role');
    heroTitle.innerHTML = 'Software Engineer<br>Building Robust, Maintainable Software.';
    heroDesc.textContent = 'I build production-grade applications and services with clean architecture, strong testing, and scalable infrastructure. Skilled in API design, performance optimization, and deployment pipelines that keep systems reliable in production.';
  } else {
    aiRole.classList.add('active-role');
    softwareRole.classList.remove('active-role');
    heroTitle.innerHTML = 'AI/ML Engineer<br>Turning Data Into Impactful Systems.';
    heroDesc.textContent = 'I design, train, and productionize machine learning systems that solve real-world problems — from feature engineering and model training to scalable inference, observability, and continuous improvement on cloud-native platforms.';
  }

  // Remove fade-out and trigger fade-in
  heroTitle.classList.remove('fade-out');
  heroDesc.classList.remove('fade-out');
  heroTitle.classList.add('fade-in');
  heroDesc.classList.add('fade-in');

  // Clean up fade-in class
  setTimeout(() => {
    heroTitle.classList.remove('fade-in');
    heroDesc.classList.remove('fade-in');
  }, 400);

  // Update skills filter
  filterSkills(selectedRole);
}

// Show/hide skill cards and categories based on the current role
function filterSkills(showRole) {
  const categories = document.querySelectorAll('.skill-category');
  if (!categories) return;

  categories.forEach(category => {
    let visibleInThisCategory = 0;
    const cards = category.querySelectorAll('.skill-card');

    cards.forEach(card => {
      const rolesAttr = card.getAttribute('data-roles');
      if (!rolesAttr) {
        card.classList.remove('hidden-role');
        visibleInThisCategory++;
        return;
      }
      const roles = rolesAttr.split(/\s+/);
      if (roles.includes(showRole)) {
        card.classList.remove('hidden-role');
        visibleInThisCategory++;
      } else {
        card.classList.add('hidden-role');
      }
    });

    // Hide the whole category if no skills are visible in it
    if (visibleInThisCategory === 0) {
      category.style.display = 'none';
    } else {
      category.style.display = 'block';
    }
  });
}

// Attach hover listeners
if (aiRole) {
  aiRole.addEventListener('mouseenter', () => updateRoleUI('ai'));
}
if (softwareRole) {
  softwareRole.addEventListener('mouseenter', () => updateRoleUI('software'));
}

// Initialize
filterSkills('ai');

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// IntersectionObserver to animate skills into view
(function animateSkills() {
  const cards = Array.from(document.querySelectorAll('.skill-card'));
  if (!cards.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = cards.indexOf(entry.target);
        const delay = Math.min(idx * 60, 400);
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  });
  cards.forEach(c => observer.observe(c));
})();

// Render SVG thumbnails to PNG data URLs (improves raster look and lets us keep generated assets in SVG)
(function rasterizeProjectThumbnails() {
  if (!('fetch' in window) || !('createElement' in document)) return;
  const thumbnails = document.querySelectorAll('.project-thumbnail');
  thumbnails.forEach(img => {
    const src = img.getAttribute('src') || '';
    if (!src.endsWith('.svg')) return;
    fetch(src).then(r => r.text()).then(svgText => {
      const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(800, image.width);
        canvas.height = Math.max(480, image.height);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        try { img.src = canvas.toDataURL('image/png'); } catch (e) { console.warn('Rasterize failed', e); }
        URL.revokeObjectURL(url);
      };
      image.onerror = () => URL.revokeObjectURL(url);
      image.src = url;
    }).catch(() => { });
  });
})();

// Make thumbnail overlay clickable: forward click to project's GitHub button


// Scroll Reveal: add 'active' class to elements when they enter the viewport
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // If you want it to re-animate when scrolling back up/down, remove the unobserve
        // For now, consistent with performance best practices, we only animate once.
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the viewport
  });

  revealElements.forEach(el => observer.observe(el));
})();

// Custom Cursor Follow Logic
(function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (!dot || !outline) return;

  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;

    // Global CSS variables for spotlight
    document.documentElement.style.setProperty('--mouse-x', `${posX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${posY}px`);

    // Outline with smooth follow
    outline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });

  // Cursor Hover Effect
  const interactiveElements = document.querySelectorAll('a, button, .role-option, .skill-card, .project-card, .cv-button, .hero-btn, .project-button');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => outline.classList.remove('cursor-hover'));
  });
})();

// Proximity Glow for skills
(function initProximityGlow() {
  const skillsSection = document.querySelector('.skills-section');
  if (!skillsSection) return;

  window.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.skill-card:not(.hidden-role)');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - cardCenterX;
      const deltaY = e.clientY - cardCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const maxDistance = 250; // Distance at which glow starts
      if (distance < maxDistance) {
        const intensity = 1 - (distance / maxDistance);
        card.style.setProperty('--proximity-intensity', intensity);

        // Tilt effect
        const tiltIntensity = intensity * 15; // Max 15 degrees
        const tiltX = (deltaY / maxDistance) * -tiltIntensity;
        const tiltY = (deltaX / maxDistance) * tiltIntensity;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${1 + intensity * 0.05})`;
      } else {
        card.style.setProperty('--proximity-intensity', 0);
        if (!card.matches(':hover')) {
          card.style.transform = '';
        }
      }
    });
  });
})();

// Magnetic Buttons Logic (Includes Social Icons)
(function initMagneticButtons() {
  const buttons = document.querySelectorAll('.hero-btn, .cv-button, .project-button, .social-media a, .footer-right a');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const position = btn.getBoundingClientRect();
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseout', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });
})();

console.log('Ehtesham portfolio scripts loaded v2');

// Gallery Lightbox
window.openLightbox = function (item) {
  const img = item.querySelector('img');
  const modal = document.getElementById('lightbox');
  const modalImg = document.getElementById('lightbox-img');

  if (modal && modalImg && img) {
    modal.style.display = "block";
    modalImg.src = img.src;
    document.body.style.overflow = "hidden"; // Prevent scroll
  }
}

window.closeLightbox = function () {
  const modal = document.getElementById('lightbox');
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Close lightbox on click outside image
window.onclick = function (event) {
  const modal = document.getElementById('lightbox');
  if (event.target == modal) {
    closeLightbox();
  }
}
