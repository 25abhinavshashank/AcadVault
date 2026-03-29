import { Link, useNavigate } from "react-router-dom";

const NoteCard = ({ note, currentUserId, currentUserRole, onDelete }) => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const fileRoute = `${apiBaseUrl}/notes/${note._id}/file`;
  const canDelete =
    currentUserId &&
    (note.uploadedBy?._id === currentUserId || currentUserRole === "admin");
  const noteDetailsRoute = `/notes/${note._id}`;

  const handleCardNavigate = () => {
    navigate(noteDetailsRoute);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(noteDetailsRoute);
    }
  };

  return (
    <article
      className="card note-card note-card-clickable"
      role="link"
      tabIndex={0}
      onClick={handleCardNavigate}
      onKeyDown={handleCardKeyDown}
    >
      <div className="note-card-header">
        <div>
          <span className="badge">{note.tags?.[0] || "General"}</span>
          <h3>{note.title}</h3>
        </div>
        <span className="muted">{new Date(note.createdAt).toLocaleDateString()}</span>
      </div>

      <p className="note-description">{note.description}</p>

      <div className="tags-row">
        {note.tags?.length ? (
          note.tags.map((tag) => (
            <span className="tag-pill" key={tag}>
              {tag}
            </span>
          ))
        ) : (
          <span className="muted">No tags</span>
        )}
      </div>

      <div className="note-meta">
        <span>By {note.uploadedBy?.name || "Unknown"}</span>
        <span>{note.likes?.length || 0} likes</span>
      </div>

      <div className="actions-row">
        <Link
          className="primary-button"
          to={noteDetailsRoute}
          onClick={(event) => event.stopPropagation()}
        >
          View Note
        </Link>
        <a
          className="secondary-button"
          href={fileRoute}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          Open File
        </a>
        {canDelete && (
          <button
            type="button"
            className="danger-button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(note._id);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
};

export default NoteCard;
