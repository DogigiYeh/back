import mongoose from 'mongoose'

const replySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true, 'replyReportRequired'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'closed'],
    default: 'pending',
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
  fixedAt: {
    type: Date,
    default: null,
  },
})

export default mongoose.model('reply', replySchema)
