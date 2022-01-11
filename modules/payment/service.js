const Payment= require('./model')
const addPayment = async (paymentInput) =>{
    const payment=new Payment(paymentInput)
    await payment.save()
    return payment
}
const getApayment = async (paymentId) =>{
    try{
        const payment= await Payment.findById(paymentId)
        if (payment){
            return payment
        }
    }
    catch{
        return null
    }
    // const [product, subProducts ]=await Promise.all([
    //     Product.findOne({slug}).lean(),
    //     Product.find({}).lean()
    //   ])
    
}

module.exports= {addPayment, getApayment}