const PolicyModel = require("../../models/policyModel/policy")

const getPolicyData = async ({type}) => {
    try {
        let policy
        if (type === 1) {
            policy = "privacyPolicy"
        } else if (type === 2) {
            policy = "termsAndConditions"
        } else if (type === 3) {
            policy = "refundPolicy"
        } else {
            return {
                status: false,
                status_code: 404,
                message: "Invalid type",
                data: null,
            }
        }

        const getPolicyData = await PolicyModel.fetchPolicy()

        if (getPolicyData !== null) {
            const data = {
                status: true,
                status_code: 200,
                message: "Policy get successfully",
                data: {
                    id: getPolicyData._id,
                    [policy]: getPolicyData[policy],
                },
            }
            return data
        } else {
            return {
                status: true,
                status_code: 404,
                message: "Data not found, Add Policy",
                data: [],
            }
        }
    } catch (error) {
        return {
            status: false,
            status_code: 500,
            message: "An unexpected error occurred",
            error: { server_error: "An unexpected error occurred" },
            data: null,
        }
    }
}

// create Or Update Policy
const addPolicy = async ({
    id,
    termsAndConditions,
    privacyPolicy,
    refundPolicy,
}) => {
    try {
        if (id) {
            const updateData = {
                termsAndConditions,
                privacyPolicy,
                refundPolicy,
            }
            const isUpdated = await PolicyModel.updatePolicy(id, updateData)

            if (!isUpdated) {
                return {
                    status: false,
                    status_code: 201,
                    message: "Failed to update Policy",
                }
            }

            return {
                status: true,
                message: "Policy updated successfully",
                status_code: 201,
            }
        } else {
            const insertData = {
                termsAndConditions,
                privacyPolicy,
                refundPolicy,
            }
            const createPolicy = await PolicyModel.createPolicy(insertData)

            if (!createPolicy) {
                return {
                    status: false,
                    status_code: 200,
                    message: "Failed to create policy",
                }
            }

            return {
                status: true,
                message: "Policy created successfully",
                status_code: 201,
                data: createPolicy,
            }
        }
    } catch (error) {
        return {
            status: false,
            status_code: 500,
            message: "An unexpected error occurred",
            error: { server_error: "An unexpected error occurred" },
            data: null,
        }
    }
}

module.exports = {
    addPolicy,
    getPolicyData,
}
