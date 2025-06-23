import Navigation from "~/components/Navigation";

export default function About() {
  return (
    <>
      <Navigation />
      <main>
        <section id="about" className="about">
          <div className="container">
            <h2>About the Band</h2>
            <p>Banjo Sandwich is a dedicated banjo ensemble committed to getting the utmost out of our instrument of choice, the banjo. Our sound is bluegrass based but we'll play anything that takes our fancy, if we can figure out.</p>
            <p>It's a unique sound and whether its at an open mic, small venue or festival then you won't believe your ears. Munroe and Scruggs would be proud because we're standing on their giant shoulders and doing what they did, trying stuff out to find out what works.</p>
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
