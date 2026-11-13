export default function Home() {
  return (
    <main className="page">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Golf Store home">
          GOLF<span> / </span>STORE
        </a>
        <span className="status">A new store is in the works</span>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">MADE FOR YOUR NEXT ROUND</p>
        <h1 id="hero-title">
          Find your
          <br />
          <span>fairway.</span>
        </h1>
        <p className="intro">
          A considered collection of golf essentials is on its way. We&apos;re
          getting the details right before the first tee.
        </p>
        <span className="coming-soon">COMING SOON</span>
      </section>

      <footer className="footer">
        <span>Golf balls · Apparel · Footwear · Bags · Accessories</span>
        <span>India</span>
      </footer>
    </main>
  );
}
