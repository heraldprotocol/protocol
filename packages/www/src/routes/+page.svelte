<script lang="ts">
  import { onMount } from "svelte";
  import logo from "$lib/assets/logo.png";

  onMount(() => {
    const bg = document.querySelector<HTMLElement>(".bg-layer");
    let ticking = false;
    function update() {
      if (bg)
        bg.style.backgroundPosition = `center calc(50% - ${window.scrollY * 0.3}px)`;
      ticking = false;
    }
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const els = document.querySelectorAll(".section-enter");
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -25% 0px" },
      );
      els.forEach((el) => {
        io?.observe(el);
      });
    } else {
      els.forEach((el) => {
        el.classList.add("is-in");
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  });
</script>

<svelte:head>
  <title>Herald Protocol — Payment Infrastructure for AI Agents</title>
</svelte:head>

<div class="bg-layer" aria-hidden="true"></div>

<header class="topbar section-enter">
  <a href="/" class="mark" aria-label="Herald Protocol">
    <img class="mark__glyph" src={logo} alt="" />
    <span class="mark__name">Herald Pr0t0c0l</span>
  </a>
  <a
    class="docs"
    href="https://docs.heraldprotocol.xyz/"
    target="_blank"
    rel="noopener">Docs ↗</a
  >
</header>

<section class="hero" data-screen-label="01 Hero">
  <div class="hero__spacer-top" aria-hidden="true"></div>
  <div class="hero__inner section-enter">
    <div class="hero__pre">
      <span class="label">Herald Protocol</span>
    </div>

    <h1 class="display hero__title">
      Payment infrastructure<br />
      for <span style="color: #c596fa;">AI&nbsp;agents</span>
    </h1>
  </div>

  <div class="hero__meta section-enter" aria-hidden="true">
    <span class="label">x402</span>
    <span class="label">0G</span>
  </div>
</section>

<section class="section" data-screen-label="02 What We Are">
  <div class="what">
    <aside class="what__anchor section-enter">
      <span class="label">Infrastructure</span>
    </aside>

    <div class="what__body">
      <h2 class="h1 what__title section-enter">What we are</h2>

      <p class="body section-enter">
        Herald Protocol is the infrastructure layer for autonomous agent
        economics, operating exclusively on the
        <a
          style="color: #c596fa; font-weight: 700;"
          href="https://0g.ai"
          target="_blank"
          rel="noopener">0G Chain</a
        >. We provide the settlement primitives that allow AI agents to meter,
        charge, and pay for digital resources at scale.
      </p>

      <p class="body section-enter">
        We ships an x402 facilitator so any API, MCP server, or agent can accept
        onchain payments on 0G, and a cross-chain payment router so agents
        holding funds on 0G can pay services on other chains without managing
        multiple wallets.
      </p>

      <dl class="spec-list section-enter">
        <div>
          <dt>x402 Facilitator</dt>
          <dd>
            <a
              class="path__link"
              target="_blank"
              href="https://facilitator.heraldprotocol.xyz"
              >facilitator.heraldprotocol.xyz</a
            >
          </dd>
        </div>
        <div>
          <dt>Router</dt>
          <dd>
            <a
              class="path__link"
              target="_blank"
              href="https://router.heraldprotocol.xyz"
              >router.heraldprotocol.xyz</a
            >
          </dd>
        </div>
      </dl>
    </div>
  </div>
</section>

<footer class="footer" data-screen-label="03 Start Building">
  <div class="footer__grid">
    <div class="footer__lead section-enter">
      <span class="label">Integration</span>
      <h2 class="h2 footer__title">Start building</h2>
    </div>

    <div class="paths">
      <article class="path section-enter">
        <h3 class="path__name">x402</h3>
        <p class="path__desc">
          Add the Herald facilitator to your server. Charge per request, per
          call, per artifact. Works with any x402 client. Settles on 0G in
          USDC.e.
        </p>
        <a
          class="path__link"
          href="https://docs.heraldprotocol.xyz/"
          target="_blank"
          rel="noopener"
        >
          Quickstart for sellers
        </a>
      </article>

      <span class="paths__divider" aria-hidden="true"></span>

      <article class="path section-enter">
        <h3 class="path__name">Router</h3>
        <p class="path__desc">
          Pay any protected service (HTTP 402) from anywhere without bridging.
          The router accepts payment on 0G and forwards on the destination
          server or chain.
        </p>
        <a
          class="path__link"
          href="https://docs.heraldprotocol.xyz/"
          target="_blank"
          rel="noopener"
        >
          Quickstart for the router
        </a>
      </article>

      <span class="paths__divider" aria-hidden="true"></span>

      <article class="path section-enter">
        <h3 class="path__name">MPP</h3>
        <p class="path__desc path__desc__disabled">Coming soon</p>
      </article>
    </div>
  </div>

  <div class="footer__bottom">
    <span class="label">© 2026 — Herald Protocol</span>
    <a href="https://docs.heraldprotocol.xyz/" target="_blank" rel="noopener"
      >Docs ↗</a
    >
  </div>
</footer>

<style>
  :global(:root) {
    --color-bg: oklch(11% 0.007 240);
    --color-surface: oklch(16% 0.007 240);
    --color-border: oklch(24% 0.007 240);
    --color-text-muted: oklch(48% 0.007 240);
    --color-text: oklch(72% 0.008 240);
    --color-heading: oklch(94% 0.009 240);

    --font-mono:
      "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
    --font-sans:
      "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);

    --gutter: clamp(1.5rem, 8vw, 8rem);
  }

  :global(*),
  :global(*::before),
  :global(*::after) {
    box-sizing: border-box;
  }

  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
  }

  :global(html) {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  :global(body) {
    min-height: 100vh;
    background: transparent;
    overflow-x: hidden;
  }

  .bg-layer {
    position: fixed;
    inset: 0;
    background: url("$lib/assets/background.png") center 50% / cover no-repeat;
    filter: brightness(0.2);
    z-index: -1;
    will-change: background-position;
  }

  :global(::selection) {
    background: var(--color-border);
    color: var(--color-heading);
  }

  .label {
    font-family: var(--font-mono);
    font-weight: 500;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    line-height: 1.4;
  }

  .display {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: clamp(4rem, 8vw, 9rem);
    line-height: 0.98;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: var(--color-heading);
    margin: 0;
  }

  .h1 {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: clamp(2.5rem, 5vw, 5rem);
    line-height: 1;
    letter-spacing: -0.015em;
    text-transform: uppercase;
    color: var(--color-heading);
    margin: 0;
  }

  .h2 {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    line-height: 1.05;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    color: var(--color-heading);
    margin: 0;
  }

  .body {
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: clamp(1rem, 1.1vw, 1.125rem);
    line-height: 1.75;
    color: var(--color-text);
    max-width: 65ch;
    margin: 0;
  }

  .body + .body {
    margin-top: 1.4rem;
  }

  .body :global(a) {
    color: var(--color-heading);
    text-decoration: none;
    border-bottom: 1px solid var(--color-border);
    transition:
      opacity 120ms ease-out,
      border-color 120ms ease-out;
  }
  @media (hover: hover) and (pointer: fine) {
    .body :global(a:hover) {
      opacity: 0.7;
    }
  }
  .body :global(a:active) {
    opacity: 0.5;
  }

  :global(a:focus-visible),
  :global(button:focus-visible) {
    outline: 2px solid var(--color-border);
    outline-offset: 3px;
    border-radius: 1px;
  }

  .topbar {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem var(--gutter);
  }

  .mark {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    text-decoration: none;
  }

  .mark__glyph {
    width: 64px;
    height: 64px;
    display: block;
    image-rendering: pixelated;
  }

  .mark__name {
    font-family: var(--font-mono);
    font-weight: 900;
    font-size: 1.25rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-heading);
  }

  .topbar a.docs {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    text-decoration: none;
    transition:
      color 120ms ease-out,
      opacity 120ms ease-out;
  }
  @media (hover: hover) and (pointer: fine) {
    .topbar a.docs:hover {
      color: var(--color-heading);
    }
  }
  .topbar a.docs:active {
    opacity: 0.5;
  }

  .hero {
    min-height: calc(100vh - 80px);
    padding: 0 var(--gutter);
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .hero__spacer-top {
    flex: 0 1 15vh;
    min-height: 2.5rem;
  }

  .hero__inner {
    flex: 0 0 auto;
    padding-bottom: 2.25rem;
    max-width: 1200px;
  }

  .hero__pre {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-bottom: 1.6rem;
  }
  .hero__pre::before {
    content: "";
    width: 28px;
    height: 1px;
    background: var(--color-border);
    display: block;
  }

  .hero__title {
    margin-bottom: 1.6rem;
  }

  .hero__meta {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
    margin-top: 1rem;
    margin-bottom: 2rem;
    font-size: 0.7rem;
  }
  .hero__meta span {
    color: var(--color-text-muted);
  }

  .section {
    padding: clamp(8rem, 14vh, 14rem) var(--gutter);
  }

  .what {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: clamp(2rem, 6vw, 6rem);
    align-items: start;
    max-width: 1400px;
  }

  .what__anchor {
    position: sticky;
    top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }
  .what__anchor .label {
    line-height: 1.6;
  }

  .what__body {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .what__title {
    margin-bottom: 2.5rem;
  }

  .spec-list {
    margin-top: 3rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem 2.5rem;
    border-top: 1px solid var(--color-border);
    padding-top: 1.6rem;
  }
  .spec-list dt {
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin-bottom: 0.35rem;
  }
  .spec-list dd {
    font-family: var(--font-mono);
    font-weight: 500;
    font-size: 0.9rem;
    line-height: 1.4;
    color: var(--color-heading);
    margin: 0;
    word-break: break-word;
  }

  .footer {
    background: var(--color-surface);
    padding: clamp(5rem, 10vh, 9rem) var(--gutter) 0 var(--gutter);
    margin-top: clamp(6rem, 10vh, 10rem);
  }

  .footer__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(2.5rem, 6vw, 6rem);
    align-items: start;
    max-width: 1400px;
    padding-bottom: clamp(4rem, 8vh, 7rem);
  }

  .footer__lead {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .footer__title {
    margin: 0;
  }

  .paths {
    display: grid;
    grid-template-columns: 1fr 1px 1fr 1px 1fr;
    gap: clamp(1.5rem, 3vw, 3rem);
    align-items: stretch;
  }

  .paths__divider {
    background: var(--color-border);
    width: 1px;
  }

  .path {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 100%;
  }

  .path__name {
    font-family: var(--font-mono);
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-heading);
    font-size: clamp(1.4rem, 2vw, 1.75rem);
    line-height: 1.05;
    letter-spacing: -0.01em;
  }

  .path__desc {
    font-family: var(--font-sans);
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--color-text);
    max-width: 38ch;
    flex: 1;
  }

  .path__desc__disabled {
    color: var(--color-text-muted);
  }

  .path__link {
    margin-top: 0.4rem;
    font-family: var(--font-mono);
    font-weight: 500;
    font-size: 0.85rem;
    color: var(--color-heading);
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: opacity 120ms ease-out;
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    align-self: flex-start;
  }
  .path__link::before {
    content: "→";
    font-family: var(--font-mono);
    color: var(--color-text-muted);
    transition:
      transform 200ms var(--ease-out),
      color 120ms ease-out;
  }
  @media (hover: hover) and (pointer: fine) {
    .path__link:hover {
      opacity: 0.7;
    }
    .path__link:hover::before {
      transform: translateX(3px);
      color: var(--color-heading);
    }
  }
  .path__link:active {
    opacity: 0.5;
  }

  .footer__bottom {
    border-top: 1px solid var(--color-border);
    padding: 1.4rem 0 1.6rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    font-size: 0.7rem;
    flex-wrap: wrap;
  }

  .footer__bottom .label {
    font-size: 0.7rem;
  }
  .footer__bottom a {
    color: var(--color-text-muted);
    text-decoration: none;
    transition:
      color 120ms ease-out,
      opacity 120ms ease-out;
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  @media (hover: hover) and (pointer: fine) {
    .footer__bottom a:hover {
      color: var(--color-heading);
    }
  }
  .footer__bottom a:active {
    opacity: 0.5;
  }

  .section-enter {
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 220ms var(--ease-out),
      transform 220ms var(--ease-out);
    will-change: opacity, transform;
  }
  :global(.section-enter.is-in) {
    opacity: 1;
    transform: translateY(0);
  }

  .path.section-enter:nth-child(1) {
    transition-delay: 0ms;
  }
  .path.section-enter:nth-child(3) {
    transition-delay: 60ms;
  }

  @media (prefers-reduced-motion: reduce) {
    .section-enter {
      transition: opacity 150ms ease;
      transform: none;
    }
    .path__link::before {
      transition: none;
    }
  }

  @media (max-width: 760px) {
    :global(:root) {
      --gutter: 1.5rem;
    }

    .topbar {
      padding: 1.25rem var(--gutter);
    }

    .mark__glyph {
      width: 36px;
      height: 36px;
    }

    .mark__name {
      font-size: 1rem;
    }

    .hero {
      min-height: calc(100vh - 64px);
    }

    .hero__spacer-top {
      flex: 0 1 22vh;
    }

    .hero__title {
      font-size: clamp(2.6rem, 11vw, 4.5rem);
    }

    .what {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .what__anchor {
      position: static;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
    }

    .footer__grid {
      grid-template-columns: 1fr;
    }

    .paths {
      grid-template-columns: 1fr;
      gap: 0;
    }
    .paths__divider {
      width: 100%;
      height: 1px;
      margin: 1.75rem 0;
    }

    .footer__bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
</style>
