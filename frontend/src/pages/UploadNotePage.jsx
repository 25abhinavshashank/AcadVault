import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const UploadNotePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    file: null
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.description || !formData.file) {
      setError("Title, description, and file are required.");
      return;
    }

    const extension = formData.file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(extension || "")) {
      setError("Only PDF or DOC files are supported.");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("tags", formData.tags);
    payload.append("file", formData.file);

    try {
      setSubmitting(true);
      await axiosInstance.post("/notes/upload", payload, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setSuccess("Note uploaded successfully.");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to upload your note.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="content-grid">
      <div className="card highlight-card">
        <span className="badge">Upload notes</span>
        <h1>Share a resource your classmates will actually use.</h1>
        <p>
          Add a clear title, a short description, and tags that make discovery easy for the next
          student.
        </p>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <label>
          Title
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Tags
          <input
            type="text"
            name="tags"
            placeholder="dbms, algorithms, semester-4"
            value={formData.tags}
            onChange={handleChange}
          />
        </label>
        <label>
          File
          <input type="file" name="file" accept=".pdf,.doc,.docx" onChange={handleChange} />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" className="primary-button full-width" disabled={submitting}>
          {submitting ? "Uploading..." : "Upload Note"}
        </button>
      </form>
    </section>
  );
};

export default UploadNotePage;
