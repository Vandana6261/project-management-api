import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true
        },
        otp: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

otpSchema.index({createdAt: 1}, {expireAfterSeconds:300})
export default mongoose.model('Otp', otpSchema);