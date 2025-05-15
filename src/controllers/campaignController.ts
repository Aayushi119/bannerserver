import { Request, Response } from "express";
import { Banner } from "../models/campaignModel";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Create a new banner
export const createBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { campaignName, startDate, endDate, budget, targetAudience, campaignGoals } = req.body;

    if (!req.files || !(req.files as { [fieldname: string]: Express.Multer.File[] })["images"]) {
      res.status(400).json({ success: false, message: "At least one image file is required" });
      return;
    }

    const imageFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })["images"];

    // Upload the first image to Cloudinary
    const cloudinaryUpload = await cloudinary.uploader.upload(imageFiles[0].path);

    const newBanner = new Banner({
      campaignName,
      startDate,
      endDate,
      budget,
      targetAudience,
      campaignGoals,
      imageUrl: cloudinaryUpload.secure_url, // Store Cloudinary URL
    });

    await newBanner.save();
    res.status(201).json({ success: true, data: newBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all banners
export const getAllBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const banners = await Banner.find(); // Fetch all banners from the database
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a banner by ID
export const getBannerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Extract banner ID from URL parameters
    const banner = await Banner.findById(id);

    if (!banner) {
      res.status(404).json({ success: false, message: "Banner not found" });
      return;
    }

    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update a banner by ID
export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Extract banner ID from URL parameters
    const { campaignName, startDate, endDate, budget, targetAudience, campaignGoals } = req.body;

    // Check if a new image is uploaded
    let imageUrl: string | undefined;
    if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] })["images"]) {
      const imageFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })["images"];
      const cloudinaryUpload = await cloudinary.uploader.upload(imageFiles[0].path);
      imageUrl = cloudinaryUpload.secure_url;
    }

    // Prepare update data
    const updateData: any = {
      campaignName,
      startDate,
      endDate,
      budget,
      targetAudience,
      campaignGoals,
    };

    // Only include imageUrl if a new image was uploaded
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update against the schema
    });

    if (!updatedBanner) {
      res.status(404).json({ success: false, message: "Banner not found" });
      return;
    }

    res.status(200).json({ success: true, data: updatedBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a banner by ID
export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Extract banner ID from URL parameters
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      res.status(404).json({ success: false, message: "Banner not found" });
      return;
    }

    // Optionally delete the image from Cloudinary if needed
    // const publicId = banner.imageUrl.split('/').pop()?.split('.')[0]; // Extract public ID from URL
    // await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};