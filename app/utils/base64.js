function bufferToBase64(buffer) {
    return Buffer.from(buffer).toString('base64');
  }

module.exports = { bufferToBase64 };