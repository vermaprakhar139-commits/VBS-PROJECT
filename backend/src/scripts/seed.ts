import { connectDB } from "../config/db";
import { User } from "../models/User";
import { hashPassword } from "../utils/passwords";

async function seed() {
  await connectDB();

  // Clear existing users (optional)
  await User.deleteMany({});

  const admin = await User.create({
    email: "admin@vbs.local",
    name: "Admin",
    passwordHash: await hashPassword("Admin@123"),
    role: "admin",
    isEmailVerified: true
  });

  const user = await User.create({
    email: "user@vbs.local",
    name: "Demo User",
    passwordHash: await hashPassword("User@123"),
    role: "user",
    isEmailVerified: true
  });

  console.log("Simple seed complete.");
  console.log("Admin:", admin.email, "Admin@123");
  console.log("User:", user.email, "User@123");

  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});