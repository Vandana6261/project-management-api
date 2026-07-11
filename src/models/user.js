import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
        },
        isVarified: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

userSchema.index({createdAt: 1}, {expireAfterSeconds:600})
export default mongoose.model('User', userSchema);