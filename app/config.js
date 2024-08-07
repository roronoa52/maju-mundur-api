const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    urlDb : process.env.URL_MONGODB_DEV,
    PORT: process.env.PORT,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectURL: process.env.GOOGLE_REDIRECT_URL,
    jwtExpiration: '24h',
    jwtSecret: 'jwtSecret',
    gmail: process.env.EMAIL,
    password: process.env.PASSWORD_APPLICATION,
    urlServer: process.env.URL_SERVER
}