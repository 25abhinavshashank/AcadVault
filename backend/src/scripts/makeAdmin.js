import "../config/env.js";
import connectDB from "../config/db.js";
import User from "../models/User.js";

const email = process.argv[2];

if (!email) {
  console.error("Usage: npm run make-admin -- user@example.com");
  process.exit(1);
}

const promoteUser = async () => {
  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    console.error("No user found with that email.");
    process.exit(1);
  }

  console.log(`User ${user.email} is now an admin.`);
  process.exit(0);
};

promoteUser().catch((error) => {
  console.error("Failed to promote user:", error.message);
  process.exit(1);
});
