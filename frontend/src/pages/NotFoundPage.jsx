import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <section className="card empty-state">
    <span className="badge">404</span>
    <h1>Page not found</h1>
    <p>The page you requested does not exist or may have been moved.</p>
    <Link className="primary-button" to="/dashboard">
      Return to dashboard
    </Link>
  </section>
);

export default NotFoundPage;
