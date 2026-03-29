import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import NoteCard from "../components/notes/NoteCard.jsx";
import useAuth from "../hooks/useAuth.js";

const DashboardPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: "", tags: "", page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotes = async (nextFilters = filters) => {
    try {
      setLoading(true);
      setError("");
      // Search and tag filters are passed as query params so pagination stays server-driven.
      const { data } = await axiosInstance.get("/notes", {
        params: {
          page: nextFilters.page,
          search: nextFilters.search,
          tags: nextFilters.tags
        }
      });

      setNotes(data.notes);
      setPagination(data.pagination);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleFilterChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const nextFilters = { ...filters, page: 1 };
    setFilters(nextFilters);
    await fetchNotes(nextFilters);
  };

  const handlePageChange = async (nextPage) => {
    const nextFilters = { ...filters, page: nextPage };
    setFilters(nextFilters);
    await fetchNotes(nextFilters);
  };

  const handleDelete = async (noteId) => {
    const confirmed = window.confirm("Delete this note permanently?");
    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`/notes/${noteId}`);
      await fetchNotes();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete the note.");
    }
  };

  return (
    <section className="stack-lg">
      <div className="section-header">
        <div>
          <span className="badge">Dashboard</span>
          <h1>Explore community notes</h1>
          <p className="muted">Search, filter, and jump back into the resources your peers shared.</p>
        </div>
      </div>

      <form className="card filter-bar" onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          placeholder="Search by title, description, or keyword"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="tags"
          placeholder="Filter tags: math,physics"
          value={filters.tags}
          onChange={handleFilterChange}
        />
        <button type="submit" className="primary-button">
          Search
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <div className="page-message">Loading notes...</div>
      ) : notes.length ? (
        <>
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                currentUserId={user?._id}
                currentUserRole={user?.role}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className="pagination-row">
            <button
              type="button"
              className="secondary-button"
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </button>
            <span className="muted">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              type="button"
              className="secondary-button"
              disabled={pagination.page >= (pagination.totalPages || 1)}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="card empty-state">
          <h3>No notes found</h3>
          <p>Try a different search term or upload the first document for your community.</p>
        </div>
      )}
    </section>
  );
};

export default DashboardPage;
