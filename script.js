// i heard vanilla i thought i was js — still no frameworks 😎

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover)').matches;

// Boot loader
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');
const bootCmd = 'npm run simon --dream-in-code';
let b = 0;
const boot = () => {
    if (b <= bootCmd.length) {
        loaderText.textContent = bootCmd.slice(0, b++);
        setTimeout(boot, reduceMotion ? 0 : 35);
    } else {
        setTimeout(() => {
            loader.classList.add('done');
            startTyping();
        }, 250);
    }
};
boot();
// never let the loader block the page
setTimeout(() => loader.classList.contains('done') || (loader.classList.add('done'), startTyping()), 3500);

// Mobile menu toggle
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Close mobile menu after clicking
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});

// Header, scroll progress & active nav link
const header = document.getElementById('header');
const progress = document.getElementById('scrollProgress');
const sections = [...document.querySelectorAll('main section[id]')];
const navAnchors = [...navLinks.querySelectorAll('a')];

const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    let current = sections[0].id;
    sections.forEach(s => {
        if (y >= s.offsetTop - window.innerHeight / 3) current = s.id;
    });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Typing effect — cycles through roles
const roles = ['Software Engineer', 'Full-stack Developer', 'AI & ML Builder', 'Database Designer', 'Basketball Enthusiast 🏀'];
const typed = document.getElementById('typed');
let typingStarted = false;

function startTyping() {
    if (typingStarted) return;
    typingStarted = true;
    let r = 0, i = 0, deleting = false;
    const tick = () => {
        const word = roles[r];
        typed.textContent = word.slice(0, i);
        if (!deleting && i < word.length) {
            i++;
            setTimeout(tick, 80);
        } else if (!deleting) {
            deleting = true;
            setTimeout(tick, 1800);
        } else if (i > 0) {
            i--;
            setTimeout(tick, 40);
        } else {
            deleting = false;
            r = (r + 1) % roles.length;
            setTimeout(tick, 300);
        }
    };
    tick();
}

// Intersection Observer for reveal animations + stat counters
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in');
        el.querySelectorAll('[data-count]').forEach(countUp);
        revealObserver.unobserve(el);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, idx) => {
    // stagger siblings for a cascading effect
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = Math.min(siblings.indexOf(el), 6) * 80 + 'ms';
    revealObserver.observe(el);
});

function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    const start = performance.now();
    const step = now => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// Cursor glow + card spotlight
const glow = document.getElementById('cursorGlow');
if (finePointer && !reduceMotion) {
    window.addEventListener('pointermove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    }, { passive: true });
}

document.querySelectorAll('.spot').forEach(card => {
    card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', e.clientX - r.left + 'px');
        card.style.setProperty('--my', e.clientY - r.top + 'px');
    });
});

// 3D tilt on hero photo + project cards
if (finePointer && !reduceMotion) {
    document.querySelectorAll('.tilt').forEach(el => {
        const strength = el.id === 'holoCard' ? 10 : 5;
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            el.style.transform = `rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`;
        });
        el.addEventListener('pointerleave', () => el.style.transform = '');
    });

    // Magnetic buttons
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('pointermove', e => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('pointerleave', () => btn.style.transform = '');
    });
}

// Galaxy — interactive particle network (the galaxy lives on)
const canvas = document.getElementById('galaxy');
const ctx = canvas.getContext('2d');
let W, H, particles = [], stars = [];
const mouse = { x: -9999, y: -9999 };

function initGalaxy() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(Math.floor((W * H) / 16000), 90);
    particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.6,
        hue: Math.random() < 0.5 ? '34,211,238' : '139,92,246'
    }));
    stars = Array.from({ length: Math.floor((W * H) / 5000) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.9,
        a: Math.random(),
        s: Math.random() * 0.02 + 0.003
    }));
}

