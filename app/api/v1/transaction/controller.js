const { createTransaction, getAllTransaction, getOneTransaction, createTransactionReward } = require('../../../services/mongoosee/transaction')
const { StatusCodes } = require('http-status-codes')
const { bufferToBase64 } = require('../../../utils/base64')

const create = async (req, res, next) => {
    try{
        const result = await createTransaction(req)

        res.status(StatusCodes.CREATED).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}

const createReward = async (req, res, next) => {
    try{
        const result = await createTransactionReward(req)

        res.status(StatusCodes.CREATED).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}

const index = async (req, res, next) => {
    try{
        const result = await getAllTransaction(req)

        res.status(StatusCodes.OK).json({
            data: result 
        })
    }catch(err){
        next(err)
    }
}

const find = async (req, res, next) => {
    try{
        const result = await getOneTransaction(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}

module.exports = {
    create,
    index,
    find,
    createReward
}