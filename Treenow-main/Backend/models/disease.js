import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    tree: { type: mongoose.Schema.Types.ObjectId, ref: 'Tree', required: true },
    symptoms: [{ type: String, required: true }],
    solutions: [{ type: String, required: true }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true },
);

const Disease = mongoose.model('Disease', diseaseSchema);
export default Disease;
