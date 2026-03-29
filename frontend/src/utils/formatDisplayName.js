const formatDisplayName = (name) => {
  if (!name) {
    return "Unknown";
  }

  return name.trim().toLowerCase() === "platform admin" ? "Admin" : name;
};

export default formatDisplayName;
