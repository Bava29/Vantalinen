
/* =========================================
   VANTALINEN HEADER FUNCTIONALITY
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("mainNavigation");

    // Mark the link matching this document as current in every navigation layout.
    if (navigation) {
        const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
        const currentPage = currentPath.split("/").pop() || "index.html";

        navigation.querySelectorAll(".vl-nav-list a").forEach(link => {
            const linkUrl = new URL(link.href, window.location.href);
            const linkPath = linkUrl.pathname.replace(/\/+$/, "") || "/";
            const linkPage = linkPath.split("/").pop() || "index.html";
            const isCurrent = linkUrl.origin === window.location.origin &&
                (linkPath === currentPath || (currentPage === "index.html" && linkPage === "index.html"));

            link.classList.toggle("active", isCurrent);
            if (isCurrent) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    const themeButtons = [
        document.getElementById("desktopThemeToggle"),
        document.getElementById("mobileThemeToggle")
    ].filter(Boolean);

    const rtlButtons = [
        document.getElementById("desktopRtlToggle"),
        document.getElementById("mobileRtlToggle")
    ].filter(Boolean);


    /* =====================================
       MOBILE / TABLET MENU
    ===================================== */

    function closeMenu() {
        if (!menuToggle || !navigation) return;

        navigation.classList.remove("open");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    function openMenu() {
        if (!menuToggle || !navigation) return;

        navigation.classList.add("open");
        menuToggle.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    }

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", () => {
            const isOpen = navigation.classList.contains("open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close after clicking a navigation link
        navigation.querySelectorAll(".vl-nav-list a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        // Close when clicking outside the header
        document.addEventListener("click", event => {
            const header = document.getElementById("siteHeader");

            if (header && !header.contains(event.target)) {
                closeMenu();
            }
        });

        // Close with Escape
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Reset mobile menu when returning to desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024) {
                closeMenu();
            }
        });
    }


    /* =====================================
       DARK MODE
    ===================================== */

    function updateThemeButtons() {
        const isDark = document.documentElement.classList.contains("dark-mode");

        themeButtons.forEach(button => {
            const icon = button.querySelector("i");
            const label = button.querySelector("span");

            if (icon) {
                icon.classList.toggle("fa-moon", !isDark);
                icon.classList.toggle("fa-sun", isDark);
            }

            button.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );

            button.setAttribute(
                "title",
                isDark ? "Light Mode" : "Dark Mode"
            );

            if (label) {
                label.textContent = isDark ? "Light Mode" : "Dark Mode";
            }
        });
    }

    function setTheme(isDark) {
        document.documentElement.classList.toggle("dark-mode", isDark);

        try {
            localStorage.setItem("vantalinen-theme", isDark ? "dark" : "light");
        } catch (error) {
            // Theme still works if storage is unavailable
        }

        updateThemeButtons();
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem("vantalinen-theme") || "light";
    } catch (error) {
        // Use light mode by default
    }

    setTheme(savedTheme === "dark");

    themeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const isDark = document.documentElement.classList.contains("dark-mode");
            setTheme(!isDark);
        });
    });


    /* =====================================
       RTL MODE
    ===================================== */

    function updateRtlButtons() {
        const isRtl = document.documentElement.getAttribute("dir") === "rtl";

        rtlButtons.forEach(button => {
            const label = button.querySelector("span");

            button.setAttribute(
                "aria-label",
                isRtl ? "Switch to LTR layout" : "Switch to RTL layout"
            );

            button.setAttribute(
                "title",
                isRtl ? "LTR Mode" : "RTL Mode"
            );

            if (label) {
                label.textContent = isRtl ? "LTR Mode" : "RTL Mode";
            }
        });
    }

    function setDirection(isRtl) {
        document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");

        try {
            localStorage.setItem("vantalinen-direction", isRtl ? "rtl" : "ltr");
        } catch (error) {
            // Direction still works if storage is unavailable
        }

        updateRtlButtons();
    }

    let savedDirection = "ltr";

    try {
        savedDirection = localStorage.getItem("vantalinen-direction") || "ltr";
    } catch (error) {
        // Use LTR by default
    }

    setDirection(savedDirection === "rtl");

    rtlButtons.forEach(button => {
        button.addEventListener("click", () => {
            const isRtl = document.documentElement.getAttribute("dir") === "rtl";
            setDirection(!isRtl);
        });
    });

});


/* VantaLinen Footer Year */
document.addEventListener("DOMContentLoaded", function () {
    const yearElement = document.getElementById("vl-footer-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// VantaLinen FAQ Accordion
document.querySelectorAll(".vl-faq-item").forEach((item) => {
    item.addEventListener("toggle", () => {
        if (!item.open) return;

        document.querySelectorAll(".vl-faq-item").forEach((otherItem) => {
            if (otherItem !== item) {
                otherItem.open = false;
            }
        });
    });
});