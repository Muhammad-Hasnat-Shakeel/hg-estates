$(function () {

  const html = document.documentElement;
  const themeToggleBtn = $('#theme-toggle');
  const THEME_KEY = 'hg_estates_theme';

  function applyTheme(theme) {
    if (theme === 'light') {
      html.classList.add('light');
      themeToggleBtn.html('<i class="bx bx-sun text-xl"></i>');
    } else {
      html.classList.remove('light');
      themeToggleBtn.html('<i class="bx bx-moon text-xl"></i>');
    }
  }

  // Load saved theme on page load (default = dark)
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);

  // Toggle on click
  themeToggleBtn.on('click', function () {
    const isLight = html.classList.contains('light');
    const newTheme = isLight ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  });

});