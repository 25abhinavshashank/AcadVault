import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import formatDisplayName from "../../utils/formatDisplayName.js";

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersResponse, notesResponse] = await Promise.all([
        axiosInstance.get("/admin/users"),
        axiosInstance.get("/admin/notes")
      ]);

      setUsers(usersResponse.data.users);
      setNotes(notesResponse.data.notes);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Delete this user and all associated content?");
    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`/admin/user/${userId}`);
      await fetchAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete the user.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm("Delete this note?");
    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`/notes/${noteId}`);
      await fetchAdminData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete the note.");
    }
  };

  return (
    <section className="stack-lg">
      <div className="section-header">
        <div>
          <span className="badge">Admin dashboard</span>
          <h1>Moderate users and notes</h1>
          <p className="muted">Central controls for managing the platform safely.</p>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <div className="page-message">Loading admin data...</div>
      ) : (
        <>
          <article className="card stack-md">
            <h2>Users</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((platformUser) => (
                    <tr key={platformUser._id}>
                      <td>{formatDisplayName(platformUser.name)}</td>
                      <td>{platformUser.email}</td>
                      <td>{platformUser.role}</td>
                      <td>{new Date(platformUser.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDeleteUser(platformUser._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="card stack-md">
            <h2>All notes</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Uploader</th>
                    <th>Likes</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note) => (
                    <tr key={note._id}>
                      <td>{note.title}</td>
                      <td>{formatDisplayName(note.uploadedBy?.name)}</td>
                      <td>{note.likes?.length || 0}</td>
                      <td>{new Date(note.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDeleteNote(note._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </>
      )}
    </section>
  );
};

export default AdminDashboardPage;
