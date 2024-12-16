const Payment = require("../../models/paymentModel/payment")
const CartModel = require("../../models/cartModel/cart")
const ProductModel = require("../../models/productModel/product")


const savePayment = async ({ order_id, razorpay_payment_id, razorpay_signature }) => {
    try {

        const createPayment = await Payment.createPayment({
            order_id,
            razorpay_payment_id,
            razorpay_signature,
        })
        if (createPayment) {
            return {
                status: 201,
                message: " payment saved successful",
                data: createPayment,
            }
        }
    } catch (error) {
        return {
            status_code: 500,
            error: error,
        }
    }
}

const getCartData = async ({ userId }) => {
    try {

        const cartList = await CartModel.getCart(userId)

        if (cartList) {
            const cartItems = cartList.cartItems

            let total = 0
            for (const cartItem of cartItems) {
                for (const productPrice of cartItem.productPrices) {
                    const variantPriceData = productPrice?.variantPriceData

                    const price = variantPriceData?.price
                    const quantity = productPrice.quantity

                    if (cartItem.productData.isIncludedTax) {
                        const itemTotal = price * quantity
                        total += itemTotal
                    } else {
                        const taxRate = 0.2
                        const taxedPrice = price + price * taxRate
                        const itemTotal = taxedPrice * quantity
                        total += itemTotal
                    }

                    const itemTotal = price * quantity
                    total += itemTotal
                }
            }
            return {
                status_code: 200,
                message: "Data found successfully",
                cartId: cartList._id,
                cartItems: cartList.cartItems,
                total: total,
            }
        } else {
            return {
                status_code: 400,
                message: "Data not found",
            }
        }
    } catch (error) {
        return {
            status_code: 500,
            error: error,
        }
    }
}

const getPaymentData = async () => {
    try {
        const paymentList = await Payment.fetchPaymentData()

        if (paymentList) {
            return {
                status_code: 200,
                message: "Data found successfully",
                data: paymentList,
            }
        } else {
            return {
                status_code: 400,
                message: "Data not found",
            }
        }
    } catch (error) {
        return {
            status_code: 500,
            error: error,
        }
    }
}

const getProduct = async ({ productId, variantPriceData, quantity } ) => {
    try {
        const fetchProduct = await ProductModel.fetchProductForPayment(
            productId
        )

        if (fetchProduct) {
            const selectedVariant = fetchProduct.variantPriceData.find(
                (variant) =>
                    variant._id.toString() === variantPriceData.toString()
            )

            let totalPrice

            if (selectedVariant) {
                if (fetchProduct.isIncludedTax) {
                    const basePrice = selectedVariant.price
                    totalPrice = basePrice * quantity
                } else {
                    const basePrice = selectedVariant.price
                    const taxRate = 0.02
                    totalPrice = basePrice * quantity * (1 + taxRate)
                }

                return {
                    status_code: 200,
                    message: "Data get",
                    totalPrice: totalPrice,
                    // productData: {
                    //     _id: fetchProduct._id,
                    //     name: fetchProduct.name,
                    //     shortDescription:fetchProduct.shortDescription,
                    //     thumbnailImage:fetchProduct.thumbnailImage,
                    //     isIncludedTax:fetchProduct.isIncludedTax
                    // },
                    // variantPriceData: selectedVariant,
                    // basePrice: selectedVariant.price,
                    // totalPrice: totalPrice,
                }
            } else {
                return {
                    status_code: 400,
                    message: "Selected variant not found in product",
                }
            }
        } else {
            return {
                status_code: 400,
                message: "No Data Found",
            }
        }
    } catch (error) {
        return {
            status_code: 500,
            error: error,
        }
    }
}

module.exports = {
    getCartData,
    savePayment,
    getPaymentData,
    getProduct,
}
