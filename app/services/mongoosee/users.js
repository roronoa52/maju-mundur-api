const Users = require('../../api/v1/admin/model')
const Clients = require('../../api/v1/client/model')
const { BadRequestError, NotFoundError } = require('../../errors')
const { createTokenUser, createJWT } = require('../../utils');

const createUser = async (req) => {
    const { email, password, confirmPassword, name, role } = req.body

    if( password !== confirmPassword){
        throw new BadRequestError('Password and confirm password tidak cocok')
    }

    var result = await Users.create({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        role: role
    })

    const token = createJWT({ payload: createTokenUser(result) });

    await Users.findOneAndUpdate(
        { _id: result.id,},
        { token},
        { new: true, runValidators: true }
    )

    delete result._doc.password
    delete result._doc.confirmPassword

    return {result, token}
}

const createClient = async (req) => {
    const { email, password, confirmPassword, name, role } = req.body

    if( password !== confirmPassword){
        throw new BadRequestError('Password and confirm password tidak cocok')
    }

    var result = await Clients.create({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        role: role
    })

    const token = createJWT({ payload: createTokenUser(result) });

    await Clients.findOneAndUpdate(
        { _id: result.id,},
        { token},
        { new: true, runValidators: true }
    )

    delete result._doc.password
    delete result._doc.confirmPassword

    return {result, token}
}

const updateUser = async (req) => {
    const { id } = req.params;
    const { role} = req.body;

    const updateFields = {};

    if (role) updateFields.role = role;

    const result = await Users.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true, runValidators: true }
    ).select('_id name email role')

    if (!result) throw new NotFoundError(`Tidak ada merchant dengan id: ${id}`);

    return result;
}

const getOneUser = async (req) => {
    const { id } = req.params

    const result = await Users.findOne({ _id: id}).select('_id name email role')

    if(!result) throw new NotFoundError(`Tidak ada merchant dengan id: ${id}`)

    return result
}

const getAllUser = async (req) => {
    const { keyword } = req.query

    let condition = {}

    if(keyword){
        condition = { ...condition, name: { $regex: keyword, $options: 'i'}}
    }

    const result = await Users.find(condition).select('_id name email role')

    return result
}

module.exports = {
    createUser,
    updateUser,
    getOneUser,
    getAllUser,
    createClient
}