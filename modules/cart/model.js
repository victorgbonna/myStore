function Cart(oldCart){
    // console.log('old cart', oldCart)
    this.items=oldCart.items
    // console.log('items', this.items)
    this.totalQty=oldCart.totalQty||0
    this.totalPrice=oldCart.totalPrice||0
    
    this.add=function(item,id){
        let storedItem=this.items[id]
        // console.log('id',storedItem)
        // console.log('storedItem',storedItem)
        if(!storedItem){
            storedItem=this.items[id]={item:item, qty:0,price:0}
            // console.log('no it is new')
            // console.log('this.items',this.items)
        }
        storedItem.qty++
        storedItem.price=storedItem.item.new_price*storedItem.qty
        this.totalQty++
        this.totalPrice+=storedItem.item.new_price
        // console.log('stored items', storedItem)
    }
    this.delete=function(id){
        let deleteItem=this.items[id]
        if(!deleteItem){return}
        this.totalQty-=deleteItem.qty
        this.totalPrice-=deleteItem.price
        delete this.items[id]
        
    }
    this.update=function(body){
        updateQty=0
        updatePrice=0
        for (id in body){
            let updateItem=this.items[id]
            updateQty+=(parseInt(body[id])-updateItem.qty)
            updatePrice+=((parseInt(body[id])-updateItem.qty)*updateItem.item.new_price)
            // console.log('new price', updatePrice)
            updateItem.qty=parseInt(body[id])
            updateItem.price=updateItem.item.new_price*parseInt(body[id])
        }
        // console.log(updateQty)
        // console.log(updatePrice)
        this.totalQty+=updateQty
        this.totalPrice+=updatePrice
        // console.log(this.totalQty)
        // console.log(this.totalPrice)
    }
    this.cartArray= function() {
        let arr=[]
        for(let id in this.items){
            arr.push(this.items[id])
        }
        // console.log(arr)
        return arr
    }
};

module.exports=Cart