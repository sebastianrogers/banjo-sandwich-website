import Navigation from "~/components/Navigation";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <h2>Banjo Sandwich</h2>
            <p>Because One Banjo is Never Enough</p>
            <div className="hero-description">
              <p>Why have you never heard more than one banjo in a band? Well there's only one way to find out and that's come and find us.</p>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="container">
          <p>&copy; 2025 Banjo Sandwich. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
