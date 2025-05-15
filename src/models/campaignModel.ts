import mongoose, { Document, Schema } from "mongoose";

interface IBanner extends Document {
 
  campaignName: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  targetAudience: string;
  campaignGoals: string;
  imageUrl: string;
}

const BannerSchema = new Schema<IBanner>(
  {

    campaignName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, required: true },
    targetAudience: { type: String, required: true },
    campaignGoals: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);
export const Banner = mongoose.model<IBanner>("Banner", BannerSchema);