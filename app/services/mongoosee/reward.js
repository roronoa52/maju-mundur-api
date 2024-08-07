const Images = require('../../api/v1/images/model')
const { checkingImage } = require('./images')
const { NotFoundError, BadRequestError } = require('../../errors')
const Reward = require('../../api/v1/reward/model')

const getAllRewards = async (req) => {
    const { keyword } = req.query

    let condition = {}

    if(keyword){
        condition = { ...condition, name: { $regex: keyword, $options: 'i'}}
    }

    const result = await Reward.find(condition)
    .populate({
        path: 'image',
        select: '_id name dataImage typeImage'
    })
    .select('_id name price image')

    return result
}

const getOneRewards = async (req) => {
    const { id } = req.params

    const result = await Reward.findOne({ _id: id})
    .populate({
        path: 'image',
        select: '_id name dataImage typeImage'
    })
    .select('_id name price image')

    if(!result) throw new NotFoundError(`Tidak ada Reward dengan id: ${id}`)

    return result
}

const createRewards = async (req) => {
    const { name, price, image } = req.body

    await checkingImage(image)

    const check = await Reward.findOne({ name})

    if(check) throw new BadRequestError('Reward duplikat')

    const result = await Reward.create({ 
        name: name,
        price: price,
        image: image
    })

    return result
}

const updateRewards = async (req) => {
    const { id } = req.params;
    const { name, image, price, qty } = req.body;

    const reward = await Reward.findOne({ _id: id });
    if (!reward) throw new NotFoundError(`Tidak ada Reward dengan id: ${id} yang dimiliki oleh user ini`);

    const updateFields = {};
    if (name) updateFields.name = name;
    if (image) {
        await checkingImage(image);
        updateFields.image = image;
    }
    if (price) updateFields.price = price;
    if (qty) updateFields.qty = qty;

    if (name) {
        const check = await Reward.findOne({
            name,
            _id: { $ne: id }
        });
        if (check) throw new BadRequestError('Reward nama duplikat');
    }

    const result = await Reward.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true, runValidators: true }
    );

    if (!result) throw new NotFoundError(`Tidak ada Reward dengan id: ${id} yang dimiliki oleh user ini`);

    return updateFields;
}

const deleteRewards = async (req) => {
    const { id } = req.params;

    const reward = await Reward.findOne({ _id: id });
    if (!reward) throw new NotFoundError(`Tidak ada produk dengan id: ${id} yang dimiliki oleh user ini`);

    const result = await Reward.findOneAndDelete({
        _id: id
    });

    if (!result) throw new NotFoundError(`Tidak ada produk dengan id: ${id} yang dimiliki oleh user ini`);

    return result;
}


module.exports = {
    createRewards,
    getAllRewards,
    getOneRewards,
    updateRewards,
    deleteRewards,
}

