const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    folderPath: {
      type: String,
      required: true
    },
    textCount: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    textUpdatedCount: {
      type: Number,
      required: false,
      default: 0
    },
    currentText: {
      type: Number,
      requured: false,
      default: 0
    },
    categories: [
      {
        name: {
          type: String,
          required: true
        },
        key: {
          type: String,
          required: true
        },
        color: {
          type: String,
          required: true
        }
      }
    ],
    classifications: [
      {
        name: {
          type: String,
          required: true
        },
        key: {
          type: String,
          required: true
        },
        color: {
          type: String,
          required: true
        }
      }
    ],
    texts: { type: [Schema.Types.ObjectId], required: true },
    words: [Schema.Types.ObjectId],
    user: { type: Schema.Types.ObjectId, required: false }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)

const Project = mongoose.model('Projects', projectSchema)
module.exports = Project
