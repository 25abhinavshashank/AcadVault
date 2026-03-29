import mongoose from "mongoose";
import "../config/env.js";
import connectDB from "../config/db.js";
import User from "../models/User.js";

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error('Usage: npm run set-admin -- "Admin Name" admin@example.com strongpassword');
  process.exit(1);
}

const upsertAdmin = async () => {
  await connectDB();

  let user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: "admin"
    });
  } else {
    user.name = name;
    user.email = email.toLowerCase();
    user.password = password;
    user.role = "admin";
  }

  await user.save();
  console.log(`Admin account ready: ${user.email}`);

  await mongoose.disconnect();
  process.exit(0);
};

upsertAdmin().catch(async (error) => {
  console.error("Failed to set admin credentials:", error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
