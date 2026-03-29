import { useId, useState } from "react";

const EyeIcon = ({ open }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="password-toggle-icon">
    <path
      d="M2 12s3.75-6 10-6 10 6 10 6-3.75 6-10 6S2 12 2 12Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    {!open && (
      <path
        d="M4 4l16 16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    )}
  </svg>
);

const PasswordField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  autoComplete = "current-password"
}) => {
  const [visible, setVisible] = useState(false);
  const inputId = useId();

  return (
    <label className="password-field" htmlFor={inputId}>
      {label}
      <div className="password-input-wrap">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          title={visible ? `Hide ${label}` : `Show ${label}`}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
    </label>
  );
};

export default PasswordField;
