import Navigation from "~/components/Navigation";

export default function Contact() {
  return (
    <>
      <Navigation />
      <main>
        <section id="contact" className="contact">
          <div className="container">
            <h2>Get in Touch</h2>
            <p>Book Banjo Sandwich for your next event or festival. We love sharing our music with audiences who appreciate authentic bluegrass.</p>
            <div className="contact-info">
              <p>For booking inquiries, please reach out through our social media or email us directly.</p>
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