function drawGalaxy() {
    ctx.clearRect(0, 0, W, H);

    // nebula
    const g1 = ctx.createRadialGradient(W * 0.85, H * 0.1, 0, W * 0.85, H * 0.1, W * 0.55);
    g1.addColorStop(0, 'rgba(139,92,246,0.18)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(W * 0.1, H * 0.9, 0, W * 0.1, H * 0.9, W * 0.5);
    g2.addColorStop(0, 'rgba(34,211,238,0.10)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    // twinkling stars
    stars.forEach(s => {
        s.a += s.s;
        ctx.fillStyle = `rgba(255,255,255,${0.25 + Math.abs(Math.sin(s.a)) * 0.6})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    });

    // particle network
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // gentle pull towards the cursor
        const dxm = mouse.x - p.x, dym = mouse.y - p.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 180) {
            p.x += dxm * 0.004;
            p.y += dym * 0.004;
        }

        ctx.fillStyle = `rgba(${p.hue},0.9)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 130) {
                ctx.strokeStyle = `rgba(${p.hue},${(1 - d / 130) * 0.22})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        }
        if (dm < 180) {
            ctx.strokeStyle = `rgba(244,114,182,${(1 - dm / 180) * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
    if (!reduceMotion) requestAnimationFrame(drawGalaxy);
}

initGalaxy();
drawGalaxy();
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { initGalaxy(); if (reduceMotion) drawGalaxy(); }, 150);
});
window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

// Live GitHub repos
const langColors = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c',
    Python: '#3572A5', Java: '#b07219', Shell: '#89e051'
};
const repoList = document.getElementById('repoList');

fetch('https://api.github.com/users/SimonpeterW/repos?sort=pushed&per_page=12')
    .then(res => res.ok ? res.json() : Promise.reject(res.status))
    .then(repos => {
        const picks = repos
            .filter(r => !r.fork && r.name !== 'SimonpeterW')
            .slice(0, 6);
        if (!picks.length) throw new Error('no repos');
        repoList.innerHTML = '';
        picks.forEach(r => {
            const a = document.createElement('a');
            a.className = 'repo';
            a.href = r.html_url;
            a.target = '_blank';
            a.rel = 'noopener';

            const name = document.createElement('div');
            name.className = 'repo-name';
            name.textContent = r.name;

            const desc = document.createElement('div');
            desc.className = 'repo-desc';
            desc.textContent = r.description || 'No description yet — click to explore the code.';

            const meta = document.createElement('div');
            meta.className = 'repo-meta';
            if (r.language) {
                const lang = document.createElement('span');
                const dot = document.createElement('i');
                dot.className = 'lang-dot';
                dot.style.background = langColors[r.language] || '#8b90b0';
                lang.append(dot, r.language);
                meta.append(lang);
            }
            const updated = document.createElement('span');
            updated.textContent = 'updated ' + new Date(r.pushed_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            meta.append(updated);

            a.append(name, desc, meta);
            repoList.append(a);
        });
    })
    .catch(() => {
        repoList.innerHTML = '<a class="repo" href="https://github.com/SimonpeterW" target="_blank" rel="noopener"><div class="repo-name">github.com/SimonpeterW</div><div class="repo-desc">Browse all repositories on GitHub →</div></a>';
    });

// Toast helper
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// Form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Simulate form submission
    showToast(`✅ Thanks ${data.name.split(' ')[0]}! I'll get back to you soon.`);
    contactForm.reset();
});

// Command palette (Ctrl/⌘ + K)
const palette = document.getElementById('palette');
const paletteInput = document.getElementById('paletteInput');
const paletteList = document.getElementById('paletteList');
const go = id => () => document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
const open = url => () => window.open(url, '_blank', 'noopener');
const commands = [
    { label: 'Go to Home', hint: 'section', run: go('home') },
    { label: 'Go to About', hint: 'section', run: go('about') },
    { label: 'Go to Services', hint: 'section', run: go('services') },
    { label: 'Go to Projects', hint: 'section', run: go('projects') },
    { label: 'Go to Contact / Hire me', hint: 'section', run: go('contact') },
    { label: 'Download CV', hint: 'file', run: () => { const a = document.createElement('a'); a.href = 'CV simon.docx'; a.download = ''; a.click(); } },
    { label: 'Open GitHub', hint: 'link', run: open('https://github.com/SimonpeterW') },
    { label: 'Open LinkedIn', hint: 'link', run: open('https://www.linkedin.com/in/simonpeterfullstacksoftwareengineer/') },
    { label: 'Open LeetCode', hint: 'link', run: open('https://leetcode.com/u/simon_peter/') },
    { label: 'Open CodeWars', hint: 'link', run: open('https://www.codewars.com/users/simonpeter%20waithaka%20') },
    { label: 'Open X / Twitter', hint: 'link', run: open('https://x.com/simonpeterfa') },
    { label: 'Open Instagram', hint: 'link', run: open('https://www.instagram.com/simonpeterfa/') },
    { label: 'Play basketball video 🏀', hint: 'fun', run: () => { go('about')(); if (document.getElementById('videoPlayer').hidden) toggleVideo(); } }
];
let filtered = commands, selIdx = 0;

function renderPalette() {
    const q = paletteInput.value.toLowerCase().trim();
    filtered = commands.filter(c => c.label.toLowerCase().includes(q));
    selIdx = Math.min(selIdx, Math.max(filtered.length - 1, 0));
    paletteList.innerHTML = '';
    filtered.forEach((c, i) => {
        const li = document.createElement('li');
        li.className = i === selIdx ? 'sel' : '';
        li.innerHTML = '<span></span><small></small>';
        li.firstChild.textContent = c.label;
        li.lastChild.textContent = c.hint;
        li.addEventListener('click', () => runCommand(i));
        li.addEventListener('mousemove', () => { if (selIdx !== i) { selIdx = i; renderPalette(); } });
        paletteList.append(li);
    });
    if (!filtered.length) paletteList.innerHTML = '<li>No results</li>';
}
function openPalette() {
    palette.hidden = false;
    paletteInput.value = '';
    selIdx = 0;
    renderPalette();
    paletteInput.focus();
}
function closePalette() { palette.hidden = true; }
function runCommand(i) {
    const c = filtered[i];
    closePalette();
    if (c) c.run();
}

document.getElementById('openPalette').addEventListener('click', openPalette);
palette.addEventListener('click', e => { if (e.target === palette) closePalette(); });
paletteInput.addEventListener('input', () => { selIdx = 0; renderPalette(); });
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        palette.hidden ? openPalette() : closePalette();
    } else if (!palette.hidden) {
        if (e.key === 'Escape') closePalette();
        else if (e.key === 'ArrowDown') { e.preventDefault(); selIdx = (selIdx + 1) % filtered.length; renderPalette(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); selIdx = (selIdx - 1 + filtered.length) % filtered.length; renderPalette(); }
        else if (e.key === 'Enter') runCommand(selIdx);
    }
});

document.getElementById('year').textContent = new Date().getFullYear();

//Media Player

function playAudio() {
    const audio = document.getElementById('audioPlayer');
    const btn = document.getElementById('audioBtn');
    if (audio.paused) {
        audio.play();
        btn.textContent = '⏸️ Pause Audio';
    } else {
        audio.pause();
        btn.textContent = '🎵 Play Audio';
    }
}

function toggleVideo() {
    const video = document.getElementById('videoPlayer');
    const btn = document.getElementById('videoBtn');
    if (video.hidden) {
        video.hidden = false;
        video.play();
        btn.textContent = '❌ Hide Video';
    } else {
        video.hidden = true;
        video.pause();
        btn.textContent = '🎬 Play Video';
    }
}

function rate(type, stars) {
    const ratingEl = document.getElementById(type + 'Rating');
    ratingEl.textContent = `${stars}/5 — thanks!`;

    // Highlight selected stars
    const starEls = ratingEl.parentElement.querySelectorAll('span:not(.rating-label)');
    starEls.forEach((star, i) => star.classList.toggle('on', i < stars));
}
