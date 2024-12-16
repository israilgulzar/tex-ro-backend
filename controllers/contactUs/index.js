const ContactUsModel = require("../../models/contactUsModel/contactus")
const { pageMaker, makeRespObj } = require("../../AppUtils")
const { sendEmail } = require("../../AppUtils/emailSend")

const addConcatctUs = async ({ email, userId, ...contactus }) => {
    try {

        const createContactUs = await ContactUsModel.createContactUs({
            email,
            userData:userId,
            ...contactus,
        })

        const emailContent = `
        Hi there! 👋

        We're here to assist you. If you have any questions or need help, please feel free to contact us at 9499520855. We're just an email away. 😊

        Best regards,

        Taj Perfumes 🌟`

         await sendEmail(emailContent, email, "😊 Your Feedback Matters! Share Your Thoughts 💬")

        if (createContactUs) {
            return makeRespObj({
                status_code: 201,
                message: contactus?.isSubscriber?'Subscribed Sucessfully':"We will contact you soon 😊.",
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: contactus?.isSubscriber?'Subscription Failed':"Failed to submit form 💬!",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
            message: "Oops something went wrong!",
        })
    }
}
const getContactUsData = async ({ search, startToken, endToken }) => {
    try {
        const { page, perPage } = pageMaker({ startToken, endToken })

        const getContactUsData = await ContactUsModel.fetchContactUsData(
            search,
            page,
            perPage
        )
        const recordCount = await ContactUsModel.fetchContactUsCount(search)

        if (getContactUsData) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: {
                    contactUsData: getContactUsData,
                    recordCount: recordCount,
                },
            })
        } else {
            return makeRespObj({
                status_code: 404,
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
const getSubscriberList = async ({ search, startToken, endToken }) => {
    try {
        const { page, perPage } = pageMaker({ startToken, endToken })

        const { contactUsList, total} = await ContactUsModel.fetchSubscribersData(
            search,
            page,
            perPage
        )

        if (contactUsList) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: {
                    subscriberList: contactUsList,
                    total,
                },
            })
        } else {
            return makeRespObj({
                status_code: 404,
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

const deleteContactUs = async ({ contactUsId }) => {
    try {

        const deleteContactUs = await ContactUsModel.deleteContactUs(
            contactUsId
        )
        if (deleteContactUs) {
            return makeRespObj({
                status_code: 200,
                message: "ContactUs delete successfully",
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "fail to delete contactUs",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const unsubscribe = async ({ contactUsId }) => {
    try {

        const getContactUs = await ContactUsModel.fetchContactUsById(
            contactUsId
        )

        if (!getContactUs) {
            return makeRespObj({
                status_code: 404,
                message: "ContactUs not found",
            })
        }

        getContactUs.isSubscriber = false
        const updatedContactUs = await getContactUs.save()

        if (updatedContactUs) {
            return makeRespObj({
                status_code: 200,
                message: "Unsubscribed successfully",
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Failed to unsubscribe",
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
    addConcatctUs,
    getContactUsData,
    unsubscribe,
    deleteContactUs,
    getSubscriberList
}
