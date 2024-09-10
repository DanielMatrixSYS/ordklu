import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../index";
import * as admin from "firebase-admin";

export interface FirebaseRequest extends Request {
  user?: admin.auth.DecodedIdToken; // Firebase user token
}

export async function authenticateFirebaseToken(
  req: FirebaseRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Basically just verifies that the token is valid, not an admin check.
  try {
    req.user = await firebaseAdmin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    return res.status(403).json({ error: "Unauthorized" });
  }
}
