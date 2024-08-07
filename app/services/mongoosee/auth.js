const Admins = require('../../api/v1/admin/model');
const Clients = require('../../api/v1/client/model');
const { BadRequestError, UnauthorizedError } = require('../../errors');
const { createJWT, createTokenUser } = require('../../utils');

const signin = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const result = await Admins.findOne({ email: email });

  if (!result) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials');
  }
  const token = createJWT({ payload: createTokenUser(result) });

  await Admins.findOneAndUpdate(
    {  email: email },
    { token },
    { new: true, runValidators: true }
  );

  return { token, name: result.name, email: result.email };
};

const signinClient = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const result = await Clients.findOne({ email: email });

  if (!result) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials');
  }
  const token = createJWT({ payload: createTokenUser(result) });

  await Clients.findOneAndUpdate(
    {  email: email },
    { token },
    { new: true, runValidators: true }
  );

  return { token, name: result.name, email: result.email };
};

module.exports = { signin, signinClient };