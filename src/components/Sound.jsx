// Carried over from the Claude Design file "Sound.dc.html".
// The logic class is the design's own code; View is its template as JSX.
import React from 'react';
import { DCLogic, page, sty, BASE } from '../lib/dc.js';

const PAGE = 'sound';
const COL = { sound: [232, 34, 44], journal: [255, 196, 0] }[PAGE];
const HOME = BASE + '?from=dive';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = x => x * x * (3 - 2 * x);
const easeIO = k => .5 - .5 * Math.cos(Math.PI * k);
const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

class Component extends DCLogic {
  state = { navHov: null };
  canvasRef = React.createRef(); titleRef = React.createRef(); subRef = React.createRef();
  t = 0;
  componentDidMount() {
    const r = rng(7), gc = document.createElement('canvas'); gc.width = gc.height = 220;
    { const x = gc.getContext('2d'), im = x.createImageData(220, 220); for (let i = 0; i < im.data.length; i += 4) { const v = 255 - Math.pow(r(), 3) * 40; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } x.putImageData(im, 0, 0); }
    this.grainC = gc;
    this.raf = requestAnimationFrame(this.tick);
  }
  componentWillUnmount() { cancelAnimationFrame(this.raf); }
  dotOf(k) { const d = document.querySelector('[data-navk="' + k + '"] [data-navdot]'); if (!d) return null; const r = d.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  leave(href, home) {
    return e => { if (e) e.preventDefault(); if (this.out) return;
      if (home) try { const o = {}; document.querySelectorAll('[data-navk]').forEach(el => { const k = el.getAttribute('data-navk'), p = this.dotOf(k); if (p) o[k] = p; }); o.ink = o.home; sessionStorage.setItem('nav-from', JSON.stringify(o)); } catch (x) {}
      this.out = { href, t: 0 }; };
  }
  stay = e => { if (e) e.preventDefault(); };
  goHome = this.leave(HOME, true);
  GO = { freediving: this.leave(BASE + 'freediving/'), sound: PAGE === 'sound' ? this.stay : this.leave(BASE + 'sound/'), journal: PAGE === 'journal' ? this.stay : this.leave(BASE + 'journal/') };
  tick = now => {
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min(.05, (now - (this.last || now)) / 1000); this.last = now; this.t += dt;
    if (this.out) { this.out.t += dt; if (this.out.t > .55 && !this.left) { this.left = true; location.href = this.out.href; } }
    this.draw();
  };
  // a brush stroke pours out of this page's nav dot and settles as the title's underline
  path(D, A, E) {
    const pts = [], C1 = [D[0] - 20, D[1] + 180], C2 = [A[0] + 220, A[1] - 40];
    for (let q = 0; q <= 70; q++) { const u = q / 70, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3; pts.push([a * D[0] + b * C1[0] + c * C2[0] + d * A[0], a * D[1] + b * C1[1] + c * C2[1] + d * A[1]]); }
    const iA = pts.length - 1;
    for (let x = A[0] - 6; x >= E[0]; x -= 6) pts.push([x, A[1] + Math.sin(x * .031) * 1.4]);
    const s = [0]; for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, s, sA: s[iA], tot: s[s.length - 1] };
  }
  draw() {
    const cv = this.canvasRef.current, ti = this.titleRef.current; if (!cv || !ti) return;
    const W = innerWidth, H = innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); this.grainP = null; }
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = '#f5f3ee'; ctx.fillRect(0, 0, W, H);
    const t = this.t, fo = this.out ? smooth(clamp(this.out.t / .45, 0, 1)) : 0;
    const D = this.dotOf(PAGE) || [W - 160, 28], r = ti.getBoundingClientRect(), y0 = r.bottom + 16, A = [r.right + 30, y0], E = [r.left + 6, y0];
    const key = [D, A, E].join();
    if (this.key !== key) { this.key = key; this.P = this.path(D, A, E); }
    const { pts, s, sA, tot } = this.P, h = tot * easeIO(clamp((t - .15) / 1.5, 0, 1)), cut = sA * smooth(clamp((t - 1.2) / 1.1, 0, 1));
    const P = [], Wd = [];
    for (let i = 0; i < pts.length; i++) { if (s[i] > h) break; if (s[i] < cut) continue; P.push(pts[i]); Wd.push(7 * (.86 + .14 * Math.sin(s[i] * .045)) * Math.sqrt(clamp((h - s[i]) / 40, .06, 1)) * Math.sqrt(clamp((s[i] - cut) / 50, .06, 1)) * (s[i] < sA ? .75 : 1)); }
    const col = 'rgb(' + COL.join(',') + ')';
    if (P.length > 1) {
      const Lp = [], Rp = [], n = P.length;
      for (let i = 0; i < n; i++) { const q = P[Math.min(n - 1, i + 1)], pr = P[Math.max(0, i - 1)], tx = q[0] - pr[0], ty = q[1] - pr[1], tl = Math.hypot(tx, ty) || 1, hw = Wd[i] / 2; Lp.push([P[i][0] - ty / tl * hw, P[i][1] + tx / tl * hw]); Rp.push([P[i][0] + ty / tl * hw, P[i][1] - tx / tl * hw]); }
      ctx.globalAlpha = .94 * (1 - fo); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(Lp[0][0], Lp[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(Lp[i][0], Lp[i][1]); for (let i = n - 1; i >= 0; i--) ctx.lineTo(Rp[i][0], Rp[i][1]); ctx.closePath(); ctx.fill();
      const hp = P[n - 1]; ctx.globalAlpha = 1 - fo; ctx.beginPath(); ctx.arc(hp[0], hp[1], 7, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1;
    }
    { const d = document.querySelector('[data-navk="' + PAGE + '"] [data-navdot]'); if (d) d.style.transform = 'scale(' + (1 + .6 * Math.sin(Math.PI * clamp(t / .6, 0, 1))).toFixed(3) + ')'; }
    const ta = smooth(clamp((t - .9) / .7, 0, 1)) * (1 - fo), sa = smooth(clamp((t - 1.5) / .6, 0, 1)) * (1 - fo);
    ti.style.opacity = ta.toFixed(3); ti.style.transform = 'translateY(' + ((1 - ta) * 8).toFixed(1) + 'px)';
    if (this.subRef.current) this.subRef.current.style.opacity = sa.toFixed(3);
    if (!this.grainP) this.grainP = ctx.createPattern(this.grainC, 'repeat');
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .35; ctx.fillStyle = this.grainP; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }
  renderVals() {
    return {
      canvasRef: this.canvasRef, titleRef: this.titleRef, subRef: this.subRef, goHome: this.goHome,
      navOff: () => this.setState({ navHov: null }),
      nav: Object.fromEntries([['home', '홈', 'Home'], ['freediving', '프리다이빙', 'Freediving'], ['sound', '소리', 'Sound'], ['journal', '일기', 'Journal']].map(([k, ko, en]) => { const h = this.state.navHov === k, st = on => ({ a: on ? 1 : 0, y: on ? '0px' : '8px', b: on ? '0px' : '3px' }), E = h ? { a: 0, y: '-6px', b: '3px' } : st(true), K = st(h); return [k, { bp: h ? '28%' : '100%', en: E.a, enY: E.y, enB: E.b, ko: K.a, koY: K.y, koB: K.b, on: () => { if (this.state.navHov !== k) this.setState({ navHov: k }); }, go: this.GO[k] }]; }))
    };
  }
}

function View(v) {
  return (
    <>
    <div style={sty("position:fixed;inset:0;overflow:hidden;color:#141414;background:#f5f3ee;font-family:'Newsreader', Georgia, serif;-webkit-font-smoothing:antialiased")}>
      {"\n  "}
      <canvas ref={v.canvasRef} style={sty("position:absolute;inset:0;width:100%;height:100%;pointer-events:none")} />
      {"\n  "}
      <main style={sty("position:absolute;left:clamp(26px, 5vw, 56px);top:max(26vh, 200px);right:24px;display:flex;flex-direction:column;align-items:flex-start;gap:44px")}>
        {"\n    "}
        <h1 ref={v.titleRef} style={sty("margin:0;font-style:italic;font-weight:300;font-size:clamp(64px, 11vw, 132px);line-height:.95;letter-spacing:-0.025em;opacity:0")}>
          {"Sound"}
        </h1>
        {"\n    "}
        <p ref={v.subRef} style={sty("margin:0;font-family:'JetBrains Mono', monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:0")}>
          {"In progress"}
        </p>
        {"\n  "}
      </main>
      {"\n  "}
      <nav aria-label="Pages" style={sty("position:absolute;right:12px;top:12px;display:flex;flex-direction:row;align-items:flex-start;z-index:5")}>
        {"\n    "}
        <a href={BASE + "?from=dive"} onClick={v.goHome} aria-label="Home" data-navk="home" onMouseEnter={v.nav?.home?.on} onMouseLeave={v.navOff} onFocus={v.nav?.home?.on} onBlur={v.navOff} style={sty("display:flex;flex-direction:column;align-items:center;gap:8px;width:52px;height:156px;padding:8px 0 0;box-sizing:border-box;border:0;background:none;color:inherit;text-decoration:none;cursor:pointer;font-family:'Newsreader', Georgia, serif;font-size:13px;line-height:1")}>
          <span data-navdot="1" style={sty("width:16px;height:16px;border-radius:50%;background:rgb(20,20,20);flex:none")} />
          <span style={sty("position:relative;display:block;width:100%;height:116px")}>
            <span lang="en" data-lab="nav" aria-hidden="true" style={sty(`position:absolute;left:50%;top:0;writing-mode:vertical-rl;text-orientation:sideways;white-space:nowrap;font-family:Papyrus, 'Papyrus-Regular', 'Newsreader', Georgia, serif;font-weight:400;font-size:19px;letter-spacing:.02em;background-image:linear-gradient(to bottom, rgb(20,20,20) 0%, rgb(20,20,20) 20%, currentColor 60%, currentColor 100%);background-size:100% 300%;background-repeat:no-repeat;background-position:0 ${v.nav?.home?.bp ?? ''};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transition:opacity .55s ease, transform .7s cubic-bezier(.2,.7,.2,1), filter .55s ease, background-position 1.1s cubic-bezier(.3,.6,.2,1);opacity:${v.nav?.home?.en ?? ''};transform:translateX(-50%) translateY(${v.nav?.home?.enY ?? ''});filter:blur(${v.nav?.home?.enB ?? ''})`)}>
              {"Home"}
            </span>
            <span lang="ko" aria-hidden="true" style={sty(`position:absolute;left:50%;top:0;writing-mode:vertical-rl;text-orientation:upright;white-space:nowrap;font-family:'Noto Serif KR', serif;font-weight:600;font-size:19px;letter-spacing:.08em;background-image:linear-gradient(to bottom, rgb(20,20,20) 0%, rgb(20,20,20) 20%, currentColor 60%, currentColor 100%);background-size:100% 300%;background-repeat:no-repeat;background-position:0 ${v.nav?.home?.bp ?? ''};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transition:opacity .55s ease, transform .7s cubic-bezier(.2,.7,.2,1), filter .55s ease, background-position 1.1s cubic-bezier(.3,.6,.2,1);opacity:${v.nav?.home?.ko ?? ''};transform:translateX(-50%) translateY(${v.nav?.home?.koY ?? ''});filter:blur(${v.nav?.home?.koB ?? ''})`)}>
              {"홈"}
            </span>
          </span>
        </a>
        {"\n    "}
        <a href={BASE + "freediving/"} onClick={v.nav?.freediving?.go} aria-label="Freediving" data-navk="freediving" onMouseEnter={v.nav?.freediving?.on} onMouseLeave={v.navOff} onFocus={v.nav?.freediving?.on} onBlur={v.navOff} style={sty("display:flex;flex-direction:column;align-items:center;gap:8px;width:52px;height:156px;padding:8px 0 0;box-sizing:border-box;border:0;background:none;color:inherit;text-decoration:none;cursor:pointer;font-family:'Newsreader', Georgia, serif;font-size:13px;line-height:1")}>
          <span data-navdot="1" style={sty("width:16px;height:16px;border-radius:50%;background:rgb(24,88,224);flex:none")} />
          <span style={sty("position:relative;display:block;width:100%;height:116px")}>
            <span lang="en" data-lab="nav" aria-hidden="true" style={sty(`position:absolute;left:50%;top:0;writing-mode:vertical-rl;text-orientation:sideways;white-space:nowrap;font-family:Papyrus, 'Papyrus-Regular', 'Newsreader', Georgia, serif;font-weight:400;font-size:19px;letter-spacing:.02em;background-image:linear-gradient(to bottom, rgb(24,88,224) 0%, rgb(24,88,224) 20%, currentColor 60%, currentColor 100%);background-size:100% 300%;background-repeat:no-repeat;background-position:0 ${v.nav?.freediving?.bp ?? ''};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transition:opacity .55s ease, transform .7s cubic-bezier(.2,.7,.2,1), filter .55s ease, background-position 1.1s cubic-bezier(.3,.6,.2,1);opacity:${v.nav?.freediving?.en ?? ''};transform:translateX(-50%) translateY(${v.nav?.freediving?.enY ?? ''});filter:blur(${v.nav?.freediving?.enB ?? ''})`)}>
              {"Freediving"}
            </span>
            <span lang="ko" aria-hidden="true" style={sty(`position:absolute;left:50%;top:0;writing-mode:vertical-rl;text-orientation:upright;white-space:nowrap;font-family:'Noto Serif KR', serif;font-weight:600;font-size:19px;letter-spacing:.08em;background-image:linear-gradient(to bottom, rgb(24,88,224) 0%, rgb(24,88,224) 20%, currentColor 60%, currentColor 100%);background-size:100% 300%;background-repeat:no-repeat;background-position:0 ${v.nav?.freediving?.bp ?? ''};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transition:opacity .55s ease, transform .7s cubic-bezier(.2,.7,.2,1), filter .55s ease, background-position 1.1s cubic-bezier(.3,.6,.2,1);opacity:${v.nav?.freediving?.ko ?? ''};transform:translateX(-50%) translateY(${v.nav?.freediving?.koY ?? ''});filter:blur(${v.nav?.freediving?.koB ?? ''})`)}>
              {"프리다이빙"}
            </span>
          </span>
        </a>
        {"\n    "}
        <a href={BASE + "sound/"} onClick={v.nav?.sound?.go} aria-current="page" aria-label="Sound" data-navk="sound" onMouseEnter={v.nav?.sound?.on} onMouseLeave={v.navOff} onFocus={v.nav?.sound?.on} onBlur={v.navOff} style={sty("display:flex;flex-direction:column;align-items:center;gap:8px;width:52px;height:156px;padding:8px 0 0;box-sizing:border-box;border:0;background:none;color:inherit;text-decoration:none;cursor:pointer;font-family:'Newsreader', Georgia, serif;font-size:13px;line-height:1")}>
          <span data-navdot="1" style={sty("width:16px;height:16px;border-radius:50%;background:rgb(232,34,44);flex:none")} />
          <span style={sty("position:relative;display:block;width:100%;height:116px")}>
            <span lang="en" data-lab="nav" aria-hidden="true" style={sty(`position:absolute;left:50%;top:0;writing-mode:vertical-rl;text-orientation:sideways;white-space:nowrap;font-family:Papyrus, 'Papyrus-Regular', 'Newsreader', Georgia, serif;font-weight:400;font-size:19px;letter-spacing:.02em;background-image:linear-gradient(to bottom, rgb(232,34,44) 0%, rgb(232,34,44) 20%, currentColor 60%, currentColor 100%);background-size:100% 300%;background-repeat:no-repeat;background-position:0 ${v.nav?.sound?.bp ?? ''};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transition:opacity .55s ease, transform .7s cubic-bezier(.2,.7,.2,1), filter .55s ease, background-position 1.1s cubic-bezier(.3,.6,.2,1);opacity:${v.nav?.sound?.en ?? ''};transform:translateX(-50%) translateY(${v.nav?.sound?.enY ?? ''});filter:blur(${v.nav?.sound?.enB ?? ''})`)}>
              {"Sound"}
            </span>
            <span lang="ko" aria-hidden="true" style={sty(`position:absolute;left:50%;top:0;writing-mode:vertical-rl;text-orientation:upright;white-space:nowrap;font-family:'Noto Serif KR', serif;font-weight:600;font-size:19px;letter-spacing:.08em;background-image:linear-gradient(to bottom, rgb(232,34,44) 0%, rgb(232,34,44) 20%, currentColor 60%, currentColor 100%);background-size:100% 300%;background-repeat:no-repeat;background-position:0 ${v.nav?.sound?.bp ?? ''};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transition:opacity .55s ease, transform .7s cubic-bezier(.2,.7,.2,1), filter .55s ease, background-position 1.1s cubic-bezier(.3,.6,.2,1);opacity:${v.nav?.sound?.ko ?? ''};transform:translateX(-50%) translateY(${v.nav?.sound?.koY ?? ''});filter:blur(${v.nav?.sound?.koB ?? ''})`)}>
              {"소리"}
            </span>
          </span>
        </a>
        {"\n    "}
        <a href={BASE + "journal/"} onClick={v.nav?.journal?.go} aria-label="Journal" data-navk="journal" onMouseEnter={v.nav?.journal?.on} onMouseLeave={v.navOff} onFocus={v.nav?.journal?.on} onBlur={v.navOff} style={sty("display:flex;flex-direction:column;align-items:center;gap:8px;width:52px;height:156px;padding:8px 0 0;box-sizing:border-box;border:0;background:none;color:inherit;text-decoration:none;cursor:pointer;font-family:'Newsreader', Georgia, serif;font-size:13px;line-height:1")}>
          <span data-navdot="1" style={sty("width:16px;height:16px;border-radius:50%;background:rgb(255,196,0);flex:none")} />
          <span style={sty("position:relative;display:block;width:100%;height:116px")}>
            <span lang="en" data-lab="nav" aria-hidden="true" style={sty(`position:absolute;left:50%;top:0;writing-mode:vertical-rl;text-orientation:sideways;white-space:nowrap;font-family:Papyrus, 'Papyrus-Regular', 'Newsreader', Georgia, serif;font-weight:400;font-size:19px;letter-spacing:.02em;background-image:linear-gradient(to bottom, rgb(255,196,0) 0%, rgb(255,196,0) 20%, currentColor 60%, currentColor 100%);background-size:100% 300%;background-repeat:no-repeat;background-position:0 ${v.nav?.journal?.bp ?? ''};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transition:opacity .55s ease, transform .7s cubic-bezier(.2,.7,.2,1), filter .55s ease, background-position 1.1s cubic-bezier(.3,.6,.2,1);opacity:${v.nav?.journal?.en ?? ''};transform:translateX(-50%) translateY(${v.nav?.journal?.enY ?? ''});filter:blur(${v.nav?.journal?.enB ?? ''})`)}>
              {"Journal"}
            </span>
            <span lang="ko" aria-hidden="true" style={sty(`position:absolute;left:50%;top:0;writing-mode:vertical-rl;text-orientation:upright;white-space:nowrap;font-family:'Noto Serif KR', serif;font-weight:600;font-size:19px;letter-spacing:.08em;background-image:linear-gradient(to bottom, rgb(255,196,0) 0%, rgb(255,196,0) 20%, currentColor 60%, currentColor 100%);background-size:100% 300%;background-repeat:no-repeat;background-position:0 ${v.nav?.journal?.bp ?? ''};-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transition:opacity .55s ease, transform .7s cubic-bezier(.2,.7,.2,1), filter .55s ease, background-position 1.1s cubic-bezier(.3,.6,.2,1);opacity:${v.nav?.journal?.ko ?? ''};transform:translateX(-50%) translateY(${v.nav?.journal?.koY ?? ''});filter:blur(${v.nav?.journal?.koB ?? ''})`)}>
              {"일기"}
            </span>
          </span>
        </a>
        {"\n    "}
        <span aria-hidden="true" style={sty("display:flex;flex-direction:row;align-items:flex-start")}>
          {"\n      "}
          <span data-navk="c4" style={sty("width:32px;height:32px;display:grid;place-items:center")}>
            <span data-navdot="1" style={sty("width:11px;height:11px;border-radius:50%;background:rgb(255,118,18)")} />
          </span>
          {"\n      "}
          <span data-navk="c5" style={sty("width:32px;height:32px;display:grid;place-items:center")}>
            <span data-navdot="1" style={sty("width:11px;height:11px;border-radius:50%;background:rgb(22,168,82)")} />
          </span>
          {"\n      "}
          <span data-navk="c6" style={sty("width:32px;height:32px;display:grid;place-items:center")}>
            <span data-navdot="1" style={sty("width:11px;height:11px;border-radius:50%;background:rgb(138,64,214)")} />
          </span>
          {"\n    "}
        </span>
        {"\n  "}
      </nav>
    </div>
    </>
  );
}

export default page(Component, View, {});
