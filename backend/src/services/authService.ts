import { User } from "../models/User";
import { hashPassword, verifyPassword } from "../utils/passwords";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

/**
 * Register a new user WITHOUT sending email (simplified for your local setup).
 */
export async function registerUser(name: string, email: string, password: string, phone?: string) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    isEmailVerified: true // mark as verified to avoid email flow
  });

  return user;
}

/**
 * Login user and return tokens.
 */
export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}