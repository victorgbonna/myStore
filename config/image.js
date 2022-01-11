const multer=require('multer')
const path=require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {  
      cb(null, path.join(path.dirname(require.main.filename), 'public/img/product_images'))
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // console.log(file)
        // console.log(file.originalname)
        // console.log(file.fieldname)
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
    
  })
  
const upload = multer({storage})

module.exports=upload