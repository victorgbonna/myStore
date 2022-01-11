// const {calcOffset}=require('../../helpers/backend')

const paystack = (request) => {
    const MySecretKey = '';
    const initializePayment = (form, mycallback) =>{
    const option={
     url:'https://api.paystack.co/transaction/initialize',
     headers:{
       Authorization: 'Bearer sk_test_a1afb90a2216f7ce7d58e51d586ae5792d86ef90',
       'content-type':'application/json',
       'cache-control':'no-cache'
     },
    form
   }
   const callback=(err, response,body)=>{
     return mycallback(err,body)
   }
   request.post(option, callback)
 }
 const verifyPayment = (ref,mycallback) => {
    const option = {
      url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
      headers : {
        authorization: 'Bearer sk_test_a1afb90a2216f7ce7d58e51d586ae5792d86ef90',
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      }
    }
    const callback = (err, response, body)=>{
        return mycallback(err, body);
    }
    request(option,callback);
 }
 return {initializePayment, verifyPayment};
}

module.exports= paystack