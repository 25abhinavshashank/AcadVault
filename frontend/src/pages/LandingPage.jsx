import { Link } from "react-router-dom";

const LandingPage = () => (
  <section className="landing-stack">
    <div className="landing-hero card">
      <div className="landing-hero-copy">
        <span className="badge">AcadVault</span>
        <h1>Share notes, build discussions, and keep your campus learning in one place.</h1>
        <p>
          A cleaner student workspace for uploading notes, discovering class resources, and
          collaborating around the material that actually matters before exams.
        </p>
        <div className="actions-row">
          <Link className="primary-button" to="/register">
            Get Started
          </Link>
          <Link className="secondary-button" to="/login">
            Explore Dashboard
          </Link>
        </div>
      </div>

      <div className="landing-metrics">
        <article className="landing-metric-card">
          <strong>Notes that stay organized</strong>
          <p>Upload PDFs and docs with tags, cleaner browsing, and direct access from one grid.</p>
        </article>
        <article className="landing-metric-card">
          <strong>Community-first discussion</strong>
          <p>Every note becomes a discussion room for quick context, clarifications, and feedback.</p>
        </article>
        <article className="landing-metric-card">
          <strong>Made for college flow</strong>
          <p>Search by title, topics, and tags so your semester content stays easy to revisit.</p>
        </article>
      </div>
    </div>

    <div className="landing-feature-grid">
      <article className="card landing-feature-card">
        <span className="badge">Discover</span>
        <h2>Find the right resource faster</h2>
        <p>Search notes by title, description, and tags without digging through random folders.</p>
      </article>

      <article className="card landing-feature-card">
        <span className="badge">Collaborate</span>
        <h2>Turn every note into a conversation</h2>
        <p>Like, comment, and keep the most useful study material visible for your community.</p>
      </article>

      <article className="card landing-feature-card">
        <span className="badge">Control</span>
        <h2>Keep the platform moderated</h2>
        <p>Admin controls help manage uploads, users, and discussions without leaving the app.</p>
      </article>
    </div>

    <footer className="landing-footer">
      <div className="landing-footer-brand-block">
        <div className="landing-footer-brand-row">
          <span className="landing-footer-mark">AV</span>
          <div>
            <span className="landing-footer-brand">AcadVault</span>
            <p>
              A student-first workspace for notes, discussion, and shared learning across your
              classes.
            </p>
          </div>
        </div>

        <div className="landing-footer-meta">
          <span className="landing-footer-chip">Organized notes</span>
          <span className="landing-footer-chip">Peer discussion</span>
          <span className="landing-footer-chip">Admin moderation</span>
        </div>
      </div>

      <div className="landing-footer-cta">
        <Link className="primary-button landing-footer-button" to="/register">
          Start with AcadVault
        </Link>
      </div>
    </footer>
  </section>
);

export default LandingPage;
