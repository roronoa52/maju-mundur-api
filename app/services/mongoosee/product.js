const Images = require('../../api/v1/images/model')
const { checkingImage } = require('./images')
const { NotFoundError, BadRequestError } = require('../../errors')
const Product = require('../../api/v1/product/model')

const getAllProducts = async (req) => {
    const { keyword } = req.query

    let condition = {}

    if(keyword){
        condition = { ...condition, name: { $regex: keyword, $options: 'i'}}
    }

    const result = await Product.find(condition)
    .populate({
        path: 'image',
        select: '_id name dataImage typeImage'
    })
    .select('_id name price image qty')

    return result
}

const getOneProduct = async (req) => {
    const { id } = req.params

    const result = await Product.findOne({ _id: id})
    .populate({
        path: 'image',
        select: '_id name dataImage typeImage'
    })
    .select('_id name price image qty')

    if(!result) throw new NotFoundError(`Tidak ada product dengan id: ${id}`)

    return result
}

const createProduct = async (req) => {
    const { name, price, image, qty } = req.body

    await checkingImage(image)

    const check = await Product.findOne({ name})

    if(check) throw new BadRequestError('Product duplikat')

    const result = await Product.create({ 
        name: name,
        price: price,
        qty: qty,
        image: image,
        userId: req.user.id
    })

    return result
}

const updateProduct = async (req) => {
    const { id } = req.params;
    const { name, image, price, qty } = req.body;
    const userId = req.user.id;

    const product = await Product.findOne({ _id: id, userId });
    if (!product) throw new NotFoundError(`Tidak ada product dengan id: ${id} yang dimiliki oleh user ini`);

    const updateFields = {};
    if (name) updateFields.name = name;
    if (image) {
        await checkingImage(image);
        updateFields.image = image;
    }
    if (price) updateFields.price = price;

    if (qty) updateFields.qty = qty;

    if (name) {
        const check = await Product.findOne({
            name,
            _id: { $ne: id }
        });
        if (check) throw new BadRequestError('Product nama duplikat');
    }

    const result = await Product.findOneAndUpdate(
        { _id: id, userId },
        updateFields,
        { new: true, runValidators: true }
    );

    if (!result) throw new NotFoundError(`Tidak ada product dengan id: ${id} yang dimiliki oleh user ini`);

    return result;
}

const deleteProduct = async (req) => {
    const { id } = req.params;
    const userId = req.user.id;

    const product = await Product.findOne({ _id: id, userId });
    if (!product) throw new NotFoundError(`Tidak ada produk dengan id: ${id} yang dimiliki oleh user ini`);

    const result = await Product.findOneAndDelete({
        _id: id,
        userId
    });

    if (!result) throw new NotFoundError(`Tidak ada produk dengan id: ${id} yang dimiliki oleh user ini`);

    return result;
}


module.exports = {
    createProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
}

