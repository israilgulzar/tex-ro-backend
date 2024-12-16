const fs = require('fs')
const path = require('path')

// custom helpers
const upload = require('../../AppUtils/upload')
const { makeRespObj } = require('../../AppUtils')
const { folderNames } = require('../../helpers/constants')

// middleware is here
// const AdminAuth = require("../../helpers/middlewares/adminAuth")

// upload dir
const uploadDirectory = 'uploads'

// custom function to unlinking file
const unlinkOldFile = (req, res, next) => {

  const [{ folderName }, { ofn: oldFileName }] = [req?.params, req.query]

  if (req.originalUrl.split('/').includes('deleteFile') && !oldFileName) {

    return res.status(400).json(
      makeRespObj({
        status_code: 400,
        message: 'File not found.'
      })
    )
  }

  if (oldFileName && oldFileName.trim() !== '') {
    const filePath = path.join(uploadDirectory + `/${folderNames[folderName]}/${oldFileName.trim()}`)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)

      return next()
    }

    return res.status(400).json(
      makeRespObj({
        status_code: 400,
        message: 'File not found.'
      })
    )

  }

  return next()
}

module.exports = async app => {
  app.post('/uploadFile/:folderName', unlinkOldFile, upload.single('file'), (req, res) => {
    const file = req.file


    if (!req.file || !Object.keys(folderNames).includes(req.params.folderName)) {
      return res.status(400).json(
        makeRespObj({
          status_code: 400,
          message: 'something went wrong with file!'
        })
      )
    }

    return res.status(200).json(
      makeRespObj({
        status_code: 200,
        message: 'File uploaded successfully.',
        data: file ? req?.params?.folderName + '/' + file.filename : null
      })
    )
  })

  app.post('/deleteFile/:folderName', unlinkOldFile, (_, res) => {

    return res.status(200).json(
      makeRespObj({
        status_code: 200,
        message: 'File deleted successfully.'
      })
    )
  })
  
  app.get('/showContent/:folderName/:fileName', (req, res) => {

    const { folderName, fileName } = req.params

    let contentType = 'image/jpeg'
    const extname = path.extname(fileName.split('.')[1]).toLowerCase()
    if (extname === '.png') {
      contentType = 'image/png'
    } else if (extname === '.gif') {
      contentType = 'image/gif'
    }

    const fileStream = fs.createReadStream(path.resolve(__dirname, '..', '..', 'uploads', folderNames[folderName], fileName.trim()));

    res.setHeader('Content-Type', contentType)

    fileStream.pipe(res)

    fileStream.on('error', err => {
      if (err.code === 'ENOENT') {

        res.status(404).json({ message: 'File not found' })
      } else {

        res.status(500).json({ message: 'Internal Server Error' })
      }
    })
  })
}
