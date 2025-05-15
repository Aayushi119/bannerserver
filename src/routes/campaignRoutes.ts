import express, { Router, Request, Response, NextFunction, ErrorRequestHandler } from "express";
import {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/campaignController";
import path from "path";
import multer from "multer";
import fs from "fs";

// Define the upload directory
const uploadDir: string = path.join(__dirname, "../uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer setup with type definitions
const upload = multer({ storage }).fields([{ name: "images", maxCount: 4 }]);

// Custom interface for Multer files with fields
interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({ error: "Unexpected field name. Expected 'images'." });
    } else {
      res.status(400).json({ error: err.message });
    }
  } else if (err) {
    res.status(500).json({ error: "File upload error" });
  } else {
    next();
  }
};

// Router setup
const router: Router = express.Router();

// Routes
router.post("/create", upload, createBanner, errorHandler); // Create a new banner
router.get("/getall", getAllBanners); // Get all banners
router.get("/:id", getBannerById); // Get a banner by ID
router.put("/:id", upload, updateBanner, errorHandler); // Update a banner by ID
router.delete("/:id", deleteBanner); // Delete a banner by ID

export default router;