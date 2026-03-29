/**
 * Debian AI Starter - Modern Website Scripts v2.5
 * ---------------------------------------------
 * Fully functional: Connects to backend, AI Marketplace, and agents.
 */

document.addEventListener('DOMContentLoaded', () => {
    // API Endpoint Base
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

    // 2. Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.innerText = mobileNav.classList.contains('active') ? '✕' : '☰';
    });

    // 3. Smooth Scrolling
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a, .hero .btn');
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
                    // Close mobile nav if open
                    mobileNav.classList.remove('active');
                    mobileMenuBtn.innerText = '☰';
                }
            }
        });
    });

    // 4. Contact Form Submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

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
                alert("Error: Backend connection failed.");
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // 5. AI Service Cards - Trigger AI insights
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', async () => {
            const serviceName = card.querySelector('h3').innerText;
            const prompt = card.dataset.prompt || `Explain ${serviceName} for Debian.`;
            const originalContent = card.innerHTML;

            card.innerHTML = `<p style="color: var(--primary); font-weight: 500;">AI thinking...</p>`;

            try {
                const response = await fetch(`${API_BASE}/run`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt })
                });

                if (response.ok) {
                    const data = await response.json();
                    card.innerHTML = `<h3>${serviceName}</h3><p style="font-style: italic; color: var(--text-muted); font-size: 0.9rem;">${data.output}</p>`;
                    setTimeout(() => { card.innerHTML = originalContent; }, 20000); // Revert after 20s
                } else {
                    throw new Error();
                }
            } catch (err) {
                card.innerHTML = `<h3>${serviceName}</h3><p style="color: #ef4444; font-size: 0.8rem;">Ollama or Backend is offline. Please check setup.sh</p>`;
                setTimeout(() => { card.innerHTML = originalContent; }, 5000);
            }
        });
    });

    // 6. Agent Marketplace - Download Logic
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const agentName = btn.dataset.agent;
            if (!agentName) return;

            const originalBtnText = btn.innerText;
            btn.innerText = "Downloading...";
            btn.disabled = true;

            try {
                // Construct download URL
                const downloadUrl = `${API_BASE}/download/${agentName}`;

                // Trigger the browser download by creating a hidden anchor
                const response = await fetch(downloadUrl);
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = agentName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    btn.innerText = "Agent Downloaded!";
                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error("Download failed.");
                }
            } catch (err) {
                alert("Error downloading agent. Make sure the backend is running.");
                btn.innerText = originalBtnText;
                btn.disabled = false;
            }
        });
    });

    // 7. Navbar Shadows on Scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 20) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '1rem 0';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            navbar.style.padding = '1.25rem 0';
        }
    });

    // 8. Health Check
    async function checkHealth() {
        try {
            const res = await fetch(`${API_BASE}/health`);
            if (res.ok) console.log("System connection established.");
        } catch (e) {
            console.warn("FastAPI backend is offline. Local AI functions disabled.");
        }
    }
    checkHealth();
});
