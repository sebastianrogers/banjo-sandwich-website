import Navigation from "~/components/Navigation";

export default function Members() {
  const members = [
    { name: "Julie", role: "Banjo" },
    { name: "Rob", role: "Banjo & Vocals" },
    { name: "Sally", role: "Banjo & Vocals" },
    { name: "Sebastian", role: "Banjo & Vocals" },
    { name: "Simon", role: "Banjo" },
    { name: "Steve", role: "Banjo & Vocals" }
  ];

  return (
    <>
      <Navigation />
      <main>
        <section id="members" className="members">
          <div className="container">
            <h2>Band Members</h2>
            <div className="member-grid">
              {members.map((member) => (
                <div key={member.name} className="member">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              ))}
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
