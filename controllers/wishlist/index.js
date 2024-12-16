const WishlistModel = require("../../models/userwishlistModel/userwishlist")
const { makeRespObj } = require("../../AppUtils")

const addWishlist = async ({ userId, products }) => {
    try {

        const existingWishlist = await WishlistModel.fetchWishlist(userId)

        if (existingWishlist) {
            for (const productId of products) {
                if (!existingWishlist.products.includes(productId)) {
                    existingWishlist.products.push(productId)
                }
            }

            const updatedWishlist = await existingWishlist.save()
            if (updatedWishlist) {
                return makeRespObj({
                    status_code: 200,
                    message: "Products added to wishlist.",
                    data: updatedWishlist,
                })
            } else {
                return makeRespObj({
                    status_code: 400,
                    message: "Failed to update wishlist.",
                })
            }
        } else {
            const createWishlist = await WishlistModel.createWishlist({
                userId,
                products,
            })

            if (createWishlist) {
                return makeRespObj({
                    status_code: 201,
                    message: "Products added to wishlist.",
                    data: createWishlist,
                })
            } else {
                return makeRespObj({
                    status_code: 400,
                    message: "Failed to added wishlist.",
                })
            }
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const removeFromWishlist = async ({ userId, productId }) => {
    try {

        const existingWishlist = await WishlistModel.fetchWishlist(userId)

        if (existingWishlist) {
            existingWishlist.products = existingWishlist.products.filter(
              (p) => p._id.toString() !== productId.toString()
            );
            console.log(productId,existingWishlist)

                const updatedWishlist = await existingWishlist.save()
                if (updatedWishlist) {
                    return makeRespObj({
                        status_code: 200,
                        message: "Product removed from wishlist.",
                        data: updatedWishlist,
                    })
                } else {
                    return makeRespObj({
                        status_code: 400,
                        message: "Failed to update wishlist.",
                    })
                }

        } else {
            return makeRespObj({
                status_code: 404,
                message: "Wishlist not found",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const getWishlist = async ({ userId }) => {
    try {
        const existingWishlist = await WishlistModel.fetchWishlist(userId)

        if (existingWishlist) {
            return makeRespObj({
                status_code: 200,
                message: "Wishlist get successfully.",
                data: existingWishlist,
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "Wishlist not found",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

module.exports = {
    addWishlist,
    getWishlist,
    removeFromWishlist,
}
