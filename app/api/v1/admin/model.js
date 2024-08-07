const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const bcrypt = require('bcryptjs');

let adminSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama harus diisi'],
            minlength: 3,
            maxlength: 50
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email harus diisi']
        },
        password: {
            type: String,
            required: [true, 'Password harus diisi']
        },
        confirmPassword: {
            type: String,
            required: [true, 'Confirm Password harus diisi']
        },
        token: {
            type: String,
        },
        role: {
            type: String,
            enum: ['admin', 'merchant'],
            default: 'merchant',
            required: [true, 'Role harus diisi'],
        },
    },
    { timestamps: true }
);

adminSchema.pre('save', async function (next) {
    const user = this;

    if (!['admin', 'merchant', 'client'].includes(user.role)) {
        return next(new Error('Role is not found'));
    }

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 12);
    }
    next();
});

adminSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
};

module.exports = model('Admins', adminSchema);
