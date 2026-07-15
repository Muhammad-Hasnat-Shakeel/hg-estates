// ===== CUSTOM CURSOR GLOW =====
const cursorGlow = document.createElement('div');
cursorGlow.classList.add('cursor-glow');
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

document.addEventListener('mousedown', () => cursorGlow.classList.add('expanded'));
document.addEventListener('mouseup',   () => cursorGlow.classList.remove('expanded'));

// Hide on mobile (touch devices)
window.matchMedia('(hover: none)').matches && (cursorGlow.style.display = 'none');



// ===== AOS INIT =====
AOS.init({
  duration: 800,
  once: true,
  offset: 80
});

// ===== PRELOADER =====
window.addEventListener('load', function () {
  const bar = document.getElementById('preloader-bar');
  const preloader = document.getElementById('preloader');

  setTimeout(() => { bar.classList.add('fill'); }, 100);

  setTimeout(() => {
    preloader.classList.add('hide');
  }, 1200);
});

// ===== jQuery DEPENDENT CODE =====
$(function () {

  // ----- Navbar scroll effect -----
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 50) {
      $('#main-navbar').addClass('scrolled');
    } else {
      $('#main-navbar').removeClass('scrolled');
    }

    // Back to top button visibility
    if ($(this).scrollTop() > 400) {
      $('#back-to-top').removeClass('opacity-0 pointer-events-none');
    } else {
      $('#back-to-top').addClass('opacity-0 pointer-events-none');
    }
  });

  // ----- Mobile menu toggle -----
  $('#mobile-menu-btn').on('click', function () {
    $('#mobile-menu').slideToggle(250);
    const icon = $(this).find('i');
    icon.toggleClass('bx-menu bx-x');
  });

  // Close mobile menu when a link is clicked
  $('#mobile-menu a').on('click', function () {
    $('#mobile-menu').slideUp(250);
    $('#mobile-menu-btn i').removeClass('bx-x').addClass('bx-menu');
  });

  // ----- Back to top click -----
  $('#back-to-top').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  // ----- Contact form fake submit (frontend only) -----
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    $('#contact-success-msg').removeClass('hidden');
    this.reset();
    setTimeout(() => {
      $('#contact-success-msg').addClass('hidden');
    }, 4000);
  });

  // ----- Hero search button -----
  $('#hero-search-btn').on('click', function () {
    const location = $('#search-location').val();
    const type = $('#search-type').val();
    const budget = $('#search-budget').val();
    const beds = $('#search-beds').val();

    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    if (budget) params.set('budget', budget);
    if (beds) params.set('beds', beds);

    window.location.href = 'properties.html?' + params.toString();
  });

});

// ===== ANIMATED COUNTERS (GSAP + ScrollTrigger) =====
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.counter').forEach((counter) => {
  const target = +counter.getAttribute('data-target');

  ScrollTrigger.create({
    trigger: counter,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to(counter, {
        innerText: target,
        duration: 2,
        ease: 'power2.out',
        snap: { innerText: 1 },
        onUpdate: function () {
          counter.innerText = Math.ceil(counter.innerText).toLocaleString() + '+';
        }
      });
    }
  });
}); 