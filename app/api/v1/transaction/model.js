const mongoose = require('mongoose')
const { model, Schema } = mongoose

const transactionSchema = Schema(
    {
        merchant: {
            type: mongoose.Types.ObjectId,
            ref: 'Admins',
            required: true
        },
        client: {
            type: mongoose.Types.ObjectId,
            ref: 'Clients',
            required: true
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        price: {
            type: Number,
            required: [true, 'Harga harus diisi']
        },
        qty: {
            type: Number,
            required: [true, 'Jumlah harus diisi']
        },
    },
    { timestamps: true }
)

module.exports = model ('Transactions', transactionSchema)