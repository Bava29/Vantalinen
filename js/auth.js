(() => {
  const root = document.documentElement;
  const read = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Keep the current page usable if storage is unavailable. */ } };

  root.classList.toggle('dark-mode', read('vantalinen-theme', 'light') === 'dark');
  root.setAttribute('dir', read('vantalinen-direction', 'ltr'));

  const syncToggleLabels = () => {
    const isDark = root.classList.contains('dark-mode');
    document.querySelectorAll('.brand img').forEach(logo => {
      logo.src = isDark ? 'images/logo-white.png' : 'images/logo.png';
    });
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      const icon = button.querySelector('i');
      icon.classList.toggle('fa-moon', !isDark);
      icon.classList.toggle('fa-sun', isDark);
      button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      button.setAttribute('title', isDark ? 'Light Mode' : 'Dark Mode');
    });
    const isRtl = root.getAttribute('dir') === 'rtl';
    document.querySelectorAll('[data-dir-toggle]').forEach(button => {
      button.setAttribute('aria-label', isRtl ? 'Switch to LTR layout' : 'Switch to RTL layout');
      button.setAttribute('title', isRtl ? 'LTR Mode' : 'RTL Mode');
    });
  };

  document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => {
    const isDark = !root.classList.contains('dark-mode');
    root.classList.toggle('dark-mode', isDark);
    save('vantalinen-theme', isDark ? 'dark' : 'light');
    syncToggleLabels();
  }));
  document.querySelectorAll('[data-dir-toggle]').forEach(button => button.addEventListener('click', () => {
    const direction = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
    root.setAttribute('dir', direction);
    save('vantalinen-direction', direction);
    syncToggleLabels();
  }));
  document.querySelectorAll('[data-password-toggle]').forEach(button => button.addEventListener('click', () => {
    const input = button.closest('.input-wrap').querySelector('input');
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    button.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    button.querySelector('i').className = `fa-regular ${visible ? 'fa-eye-slash' : 'fa-eye'}`;
  }));
  document.querySelectorAll('[data-demo-link]').forEach(link => link.addEventListener('click', event => event.preventDefault()));
  document.querySelectorAll('[data-auth-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const password = form.querySelector('[name="password"]');
    const confirmPassword = form.querySelector('[name="confirmPassword"]');
    if (confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity('Passwords do not match.');
      confirmPassword.reportValidity();
      confirmPassword.addEventListener('input', () => confirmPassword.setCustomValidity(''), { once: true });
      return;
    }
    form.querySelector('.form-message').textContent = 'Your form is ready. Connect an authentication service to enable account access.';
  }));
  document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
  syncToggleLabels();
})();
