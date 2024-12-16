const multer = require('multer')
const path = require('path')

const { folderNames } = require('../helpers/constants')

const storage = multer.diskStorage({
  destination: (req, _, cb) => cb(null, `uploads/${folderNames[req.params.folderName]}`),
  filename: (req, file, cb) =>
    cb(
      null,
      'Tex-Ro-' +
      req.params.folderName +
      '-' +
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname).toLowerCase()
    )
})

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.webp']
  const extname = path.extname(file.originalname).toLowerCase()

  if (allowedFileTypes.includes(extname)) {
    cb(null, true)
  } else {
    const error = new Error('File type not supported.')
    error.status = 400
    cb(error, false)
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

module.exports = upload
