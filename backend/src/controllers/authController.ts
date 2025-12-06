import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const user = await authService.registerUser(name, email, password, phone);
    res.status(201).json({ 
      message: "Registered successfully. You can now login.", 
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err: any) {
    if (err.message === "Email already registered") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Missing token" });
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
    const accessToken = signAccessToken(payload.sub);
    const newRefresh = signRefreshToken(payload.sub);
    res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    next(err);
  }
}