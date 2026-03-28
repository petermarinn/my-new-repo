/**
 * AIStarter - Modern Website Scripts
 * ---------------------------------
 * Handles theme switching, smooth scrolling, and common UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark Mode Toggle
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    }

    darkModeBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // 2. Smooth Scrolling for Navigation Links
    // Note: CSS 'scroll-behavior: smooth' covers most cases,
    // but JS provides more control if needed for older browsers or specific offsets.
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: targetSection.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Simple Form Submission Handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simple validation / UI Feedback
            if (name && email && message) {
                alert(`Thank you, ${name}! Your message has been sent. (Simulated)`);
                contactForm.reset();
            } else {
                alert('Please fill out all fields.');
            }
        });
    }

    // 4. Navbar Background Change on Scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '1rem 0';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            navbar.style.padding = '1.25rem 0';
        }
    });
});
