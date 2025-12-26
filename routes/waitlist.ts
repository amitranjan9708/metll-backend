import { Router } from "express";
import { z } from "zod";
import { getPrisma } from "../lib/prisma.js";

const router = Router();

const waitlistSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email address"),
  suggestion: z.string().max(1000, "Suggestion is too long").optional(),
});

export interface WaitlistResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id: number;
    name: string;
    email: string;
  };
}

router.post("/", async (req, res) => {
  try {
    // Validate request body
    const validationResult = waitlistSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.errors[0]?.message || "Invalid input",
      } as WaitlistResponse);
    }

    const { name, email, suggestion } = validationResult.data;

    // Get Prisma client
    const prisma = await getPrisma();

    // Check if email already exists
    const existing = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "This email is already on the waitlist",
      } as WaitlistResponse);
    }

    // Create waitlist entry
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        name,
        email,
        suggestion: suggestion || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Successfully joined the waitlist!",
      data: {
        id: waitlistEntry.id,
        name: waitlistEntry.name,
        email: waitlistEntry.email,
      },
    } as WaitlistResponse);
  } catch (error) {
    console.error("Error creating waitlist entry:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to join waitlist. Please try again later.",
    } as WaitlistResponse);
  }
});

// Get all waitlist entries (optional, for admin purposes)
router.get("/", async (_req, res) => {
  try {
    const prisma = await getPrisma();
    const entries = await prisma.waitlist.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Error fetching waitlist entries:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch waitlist entries",
    });
  }
});

export { router as waitlistRouter };

