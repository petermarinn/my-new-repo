/**
 * Debian AI Starter - Modern Website Scripts v2.0
 * ---------------------------------------------
 * Fully functional: Connects to the FastAPI backend and AI CLI.
 */

document.addEventListener('DOMContentLoaded', () => {
    // API Endpoint Base (Modify if hosted elsewhere)
    const API_BASE = "http://localhost:8000/api";

    // 1. Theme Toggle
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) body.setAttribute('data-theme', savedTheme);

    darkModeBtn.addEventListener('click', () => {
        const theme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        if (theme === 'dark') body.setAttribute('data-theme', 'dark');
        else body.removeAttribute('data-theme');
        localStorage.setItem('theme', theme);
    });

    // 2. Smooth Scrolling
    const navLinks = document.querySelectorAll('.nav-links a, .hero .btn');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    window.scrollTo({
                        top: target.offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 3. Contact Form Submission (Async API call)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // Simple UI loading state
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch(`${API_BASE}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                    contactForm.reset();
                } else {
                    throw new Error("Failed to send message.");
                }
            } catch (err) {
                alert("Error: Could not connect to the backend server. Make sure it is running.");
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // 4. "AI Simulation" / Triggering AI from UI
    // Example: Trigger an AI run when clicking a service card
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', async () => {
            const serviceName = card.querySelector('h3').innerText;
            const originalContent = card.innerHTML;

            card.innerHTML = `<p style="color: var(--primary)">AI generating info for ${serviceName}...</p>`;

            try {
                const response = await fetch(`${API_BASE}/run`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: `Briefly explain the benefit of ${serviceName} for a Debian developer.` })
                });

                if (response.ok) {
                    const data = await response.json();
                    card.innerHTML = `<h3>${serviceName}</h3><p style="font-style: italic;">AI Insight: ${data.output}</p>`;
                    setTimeout(() => { card.innerHTML = originalContent; }, 10000); // Revert after 10s
                } else {
                    throw new Error();
                }
            } catch (err) {
                card.innerHTML = `<h3>${serviceName}</h3><p style="color: red;">Error: Backend or AI not reachable.</p>`;
                setTimeout(() => { card.innerHTML = originalContent; }, 3000);
            }
        });
    });

    // 5. Health Check
    async function checkHealth() {
        try {
            const res = await fetch(`${API_BASE}/health`);
            if (res.ok) console.log("Backend connection established.");
        } catch (e) {
            console.warn("Backend not running. AI features will be disabled.");
        }
    }
    checkHealth();
});
