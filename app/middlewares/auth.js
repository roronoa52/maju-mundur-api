const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { isTokenValid } = require("../utils");
const Users = require('../api/v1/admin/model');
const Clients = require('../api/v1/client/model');

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        const token = authHeader.split(' ')[1];

        const payload = isTokenValid({ token });
        
        if (!payload) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        const validToken = await Users.findOne({ token });
        
        if (!validToken) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        req.user = {
            email: payload.email,
            name: payload.name,
            id: payload.userId,
            role: payload.role
        };

        next();
    } catch (error) {
        next(error);
    }
};

const authenticateClient = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        const token = authHeader.split(' ')[1];

        const payload = isTokenValid({ token });
        
        if (!payload) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        const validToken = await Clients.findOne({ token });
        
        if (!validToken) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        req.user = {
            email: payload.email,
            name: payload.name,
            id: payload.userId,
            role: payload.role
        };

        next();
    } catch (error) {
        next(error);
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            throw new UnauthorizedError('Unauthorized to access this route')
        }
        next();
    }
}

module.exports = { authenticateUser, authorizeRoles, authenticateClient }