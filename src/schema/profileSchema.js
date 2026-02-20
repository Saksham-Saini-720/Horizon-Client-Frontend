import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone"),
  bio: z.string().min(5, "Bio too short"),
  avatar: z.string().optional(),
});
