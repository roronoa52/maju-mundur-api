const { checkingImage } = require('./images')
const { NotFoundError, BadRequestError } = require('../../errors')
const Transaction = require('../../api/v1/transaction/model')
const Product = require('../../api/v1/product/model')
const Reward = require('../../api/v1/reward/model')
const User = require('../../api/v1/admin/model')
const Client = require('../../api/v1/client/model')

const getAllTransaction = async (req) => {
    const { keyword } = req.query

    let condition = {}

    if(keyword){
        condition = { ...condition, name: { $regex: keyword, $options: 'i'}}
    }

    const result = await Transaction.find(condition)
    .populate({
        path: 'merchant',
        select: '_id name'
    })
    .populate({
        path: 'client',
        select: '_id name'
    })
    .populate({
        path: 'product',
        select: '_id name qty price'
    })
    .select('_id name qty price merchant client product')

    return result
}

const getOneTransaction = async (req) => {
    const { id } = req.params

    const result = await Transaction.findOne({ _id: id})
    .populate({
        path: 'merchant',
        select: '_id name'
    })
    .populate({
        path: 'client',
        select: '_id name'
    })
    .populate({
        path: 'product',
        select: '_id name qty price'
    })
    .select('_id name qty price merchant client product')

    if(!result) throw new NotFoundError(`Tidak ada product dengan id: ${id}`)

    return result
}

const createTransaction = async (req) => {
    const { merchantId, productId, qty } = req.body;
    const userId = req.user.id;

    const checkProduct = await Product.findOne({ _id: productId });
    if (!checkProduct) throw new BadRequestError('Produk tidak ditemukan');

    const checkMerchant = await User.findOne({ _id: merchantId });
    if (!checkMerchant) throw new BadRequestError('Merchant tidak ditemukan');

    const checkClient = await Client.findOne({ _id: userId });

    if (checkProduct.qty < qty) throw new BadRequestError('Kuantitas produk tidak mencukupi');

    const price = checkProduct.price * qty;

    const transaction = await Transaction.create({
        merchant: merchantId,
        client: userId,
        product: productId,
        qty,
        price,
    });

    const remainingQty = checkProduct.qty - qty;
    const addPoint = checkClient.point + 1

    await Product.findOneAndUpdate(
        { _id: productId },
        { qty: remainingQty },
        { new: true, runValidators: true }
    );

    await Client.findOneAndUpdate(
        { _id: userId },
        { point: addPoint },
        { new: true, runValidators: true }
    );

    return transaction;
}

const createTransactionReward = async (req) => {
    const { merchantId, rewardId } = req.body;
    const userId = req.user.id;

    const checkClient = await Client.findOne({ _id: userId });

    const checkReward = await Reward.findOne({ _id: rewardId });
    if (!checkReward) throw new BadRequestError('Reward tidak ditemukan');

    const checkMerchant = await User.findOne({ _id: merchantId });
    if (!checkMerchant) throw new BadRequestError('Merchant tidak ditemukan');

    if(checkReward.price <= checkClient.point){
        const transaction = await Transaction.create({
            merchant: merchantId,
            client: userId,
            product: rewardId,
            qty: 0,
            price: checkReward.price,
        });

        const remainingPoint = checkClient.point - checkReward.price;

        await Client.findOneAndUpdate(
            { _id: userId },
            { point: remainingPoint },
            { new: true, runValidators: true }
        );

        return transaction;
    }

    throw new BadRequestError('Point anda tidak cukup')

}


module.exports = {
    getAllTransaction,
    getOneTransaction,
    createTransaction,
    createTransactionReward
}

