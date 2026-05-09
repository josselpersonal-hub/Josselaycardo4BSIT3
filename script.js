document.addEventListener('DOMContentLoaded', () => {

    // ── CUSTOM CURSOR ──
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    let mouseX = 0, mouseY = 0, outX = 0, outY = 0;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; });
    (function animateCursor() { outX += (mouseX - outX) * 0.12; outY += (mouseY - outY) * 0.12; outline.style.left = outX + 'px'; outline.style.top = outY + 'px'; requestAnimationFrame(animateCursor); })();
    document.querySelectorAll('a,button,.project-card,.skill-card').forEach(el => {
        el.addEventListener('mouseenter', () => { outline.style.width = '54px'; outline.style.height = '54px'; outline.style.borderColor = 'rgba(124,58,237,.8)'; });
        el.addEventListener('mouseleave', () => { outline.style.width = '36px'; outline.style.height = '36px'; outline.style.borderColor = 'rgba(124,58,237,.5)'; });
    });

    // ── NAVBAR ──
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const overlay = document.getElementById('mobile-overlay');
    window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 60); });
    hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navLinks.classList.toggle('active'); overlay.classList.toggle('active'); });
    overlay.addEventListener('click', () => { hamburger.classList.remove('active'); navLinks.classList.remove('active'); overlay.classList.remove('active'); });
    document.querySelectorAll('.nav-link').forEach(link => { link.addEventListener('click', () => { hamburger.classList.remove('active'); navLinks.classList.remove('active'); overlay.classList.remove('active'); }); });

    // ── ACTIVE NAV LINK ──
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
        navItems.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
    });

    // ── TYPEWRITER ──
    const words = ['Software Developer', 'Android Developer', 'Web Developer', 'BSIT Student', 'Problem Solver'];
    let wIdx = 0, cIdx = 0, deleting = false;
    const tw = document.getElementById('typewriter');
    function type() {
        const w = words[wIdx];
        tw.textContent = deleting ? w.substring(0, --cIdx) : w.substring(0, ++cIdx);
        let speed = deleting ? 50 : 90;
        if (!deleting && cIdx === w.length) { speed = 2000; deleting = true; }
        else if (deleting && cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; speed = 400; }
        setTimeout(type, speed);
    }
    setTimeout(type, 600);

    // ── SCROLL REVEAL ──
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealUps = document.querySelectorAll('.reveal-up');
    const aosEls = document.querySelectorAll('[data-aos]');
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const delay = e.target.style.getPropertyValue('--delay') || '0s';
                setTimeout(() => e.target.classList.add('visible'), parseFloat(delay) * 1000);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    [...revealEls, ...revealUps].forEach(el => io.observe(el));

    const ioAos = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-visible'); ioAos.unobserve(e.target); }});
    }, { threshold: 0.1 });
    aosEls.forEach(el => ioAos.observe(el));

    // ── COUNTER ANIMATION ──
    const counters = document.querySelectorAll('.stat-number');
    const ioCount = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const target = +e.target.dataset.target;
                let count = 0;
                const inc = target / 40;
                const timer = setInterval(() => { count = Math.min(count + inc, target); e.target.textContent = Math.floor(count); if (count >= target) clearInterval(timer); }, 40);
                ioCount.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => ioCount.observe(c));

    // ── PROFILE PHOTO FALLBACK ──
    const profilePhotos = document.querySelectorAll('.profile-photo, .about-photo');
    profilePhotos.forEach(img => {
        img.onerror = function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:white;';
            placeholder.innerHTML = '<i class="fas fa-user"></i>';
            this.parentElement.appendChild(placeholder);
        };
    });

    // ── CONTACT FORM ──
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim() || 'Portfolio Contact';
        const message = document.getElementById('message').value.trim();
        if (!name || !email || !message) {
            statusEl.textContent = 'Please fill in all required fields.';
            statusEl.className = 'form-status status-error'; return;
        }
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening Email...';
        submitBtn.disabled = true;

        // Build mailto link — opens Gmail/email client with message pre-filled
        const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
        const mailtoLink = `mailto:jossel.personal@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;

        setTimeout(() => {
            statusEl.textContent = '✓ Your email client opened! Finish sending from there.';
            statusEl.className = 'form-status status-success';
            form.reset();
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            submitBtn.disabled = false;
            setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'form-status'; }, 6000);
        }, 1000);
    });


    // ── INITIAL HERO ANIMATION ──
    const heroText = document.querySelector('.hero-text');
    const heroImg = document.querySelector('.hero-image-wrap');
    setTimeout(() => { if(heroText) { heroText.style.opacity='1'; heroText.style.transform='translateX(0)'; } }, 100);
    setTimeout(() => { if(heroImg) { heroImg.style.opacity='1'; heroImg.style.transform='translateX(0)'; } }, 300);
});
