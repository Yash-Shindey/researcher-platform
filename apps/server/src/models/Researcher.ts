import mongoose from 'mongoose';
import { Researcher } from '../types/researcher.types';

const researcherSchema = new mongoose.Schema<Researcher>({
  authfull: {
    type: String,
    required: true,
    index: true
  },
  inst_name: {
    type: String,
    required: true,
    index: true
  },
  cntry: {
    type: String,
    required: true,
    index: true
  },
  metrics: {
    h23: { type: Number, default: 0 },
    nc9623: { type: Number, default: 0 },
    selfCitationExcluded: {
      h23: { type: Number, default: 0 },
      nc9623: { type: Number, default: 0 }
    }
  },
  fields: {
    primary: {
      name: { type: String, required: true },
      rank: { type: Number, required: true }
    },
    secondary: [{
      name: { type: String },
      fraction: { type: Number }
    }]
  }
}, {
  timestamps: true
});

// Add indexes
researcherSchema.index({ 'metrics.h23': -1 });
researcherSchema.index({ 'metrics.nc9623': -1 });
researcherSchema.index({ 'fields.primary.name': 1 });

export const ResearcherModel = mongoose.model<Researcher>('Researcher', researcherSchema);
