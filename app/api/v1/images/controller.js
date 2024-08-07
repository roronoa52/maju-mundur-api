const Categories = require("./model")
const { StatusCodes } = require("http-status-codes")
const { createImages } = require("../../../services/mongoosee/images")
const { bufferToBase64 } = require("../../../utils/base64")

const create = async(req, res, next) => {
    try {
        const result = await createImages(req)

        const resultCopy = JSON.parse(JSON.stringify(result));
          
        resultCopy.dataImage = bufferToBase64(resultCopy.dataImage);

        res.status(StatusCodes.CREATED).json({
            data: resultCopy
        })
    } catch (err) {
        next(err)
    }
}

module.exports ={
    create
}