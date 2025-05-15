import { Schema, model, Document } from "mongoose";

// Define the Contact interface for TypeScript
interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// Create the Contact schema
const contactSchema = new Schema<IContact>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });  // This will add createdAt and updatedAt fields

// Create the Contact model
const Contact = model<IContact>("Contact", contactSchema);

export default Contact;
