const { createRewards, getAllRewards, deleteRewards, getOneRewards, updateRewards } = require('../../../services/mongoosee/reward')
const { StatusCodes } = require('http-status-codes')
const { bufferToBase64 } = require('../../../utils/base64')

const create = async (req, res, next) => {
    try{
        const result = await createRewards(req)

        res.status(StatusCodes.CREATED).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}

const index = async (req, res, next) => {
    try{
        const result = await getAllRewards(req)

        const resultCopy = JSON.parse(JSON.stringify(result));

          for (const data of resultCopy) {
            if (data && data.image.dataImage) {
              data.image.dataImage = bufferToBase64(data.image.dataImage);
            }
          }

        res.status(StatusCodes.OK).json({
            data: resultCopy 
        })
    }catch(err){
        next(err)
    }
}

const find = async (req, res, next) => {
    try{
        const result = await getOneRewards(req)

        const resultCopy = JSON.parse(JSON.stringify(result)); 
        
        resultCopy.image.dataImage = bufferToBase64(result.image.dataImage);

        res.status(StatusCodes.OK).json({
            data: resultCopy
        })
    }catch(err){
        next(err)
    }
}

const update = async (req, res, next) => {
    try{
        const result = await updateRewards(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}

const destroy = async (req, res, next) => {
    try{
        const result = await deleteRewards(req)

        res.status(StatusCodes.OK).json({
            data: "OK"
        })
    }catch(err){
        next(err)
    }
}

module.exports = {
    create,
    index,
    find,
    update,
    destroy
}