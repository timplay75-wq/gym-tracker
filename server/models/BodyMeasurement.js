import mongoose from 'mongoose';

const BodyMeasurementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  weight: { type: Number, required: true, min: 0, max: 999 },
  notes: { type: String, maxlength: 300, default: '' },
}, { timestamps: true });

BodyMeasurementSchema.index({ userId: 1, date: -1 });
BodyMeasurementSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('BodyMeasurement', BodyMeasurementSchema);