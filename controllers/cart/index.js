const CartModel = require("../../models/cartModel/cart")
const { makeRespObj } = require("../../AppUtils/")

const addCart = async (userInputs) => {
    try {
        const { userId, cartItems } = userInputs

        const existingCart = await CartModel.findUser(userId)

        if (existingCart) {
            if (existingCart.cartItems && existingCart.cartItems.length > 0) {
                const existingIndex = existingCart.cartItems.findIndex(cartItem=>cartItem.variantPriceData.toString()===cartItems[0].variantPriceData.toString())
                if(existingIndex !== -1){
                    // update the quantity of an existing item
                    existingCart.cartItems[existingIndex].quantity += 1
                }else{
                    existingCart.cartItems =
                        existingCart.cartItems.concat(cartItems)
                }
            } else {
                existingCart.cartItems = cartItems
            }

            const updatedCart = await existingCart.save()

            return makeRespObj({
                status_code: 200,
                message: "Cart updated successfully.",
                data: updatedCart,
            })
        } else {
            const newCart = await CartModel.createCart({
                userData: userId,
                cartItems,
            })

            if (newCart) {
                return makeRespObj({
                    status_code: 201,
                    message: "Product added to the cart.",
                    data: newCart,
                })
            } else {
                return makeRespObj({
                    status_code: 400,
                    message: "Failed to add the product to the cart.",
                    data: newCart,
                })
            }
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            message: "Internal server error.",
            catchErr: error,
        })
    }
}

const getCartData = async (userInputs) => {
    try {
        const { userId } = userInputs

        const cartList = await CartModel.fetchCartList(userId)
        if (cartList) {

            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: cartList
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "Data not found",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const removeCartItem = async (userInputs) => {
    try {
        const { userId, variantPriceData } = userInputs

        const cart = await CartModel.findOneCart(userId, variantPriceData)

        if (!cart) {
            return makeRespObj({
                status_code: 409,
                message: "Cart Not Found",
            })
        }
        // Remove the item from the list of items in the cart document and save it to MongoDB
        cart.cartItems = cart.cartItems.filter(
            (item) =>
                item.variantPriceData.toString() !== variantPriceData.toString()
        );
        await cart.save();

        return makeRespObj({
            status_code: 200,
            message: "Item removed from the cart successfully",
        })
        
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const incrementItemQuantity = async (userInputs) => {
    try {
        const { userId, variantPriceData } = userInputs

        const cart = await CartModel.findOneCart(userId, variantPriceData)

        if (!cart) {
            return makeRespObj({
                status_code: 409,
                message: "Cart Not Found",
            })
        }

        cart.cartItems = cart.cartItems.map((item) => {
            if(item.variantPriceData.toString() === variantPriceData.toString()) item.quantity += 1
            return item;
        });

        await cart.save()

        return makeRespObj({
            status_code: 200,
            message: "Item quantity incremented successfully",
        })

    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const decrementItemQuantity = async (userInputs) => {
    try {
        const { userId, variantPriceData } = userInputs

        const cart = await CartModel.findOneCart(userId, variantPriceData)

        if (!cart) {
            return makeRespObj({
                status_code: 409,
                message: "Cart Not Found",
            })
        }

        cart.cartItems = cart.cartItems.map((item) => {
            if(item.variantPriceData.toString() === variantPriceData.toString()) {
                if(item.quantity > 1) item.quantity -= 1
            }
            return item;
        });

        await cart.save()

        return makeRespObj({
            status_code: 200,
            message: "Item quantity decremented successfully",
        })
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}
const syncUserCart = async (userInputs) => {
    try {
        const { userId, cartItems, updatedAt } = userInputs

        const cart = await CartModel.syncCart({userData:userId,cartItems, updatedAt})

        if (!cart) {
            return makeRespObj({
                status_code: 200,
                message: "Failed to synchronize Cart",
            })
        }

        return makeRespObj({
            status_code: 200,
            message: "Cart synchronized successfully",
            data: cart
        })
    } catch (error) {
        console.log(error)
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

module.exports = {
    addCart,
    getCartData,
    removeCartItem,
    incrementItemQuantity,
    decrementItemQuantity,
    syncUserCart
}
