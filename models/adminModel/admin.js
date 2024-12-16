const adminSchema = require("./schema")

const createAdmin = async (insertData) => {
    const admin = new adminSchema(insertData)

    const adminResult = await admin
        .save()
        .then((data) => {
            return data
        })
        .catch((err) => {
            return null
        })

    return adminResult
}

const fetchOneAdmin = (email) => {
    return adminSchema
        .findOne({ email, isDeleted: false })
        .then((adminData) => {
            return adminData
        })
        .catch((error) => {
            return null
        })
}

const fetchAdminData = (search, start, limit) => {
    let searchFilter = []
    if (search !== "") {
        searchFilter.push({
            $or: [{ name: { $regex: ".*" + search + ".*", $options: "i" } }],
        })
    }

    searchFilter.push({
        isDeleted: false,
    })

    const query = searchFilter.length > 0 ? { $and: searchFilter } : {}

    return adminSchema
        .find(query)
        .sort({ createdAt: -1 })
        .skip(start)
        .limit(limit)
        .select("-isDeleted")
        .then((adminData) => {
            return adminData
        })
        .catch((error) => {
            return null
        })
}

const updateAdmin = async (adminId, updateData) => {
    const adminResult = adminSchema
        .updateOne({ _id: adminId }, updateData)
        .then((model) => {
            return true
        })
        .catch((err) => {
            return false
        })

    return adminResult
}

const fetchAdminById = async (adminId) => {
    const adminData = await adminSchema
        .findOne({
            _id: adminId,
            isDeleted: false,
        })        
        .select("-isDeleted")
        .then((data) => {
            return data
        })
        .catch((err) => {
            return null
        })
    return adminData
}

const deleteAdmin = async (adminId) => {
    const adminResult = await adminSchema
        .deleteOne({ _id: adminId })
        .then((data) => {
            return data
        })
        .catch((err) => {
            return null
        })
    return adminResult
}

module.exports = {
    fetchAdminById,
    updateAdmin,
    fetchAdminData,
    fetchOneAdmin,
    createAdmin,
    deleteAdmin,
}
