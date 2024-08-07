const notFound = (req, res) => {
    res.status(404).send({ msg: 'Route does not exit'})
}

module.exports = notFound