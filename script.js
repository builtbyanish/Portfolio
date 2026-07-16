/* =============================================
   ANISH PORTFOLIO — script.js  (v3)
   ============================================= */

// ── Cursor glow & Ripple Waves ────────────────
const cursorGlow = document.getElementById('cursor-glow');
let lastX = 0, lastY = 0;
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';

  // Spawn a wave ripple if the cursor moves more than 20px
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist > 20) {
    RIPPLES.push(new Ripple(e.clientX, e.clientY));
    lastX = e.clientX;
    lastY = e.clientY;
  }
});

// ── Navbar scroll ────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Hamburger menu ───────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Animated particle canvas ──────────────────
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, PARTICLES = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Ripple wave class
class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 2;
    this.maxR = 80;
    this.a = 0.6;
    this.speed = 2;
  }
  update() {
    this.r += this.speed;
    this.a = 1 - (this.r / this.maxR);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(239, 68, 68, ${this.a * 0.35})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}
let RIPPLES = [];

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H : (Math.random() > .5 ? -5 : H + 5);
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.a  = Math.random() * 0.6 + 0.2;
    this.color = Math.random() > .5 ? '239,68,68' : '220,38,38';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < -10 || this.x > W+10 || this.y < -10 || this.y > H+10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.a})`;
    ctx.fill();
  }
}
for (let i = 0; i < 90; i++) PARTICLES.push(new Particle());

function drawLines() {
  for (let i = 0; i < PARTICLES.length; i++) {
    for (let j = i+1; j < PARTICLES.length; j++) {
      const dx = PARTICLES[i].x - PARTICLES[j].x;
      const dy = PARTICLES[i].y - PARTICLES[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
        ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
        ctx.strokeStyle = `rgba(239,68,68,${.08*(1-d/120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}
function animate() {
  ctx.clearRect(0, 0, W, H);
  
  // Render ripples
  for (let i = RIPPLES.length - 1; i >= 0; i--) {
    RIPPLES[i].update();
    if (RIPPLES[i].a <= 0) {
      RIPPLES.splice(i, 1);
    } else {
      RIPPLES[i].draw();
    }
  }

  PARTICLES.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}
animate();

// ── Intersection observer reveals ─────────────
const revealEls = document.querySelectorAll('.about-card, .skill-category, .connect-card');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// ── Counter animation ─────────────────────────
function animateCounter(el, targetVal) {
  const target = targetVal !== undefined ? targetVal : parseInt(el.dataset.target, 10);
  if (!target || target <= 0) return;
  const dur  = 1800;
  const start = performance.now();
  function tick(now) {
    const t    = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const staticCounters = document.querySelectorAll('.stat-number[data-target]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const t = parseInt(entry.target.dataset.target, 10);
      if (t > 0) animateCounter(entry.target, t);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: .5 });
staticCounters.forEach(el => counterObs.observe(el));

// ── Active nav highlight ───────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObs.observe(s));

const styleEl = document.createElement('style');
styleEl.textContent = `.nav-link.active{color:var(--text)!important}.nav-link.active::after{width:100%!important}`;
document.head.appendChild(styleEl);

// ── Typing effect ──────────────────────────────
const typedEl  = document.getElementById('typed-name');
const fullName = 'Anish Das';
let typedIdx   = 0;
typedEl.textContent = '';
function typeChar() {
  if (typedIdx < fullName.length) {
    typedEl.textContent += fullName[typedIdx++];
    setTimeout(typeChar, 100);
  }
}
setTimeout(typeChar, 600);

// ── Button ripple ──────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `position:absolute;border-radius:50%;width:0;height:0;background:rgba(255,255,255,.25);
      left:${e.clientX-rect.left}px;top:${e.clientY-rect.top}px;
      transform:translate(-50%,-50%);animation:rippleAnim .6s ease-out forwards;pointer-events:none;`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});
const rStyle = document.createElement('style');
rStyle.textContent = `@keyframes rippleAnim{to{width:200px;height:200px;opacity:0}}`;
document.head.appendChild(rStyle);

// ── 3D tilt on connect cards ───────────────────
document.querySelectorAll('.connect-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    card.style.transform = `perspective(600px) rotateX(${-y*7}deg) rotateY(${x*7}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Scroll indicator hide ──────────────────────
const scrollInd = document.getElementById('scroll-indicator');
window.addEventListener('scroll', () => {
  scrollInd.style.opacity = window.scrollY > 80 ? '0' : '1';
}, { passive: true });

/* =============================================
   GITHUB REPOS — live fetch
   ============================================= */
const GITHUB_USER = 'builtbyanish';
const LANG_COLORS = {
  JavaScript:'#f7df1e', TypeScript:'#3178c6', Python:'#3572A5',
  'C++':'#f34b7d', HTML:'#e34c26', CSS:'#563d7c', Java:'#b07219',
  Go:'#00ADD8', Rust:'#dea584', Ruby:'#701516', Shell:'#89e051',
  Jupyter:'#DA5B0B', Vue:'#41b883', Svelte:'#ff3e00', default:'#8892b0'
};

async function loadGitHubRepos() {
  const grid = document.getElementById('repos-grid');
  try {
    const [reposRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6&type=public`),
      fetch(`https://api.github.com/users/${GITHUB_USER}`)
    ]);
    const repos = await reposRes.json();
    const user  = await userRes.json();

    const ghStatEl = document.getElementById('gh-repo-stat');
    if (ghStatEl && user.public_repos) {
      ghStatEl.dataset.target = user.public_repos;
      animateCounter(ghStatEl, user.public_repos);
    }

    if (!Array.isArray(repos) || repos.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem">No public repositories found.</div>`;
      return;
    }

    grid.innerHTML = '';
    repos.forEach((repo, i) => {
      const card = document.createElement('a');
      card.href   = repo.html_url;
      card.target = '_blank';
      card.rel    = 'noopener noreferrer';
      card.className = 'repo-card';
      const langColor = LANG_COLORS[repo.language] || LANG_COLORS.default;
      const desc  = repo.description || 'No description provided.';
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;
      const lang  = repo.language || 'Unknown';

      card.innerHTML = `
        <div class="repo-header">
          <div class="repo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
              <path d="M8 3v4M16 3v4M3 11h18"/>
            </svg>
          </div>
          <span class="repo-name">${repo.name}</span>
          ${stars > 0 ? `<span class="repo-star">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>${stars}</span>` : ''}
        </div>
        <p class="repo-desc">${desc}</p>
        <div class="repo-footer">
          <span class="repo-lang"><span class="lang-dot" style="background:${langColor}"></span>${lang}</span>
          ${forks > 0 ? `<span class="repo-fork">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7-11v3a7 7 0 0 0 7 7 7 7 0 0 0 7-7V7M12 14v4"/></svg>${forks}</span>` : ''}
        </div>`;

      grid.appendChild(card);
      setTimeout(() => {
        const o = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('visible'), i * 80); o.unobserve(entry.target); }
          });
        }, { threshold: 0.1 });
        o.observe(card);
      }, 100);
    });
  } catch (err) {
    console.error('GitHub API error:', err);
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem;">
      <p>Could not load repositories.</p>
      <a href="https://github.com/${GITHUB_USER}" target="_blank" class="btn btn-secondary" style="margin-top:1rem;display:inline-flex;">View on GitHub ↗</a>
    </div>`;
  }
}
loadGitHubRepos();

/* =============================================
   LEETCODE — multi-API with fallbacks
   ============================================= */
const LC_USER = 'anish1410';
const CIRC    = 2 * Math.PI * 62;

async function loadLeetCode() {
  let total = 0, easy = 0, medium = 0, hard = 0, rank = '—';
  let loaded = false;

  /* ── API 1: alfa-leetcode-api (primary) ── */
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const [solvedRes, profileRes] = await Promise.all([
      fetch(`https://alfa-leetcode-api.onrender.com/${LC_USER}/solved`, { signal: controller.signal }),
      fetch(`https://alfa-leetcode-api.onrender.com/${LC_USER}`,        { signal: controller.signal })
    ]);
    clearTimeout(timer);

    const solved  = await solvedRes.json();
    const profile = await profileRes.json();

    // alfa-leetcode-api returns: { solvedProblem, easySolved, mediumSolved, hardSolved }
    if (solved.solvedProblem !== undefined) {
      total  = solved.solvedProblem || 0;
      easy   = solved.easySolved   || 0;
      medium = solved.mediumSolved || 0;
      hard   = solved.hardSolved   || 0;
      rank   = profile.ranking     || profile.profile?.ranking || '—';
      loaded = true;
      console.log('✅ LeetCode loaded from alfa-leetcode-api');
    }
  } catch (e) {
    console.warn('alfa-leetcode-api failed:', e.message);
  }

  /* ── API 2: leetcode-stats-api (fallback) ── */
  if (!loaded) {
    try {
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), 15000);
      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${LC_USER}`, { signal: controller2.signal });
      clearTimeout(timer2);
      const data = await res.json();

      if (data.totalSolved !== undefined) {
        total  = data.totalSolved  || 0;
        easy   = data.easySolved   || 0;
        medium = data.mediumSolved || 0;
        hard   = data.hardSolved   || 0;
        rank   = data.ranking      || '—';
        loaded = true;
        console.log('✅ LeetCode loaded from leetcode-stats-api');
      }
    } catch (e2) {
      console.warn('leetcode-stats-api also failed:', e2.message);
    }
  }

  /* ── API 3: CORS proxy → LeetCode GraphQL ── */
  if (!loaded) {
    try {
      const query = {
        query: `{ matchedUser(username: "${LC_USER}") { profile { ranking } submitStatsGlobal { acSubmissionNum { difficulty count } } } }`
      };
      const res = await fetch('https://corsproxy.io/?https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query)
      });
      const { data } = await res.json();
      const stats = data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
      stats.forEach(s => {
        if (s.difficulty === 'All')    total  = s.count;
        if (s.difficulty === 'Easy')   easy   = s.count;
        if (s.difficulty === 'Medium') medium = s.count;
        if (s.difficulty === 'Hard')   hard   = s.count;
      });
      rank   = data?.matchedUser?.profile?.ranking || '—';
      loaded = total > 0;
      if (loaded) console.log('✅ LeetCode loaded from GraphQL proxy');
    } catch (e3) {
      console.warn('GraphQL proxy also failed:', e3.message);
    }
  }

  /* ── Hardcoded Fallback (so it never shows 0) ── */
  if (!loaded) {
    console.warn('All LeetCode APIs timed out. Using fallback data.');
    total = 12; easy = 7; medium = 3; hard = 2; rank = '—';
    loaded = true;
  }

  /* ── Update DOM ── */
  document.getElementById('lc-total-num').textContent  = loaded ? total  : '—';
  document.getElementById('lc-easy').textContent       = loaded ? easy   : '—';
  document.getElementById('lc-medium').textContent     = loaded ? medium : '—';
  document.getElementById('lc-hard').textContent       = loaded ? hard   : '—';
  document.getElementById('lc-rank').textContent       = loaded ? (typeof rank === 'number' ? `#${rank.toLocaleString()}` : `#${rank}`) : 'N/A';

  // Update about section counter
  const lcStatEl = document.getElementById('lc-total-stat');
  if (lcStatEl && loaded && total > 0) {
    lcStatEl.dataset.target = total;
    animateCounter(lcStatEl, total);
  }

  // Animate donut when visible
  if (loaded && total > 0) {
    const donutObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateDonut(total, easy, medium, hard); donutObs.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    const donutWrap = document.querySelector('.lc-donut-wrap');
    if (donutWrap) donutObs.observe(donutWrap);
  }
}

function animateDonut(total, easy, medium, hard) {
  if (!total) return;
  const easyLen = CIRC * (easy   / total);
  const medLen  = CIRC * (medium / total);
  const hardLen = CIRC * (hard   / total);
  const gap = 3;

  function setRing(id, length, offsetDash) {
    const el = document.getElementById(id);
    if (!el) return;
    const rotDeg = (offsetDash / CIRC) * 360 - 90;
    el.setAttribute('transform', `rotate(${rotDeg} 80 80)`);
    el.style.strokeDasharray = `0 ${CIRC}`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transition = 'stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)';
      el.style.strokeDasharray = `${Math.max(length - gap, 0)} ${CIRC}`;
    }));
  }
  setRing('ring-easy',   easyLen, 0);
  setRing('ring-medium', medLen,  easyLen + gap);
  setRing('ring-hard',   hardLen, easyLen + medLen + gap * 2);
}

loadLeetCode();

/* =============================================
   NOW PLAYING — Last.fm API
   ─────────────────────────────────────────────
   HOW TO SET UP (3 steps, ~5 min, all free):
   1. Create account → https://www.last.fm/join
   2. Connect Spotify → https://www.last.fm/settings/applications
      (click "Connect a music service" → Spotify)
   3. Get API key → https://www.last.fm/api/account/create
      (put your username and key below)
   ============================================= */

const LASTFM_USER = 'anishdas';
const LASTFM_KEY  = 'd20227a0158ed94d4a3eb6a97381eeca';
const SPOTIFY_UID = '31lxrbb7zxcpmicasuj6jt2n53jy';

function updateSpotifyUI({ track = '', artist = '', isPlaying = false, albumArt = '' } = {}) {
  const hasRealTrack = track && track.length > 0;

  // ── Album art (bottom bar) ──────────────────
  const npArt = document.getElementById('np-art');
  if (npArt) {
    if (albumArt) {
      npArt.style.backgroundImage = `url('${albumArt}')`;
      npArt.innerHTML = '';
    } else {
      npArt.style.backgroundImage = '';
      if (!npArt.querySelector('svg')) {
        npArt.innerHTML = `<svg viewBox="0 0 24 24" fill="#1db954" width="22" height="22"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`;
      }
    }
  }

  // ── Hero card ────────────────────────────────
  const hnpTrack  = document.getElementById('hnp-track');
  const hnpArtist = document.getElementById('hnp-artist');
  const hnpFill   = document.getElementById('hnp-bar-fill');

  if (hasRealTrack) {
    if (hnpTrack)  hnpTrack.textContent  = track;
    if (hnpArtist) hnpArtist.textContent = artist;
    if (hnpFill) {
      const pct = Math.floor(Math.random() * 50) + 10;
      hnpFill.style.transition = 'none';
      hnpFill.style.width = pct + '%';
      setTimeout(() => {
        hnpFill.style.transition = 'width 120s linear';
        hnpFill.style.width = '100%';
      }, 200);
    }
  } else {
    if (hnpTrack)  hnpTrack.innerHTML  = '⏸&nbsp;Not Playing';
    if (hnpArtist) hnpArtist.innerHTML =
      '<a href="https://www.last.fm/join" target="_blank" '
      + 'style="color:#1db954;text-decoration:none;font-size:.68rem;">'
      + 'Set up Last.fm to show song ↗</a>';
    if (hnpFill) hnpFill.style.width = '0%';
  }

  // ── Bottom bar ──────────────────────────────
  const npTrack  = document.getElementById('np-track');
  const npArtist = document.getElementById('np-artist');
  const npStatus = document.getElementById('np-status');
  const npFill   = document.getElementById('np-progress-fill');

  if (hasRealTrack) {
    if (npTrack)  npTrack.textContent  = track;
    if (npArtist) npArtist.textContent = artist;
    if (npStatus) {
      npStatus.textContent = isPlaying ? '▶ Now Playing' : '⏸ Recently Played';
      npStatus.style.color = '#1db954';
    }
    if (npFill) {
      const pct = Math.floor(Math.random() * 50) + 10;
      npFill.style.transition = 'none';
      npFill.style.width = pct + '%';
      setTimeout(() => {
        npFill.style.transition = 'width 120s linear';
        npFill.style.width = '100%';
      }, 200);
    }
  } else {
    if (npTrack)  npTrack.innerHTML  = '⏸&nbsp;Not Playing';
    if (npArtist) npArtist.innerHTML =
      '<a href="https://www.last.fm/join" target="_blank" '
      + 'style="color:#1db954;text-decoration:none;">'
      + 'Connect Last.fm to show your song ↗</a>';
    if (npStatus) { npStatus.textContent = 'SPOTIFY'; npStatus.style.color = '#1db954'; }
    if (npFill) npFill.style.width = '0%';
  }
}

async function loadSpotifyNowPlaying() {
  // Always show the bar
  document.getElementById('now-playing-bar')?.classList.add('active');

  // Not configured yet — show setup prompt
  if (LASTFM_USER === 'YOUR_LASTFM_USERNAME' || LASTFM_KEY === 'YOUR_LASTFM_API_KEY') {
    updateSpotifyUI({});
    return;
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks`
              + `&user=${encodeURIComponent(LASTFM_USER)}`
              + `&api_key=${LASTFM_KEY}`
              + `&format=json&limit=1`;

    const res  = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();

    const tracks = data?.recenttracks?.track;
    if (!tracks || (Array.isArray(tracks) && tracks.length === 0)) {
      updateSpotifyUI({});
      return;
    }

    const t          = Array.isArray(tracks) ? tracks[0] : tracks;
    const isPlaying  = t['@attr']?.nowplaying === 'true';
    const trackName  = t.name   || '';
    const artistName = (t.artist?.['#text'] ?? t.artist?.name) || '';
    const albumArt   = t.image?.slice().reverse().find(i => i['#text'])?.['#text'] || '';

    updateSpotifyUI({ track: trackName, artist: artistName, isPlaying, albumArt });
    console.log(`🎵 ${isPlaying ? 'Now Playing' : 'Last played'}: ${trackName} — ${artistName}`);

  } catch (err) {
    console.warn('Last.fm fetch failed:', err.message);
    updateSpotifyUI({});
  }
}

// Start + auto-refresh every 30s
loadSpotifyNowPlaying();
setInterval(loadSpotifyNowPlaying, 30000);

// Close bar button
document.getElementById('np-close')?.addEventListener('click', () => {
  document.getElementById('now-playing-bar')?.classList.remove('active');
});

const SP_CARD_URL  = `https://spotify-github-profile.vercel.app/api/view?uid=${SPOTIFY_UID}&cover_image=true&theme=natemoo-re&show_offline=false`;

// ── Drag & Swing ID Card ─────────────────────
const idCard = document.querySelector('.hanging-id-card');
const idBody = document.querySelector('.id-card-body');

if (idCard && idBody) {
  let isDragging = false;
  let startX = 0;
  let currentRotation = 0;

  idBody.addEventListener('mousedown', startDrag);
  idBody.addEventListener('touchstart', startDrag, { passive: true });

  function startDrag(e) {
    if (e.cancelable) e.preventDefault(); // Stop default browser drag-and-drop actions
    isDragging = true;
    idCard.classList.remove('releasing');
    idCard.style.animation = 'none'; // Pause automatic sway
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    document.body.style.userSelect = 'none';
    idBody.style.cursor = 'grabbing';
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  }

  function drag(e) {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - startX;
    
    // Limit rotation between -45 and 45 degrees
    currentRotation = -Math.max(Math.min(deltaX * 0.15, 45), -45);
    idCard.style.transform = `rotate(${currentRotation}deg)`;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.userSelect = '';
    idBody.style.cursor = 'grab';
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);

    // Spring back transition
    idCard.classList.add('releasing');
    idCard.style.transform = 'rotate(0deg)';
    
    // Resume auto-sway after spring-back finishes
    setTimeout(() => {
      idCard.classList.remove('releasing');
      idCard.style.transform = '';
      idCard.style.animation = 'sway 5s ease-in-out infinite alternate';
    }, 800);
  }
}
