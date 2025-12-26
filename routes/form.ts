import { Router } from "express";
import { z } from "zod";

const router = Router();

// Generic form submission schema - can be extended for different forms
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
  subject: z.string().max(255, "Subject is too long").optional(),
  phone: z.string().max(20, "Phone number is too long").optional(),
});

export interface FormResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Generic form submission endpoint
router.post("/submit", async (req, res) => {
  try {
    // Validate request body
    const validationResult = formSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.errors[0]?.message || "Invalid input",
      } as FormResponse);
    }

    const { name, email, message, subject, phone } = validationResult.data;

    // Here you can add logic to:
    // - Save to database
    // - Send email notification
    // - Integrate with third-party services
    // - etc.

    console.log("Form submission received:", {
      name,
      email,
      subject,
      phone,
      message: message.substring(0, 100) + "...",
    });

    // For now, just return success
    // You can extend this to save to a database table or send emails
    return res.status(200).json({
      success: true,
      message: "Form submitted successfully! We'll get back to you soon.",
    } as FormResponse);
  } catch (error) {
    console.error("Error processing form submission:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to submit form. Please try again later.",
    } as FormResponse);
  }
});

// Contact form endpoint (specific handler)
router.post("/contact", async (req, res) => {
  try {
    const validationResult = formSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.errors[0]?.message || "Invalid input",
      } as FormResponse);
    }

    const formData = validationResult.data;

    // Process contact form submission
    // Add your business logic here (save to DB, send email, etc.)

    return res.status(200).json({
      success: true,
      message: "Thank you for contacting us! We'll respond soon.",
    } as FormResponse);
  } catch (error) {
    console.error("Error processing contact form:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to submit contact form. Please try again later.",
    } as FormResponse);
  }
});

export { router as formRouter };

