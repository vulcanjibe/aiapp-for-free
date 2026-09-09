import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompanyQuoteRequest extends Document {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  companySize: string;
  currentPaidApp: string;
  approximateAnnualCost?: string;
  projectDescription: string;
  status: "new" | "in_review" | "contacted" | "closed";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyQuoteRequestSchema = new Schema<ICompanyQuoteRequest>(
  {
    companyName: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    companySize: { type: String, required: true },
    currentPaidApp: { type: String, required: true },
    approximateAnnualCost: { type: String },
    projectDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "in_review", "contacted", "closed"],
      default: "new",
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export const CompanyQuoteRequest: Model<ICompanyQuoteRequest> =
  mongoose.models.CompanyQuoteRequest ||
  mongoose.model<ICompanyQuoteRequest>("CompanyQuoteRequest", CompanyQuoteRequestSchema);
