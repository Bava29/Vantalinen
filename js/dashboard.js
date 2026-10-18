(() => {
    const root = document.documentElement;
    const sidebar = document.getElementById('dashboardSidebar');
    const menuButton = document.querySelector('[data-menu-toggle]');
    const overlay = document.querySelector('[data-sidebar-overlay]');
    const notificationToggle = document.querySelector('[data-notification-toggle]');
    const notificationPopover = document.querySelector('[data-notification-popover]');
    const logoutModal = document.querySelector('[data-logout-modal]');
    const read = (key, fallback) => {
        try { return localStorage.getItem(key) || fallback; }
        catch { return fallback; }
    };
    const save = (key, value) => {
        try { localStorage.setItem(key, value); }
        catch { /* The display controls still work without storage. */ }
    };

    root.classList.toggle('dark-mode', read('vantalinen-theme', 'light') === 'dark');
    root.setAttribute('dir', read('vantalinen-direction', 'ltr'));

    const syncControls = () => {
        const dark = root.classList.contains('dark-mode');
        document.querySelectorAll('[data-theme-toggle]').forEach(button => {
            const icon = button.querySelector('i');
            icon.classList.toggle('fa-moon', !dark);
            icon.classList.toggle('fa-sun', dark);
            button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
            button.title = dark ? 'Light Mode' : 'Dark Mode';
        });
        const rtl = root.getAttribute('dir') === 'rtl';
        document.querySelectorAll('[data-dir-toggle]').forEach(button => {
            button.setAttribute('aria-label', rtl ? 'Switch to LTR layout' : 'Switch to RTL layout');
            button.title = rtl ? 'LTR Mode' : 'RTL Mode';
        });
    };

    document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => {
        const dark = !root.classList.contains('dark-mode');
        root.classList.toggle('dark-mode', dark);
        save('vantalinen-theme', dark ? 'dark' : 'light');
        syncControls();
    }));
    document.querySelectorAll('[data-dir-toggle]').forEach(button => button.addEventListener('click', () => {
        const direction = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
        root.setAttribute('dir', direction);
        save('vantalinen-direction', direction);
        syncControls();
    }));

    const closeSidebar = () => {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        menuButton.classList.remove('is-active');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('sidebar-open');
    };
    menuButton.addEventListener('click', () => {
        const open = !sidebar.classList.contains('is-open');
        sidebar.classList.toggle('is-open', open);
        overlay.classList.toggle('is-visible', open);
        menuButton.classList.toggle('is-active', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('sidebar-open', open);
    });
    overlay.addEventListener('click', closeSidebar);
    sidebar.querySelectorAll('.nav-item').forEach(link => link.addEventListener('click', closeSidebar));

    const closeNotifications = () => {
        notificationPopover.hidden = true;
        notificationToggle.setAttribute('aria-expanded', 'false');
    };
    notificationToggle.addEventListener('click', event => {
        event.stopPropagation();
        const open = notificationPopover.hidden;
        notificationPopover.hidden = !open;
        notificationToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', event => {
        if (!notificationPopover.contains(event.target) && !notificationToggle.contains(event.target)) closeNotifications();
    });
    document.querySelectorAll('[data-profile-button], [data-profile-link]').forEach(button => button.addEventListener('click', () => {
        closeNotifications();
        document.getElementById('profile').scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeSidebar();
    }));

    const openLogout = () => {
        logoutModal.hidden = false;
        document.querySelector('[data-logout-cancel]').focus();
    };
    const closeLogout = () => {
        logoutModal.hidden = true;
        document.querySelector('[data-logout-open]').focus();
    };
    document.querySelector('[data-logout-open]').addEventListener('click', openLogout);
    document.querySelector('[data-logout-cancel]').addEventListener('click', closeLogout);
    logoutModal.addEventListener('click', event => { if (event.target === logoutModal) closeLogout(); });
    document.querySelector('[data-logout-confirm]').addEventListener('click', () => { window.location.href = 'login.html'; });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        if (!logoutModal.hidden) closeLogout();
        closeNotifications();
        closeSidebar();
    });
    document.querySelectorAll('[data-year]').forEach(node => node.textContent = new Date().getFullYear());
    const today = document.querySelector('[data-today]');
    if (today) today.textContent = new Intl.DateTimeFormat('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase();
    syncControls();
})();
