module.exports={
    port:parseInt(process.env.PORT) || 5000,
    secretKey:process.env.SECRET_KEY || 'keyboard cat',
    mongoUrl:process.env.MONGODB_URI3 || 'mongodb://localhost:27017/mystore',
    baseUrl: process.env.BASE_URL || 'http://localhost:5000',
    assetUrl: process.env.ASSET_URL || 'http://localhost:5000'
}