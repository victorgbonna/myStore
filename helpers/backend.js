const calcOffset=({pageNo, pageSize})=>{
  return(pageNo-1)*pageSize
}

const successWrapper=({
    status=200,
    message='Success',
    data=null,
    res
})=>{
    return res.status(status).json({
        message,
        data
    })
}
const errorWrapper=({
    status=500,
    message='Something went wrong',
    errors='Unknown Error',
    type=null,
    res
})=>{
    return res.status(status).json({
        message,
        errors,
        type
    })
}

module.exports={successWrapper, errorWrapper, calcOffset}