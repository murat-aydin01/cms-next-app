import { z } from "zod/v4";

export const registerSchema = z.strictObject({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&]/, "Password must contain at least one special character")
})

export const loginSchema = z.strictObject({
  email: z.email(),
  password: z.string().min(1)
})