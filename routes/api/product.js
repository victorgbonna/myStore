const express = require('express')
const router = express.Router()
// const { addCategory,getCategories, destroyCategory } = require('../../modules/category/services/categoryService')
const {addProduct,getProducts}=require('../../modules/product/service')
const Product = require('../../modules/product/model')
const { errorWrapper, successWrapper } = require('../../helpers/backend')
const upload = require('../../config/image')
// const { joiErrorFormatter /* mongooseErrorFormatter */ } = require('../../utils/validationFormatter')


router.post('/', upload.fields([{name:'images'}]),async (req, res) => {
    req.body.old_price=req.body.new_price=req.body.price
    delete req.body.price    
    req.body.img_files=[]
    // console.log(req.body)
    req.files.images.forEach(imageData => {
      console.log(imageData.filename)
      req.body.img_files.push(imageData.filename)
    });
    console.log(req.body)
    try{
      const product=await addProduct(req.body)
      req.session.flashData={
        message:{ 
          type: 'green',
          body: 'Post added succesfully'
        }
      }
      return res.json({product})
      } 
    catch(e){
      req.session.flashData={
        message:{ 
          type: 'red',
          body: 'Something went wrong'
      }
    }
    return res.json({error:'not'})
  }
})
// router.get('/', async (req, res) => {
//   req.body.old_price=req.body.new_price=req.body.price
//   delete req.body.price
//   console.log(req.body)
//   try{
//       const product=await addProduct(req.body)
//       console.log('yes')
//       return successWrapper({
//       res,
//       message: 'Product created successfully',
//       data: {product}
//       })
//   }catch(e){
//   console.log('no')
//     return errorWrapper({
//       res,
//       errors:e,
//       message: 'Validation errors',
//       type: 'Validation Errors',
//       status:200
//     })
//   }

// })

router.put('/edit/:slug', upload.fields([{name:'images'}]),async (req, res) => {
  // console.log(req.body)
  req.body.img_files=req.body.img_files.split(',')
  if(req.files.images){
    req.files.images.forEach(imageData => {
      req.body.img_files.push(imageData.filename)
    });
  }

  try {
    product= await Product.findOneAndUpdate({slug: req.params.slug}, req.body,{
      new: true, 
      runValidators:true
  })
  req.session.flashData={
    message:{ 
      type: 'green',
      body: 'Product updated succesfully'
    }
  }
    return res.json({product})
  } 
  catch(e){
    console.log(e)
    req.session.flashData={
      message:{ 
        type: 'red',
        body: 'Something went wrong'
    }
  }
    return res.json({error:'not'})
  }
})

router.delete('/delete/:slug',async (req, res) => {
  console.log('yes')
  try{
    await Product.remove({slug:req.params.slug})
    req.session.flashData={
      message:{ 
        type: 'green',
        body: 'Product deleted succesfully'
    }
   }
  }
  catch(e){
    console.error(e)
    req.session.flashData={
      message:{ 
        type: 'red',
        body: 'Something went wrong'
    }
  }
}
  return res.redirect('/')
})

module.exports=router