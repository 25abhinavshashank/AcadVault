import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import NoteCard from "../components/notes/NoteCard.jsx";
import useAuth from "../hooks/useAuth.js";

const ProfilePage = () => {
  const { user } = useAuth();
  const [myNotes, setMyNotes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMyNotes = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/notes", {
        params: { page: 1, limit: 50 }
      });
      setMyNotes(data.notes.filter((note) => note.uploadedBy?._id === user?._id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load your notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchMyNotes();
    }
  }, [user?._id]);

  const handleDelete = async (noteId) => {
    const confirmed = window.confirm("Delete this note permanently?");
    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`/notes/${noteId}`);
      setMyNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete your note.");
    }
  };

  return (
    <section className="stack-lg">
      <article className="card profile-card">
        <div>
          <span className="badge">Profile</span>
          <h1>{user?.name}</h1>
        </div>
        <div className="profile-meta">
          <span>{user?.email}</span>
          <span>Role: {user?.role}</span>
          <span>Joined: {new Date(user?.createdAt).toLocaleDateString()}</span>
        </div>
      </article>

      {error && <p className="form-error">{error}</p>}

      <div className="section-header">
        <div>
          <h2>Your uploads</h2>
          <p className="muted">A quick view of the notes you have shared with the community.</p>
        </div>
      </div>

      {loading ? (
        <div className="page-message">Loading your uploads...</div>
      ) : myNotes.length ? (
        <div className="notes-grid">
          {myNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              currentUserId={user?._id}
              currentUserRole={user?.role}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <h3>No uploads yet</h3>
          <p>Your shared notes will show up here as soon as you upload them.</p>
        </div>
      )}
    </section>
  );
};

export default ProfilePage;
