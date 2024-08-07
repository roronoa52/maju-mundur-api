const { signin, signinClient } = require('../../../services/mongoosee/auth')
const { StatusCodes } = require('http-status-codes')
const { createUser, updateUser, getOneUser, getAllUser, createClient } = require('../../../services/mongoosee/users')

const signinAdmin = async (req, res, next) => {
    try {
        const result = await signin(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const signupAdmin = async (req, res, next) => {
    try {
        
        const result = await createUser(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const signupClient = async (req, res, next) => {
    try {
        
        const result = await createClient(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const signinClientAuth = async (req, res, next) => {
    try {
        
        const result = await signinClient(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try{
        const result = await updateUser(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}

const getOne = async (req, res, next) => {
    try{
        const result = await getOneUser(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}

const getAll = async (req, res, next) => {
    try{
        const result = await getAllUser(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}


module.exports= {
    signinAdmin,
    signupAdmin,
    update,
    getOne,
    getAll,
    signupClient,
    signinClientAuth
}