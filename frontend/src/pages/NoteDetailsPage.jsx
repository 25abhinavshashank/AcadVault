import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import useAuth from "../hooks/useAuth.js";
import formatDisplayName from "../utils/formatDisplayName.js";

const NoteDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [note, setNote] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState("");
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchNoteDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [noteResponse, commentsResponse] = await Promise.all([
        axiosInstance.get(`/notes/${id}`),
        axiosInstance.get(`/comments/${id}`)
      ]);

      setNote(noteResponse.data.note);
      setComments(commentsResponse.data.comments);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load the note.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoteDetails();
  }, [id]);

  const handleLike = async () => {
    try {
      const { data } = await axiosInstance.put(`/notes/like/${id}`);
      // Optimistically mirror the toggle response to keep the detail page responsive.
      setNote((prev) =>
        prev
          ? {
              ...prev,
              likes: data.liked
                ? [...prev.likes, user._id]
                : prev.likes.filter((likeId) => likeId !== user._id)
            }
          : prev
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update like.");
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) {
      return;
    }

    try {
      setCommentSubmitting(true);
      const { data } = await axiosInstance.post(`/comments/${id}`, {
        text: commentText
      });
      setComments((prev) => [data.comment, ...prev]);
      setCommentText("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to add your comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this note permanently?");
    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`/notes/${id}`);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete this note.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmed = window.confirm("Delete this comment permanently?");
    if (!confirmed) {
      return;
    }

    try {
      setDeletingCommentId(commentId);
      setError("");
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete this comment.");
    } finally {
      setDeletingCommentId("");
    }
  };

  if (loading) {
    return <div className="page-message">Loading note details...</div>;
  }

  if (error && !note) {
    return <div className="card form-error">{error}</div>;
  }

  const canDelete = user?.role === "admin" || user?._id === note?.uploadedBy?._id;
  const isLiked = note?.likes?.some((likeId) => likeId === user?._id);
  const fileRoute = `${apiBaseUrl}/notes/${id}/file`;

  return (
    <section className="details-grid details-grid-note-page">
      <article className="card stack-md note-details-card">
        <div className="section-header">
          <div>
            <span className="badge">Note details</span>
            <h1>{note.title}</h1>
          </div>
          <span className="muted">{new Date(note.createdAt).toLocaleString()}</span>
        </div>

        <p>{note.description}</p>

        <div className="tags-row">
          {note.tags?.map((tag) => (
            <span className="tag-pill" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className="note-meta">
          <span>Uploaded by {formatDisplayName(note.uploadedBy?.name)}</span>
          <span>{note.likes?.length || 0} likes</span>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="actions-row">
          <a className="primary-button" href={fileRoute} target="_blank" rel="noreferrer">
            Open Document
          </a>
          <button type="button" className="secondary-button" onClick={handleLike}>
            {isLiked ? "Unlike" : "Like"}
          </button>
          {canDelete && (
            <button type="button" className="danger-button" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </article>

      <aside className="card stack-md comments-panel">
        <div>
          <span className="badge">Discussion</span>
          <h2>Comments</h2>
        </div>

        <form className="stack-sm" onSubmit={handleCommentSubmit}>
          <textarea
            rows="4"
            placeholder="Add a helpful comment"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <button type="submit" className="primary-button" disabled={commentSubmitting}>
            {commentSubmitting ? "Posting..." : "Add Comment"}
          </button>
        </form>

        <div className="comments-list comments-scroll-area">
          {comments.length ? (
            comments.map((comment) => (
              <article className="comment-card" key={comment._id}>
                <div className="comment-header">
                  <strong>{formatDisplayName(comment.userId?.name)}</strong>
                  <span className="muted">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p>{comment.text}</p>
                {(user?.role === "admin" || user?._id === comment.userId?._id) && (
                  <div className="comment-actions">
                    <button
                      type="button"
                      className="danger-button comment-delete-button"
                      onClick={() => handleCommentDelete(comment._id)}
                      disabled={deletingCommentId === comment._id}
                    >
                      {deletingCommentId === comment._id ? "Deleting..." : "Delete Comment"}
                    </button>
                  </div>
                )}
              </article>
            ))
          ) : (
            <p className="muted">No comments yet. Be the first one to start the discussion.</p>
          )}
        </div>
      </aside>
    </section>
  );
};

export default NoteDetailsPage;
