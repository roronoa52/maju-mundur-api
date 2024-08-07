const mongoose = require('mongoose')
const { model, Schema} = mongoose

const imageSchema = Schema(
    {
        dataImage:{
            type: Buffer,
            required: true,
        },
        typeImage:{
            type: String,
            required: true,
        },
    },

    { timestamps:true }
)

module.exports = model('Image', imageSchema)