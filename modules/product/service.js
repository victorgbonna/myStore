const Product= require('./model')
const {calcOffset}=require('../../helpers/backend')


const addProduct = async (productInput) =>{
    const product=new Product(productInput)
    await product.save()
    return product
}
const getProducts= async ({pageNo=1, keyword})=>{    
    pageNo= parseInt(pageNo)
    pageSize=5
    const conditions={}
    if(keyword){
      conditions.name={
        $regex: keyword
      }
    }
    const [products, total]=await Promise.all([
      Product.find(conditions)
      .skip(calcOffset({pageNo, pageSize}))
      .limit(pageSize)
      .lean(),
      Product.countDocuments(conditions)
    ])
    const meta={total, pageNo}
    // console.log('products',products)
    // console.log('meta', meta)
    return {products, meta}
//     // console.log(categories)
}
const getAproduct = async ({slug}) =>{
  // console.log(slug)
  const [product, subProducts ]=await Promise.all([
    Product.findOne({slug}).lean(),
    Product.find({}).lean()
  ])
  return {product,subProducts}

}

module.exports= {addProduct, getProducts, getAproduct}