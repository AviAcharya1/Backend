const express = require('express');
const util = require('util');
const fs = require('fs');
const unlinkFile = util.promisify(fs.unlink);
const router = express.Router();
const multer = require('multer');
const isAuth = require('../middlewares/Authentication');
// const { uploadFile, getFileStream } = require('../utils/s3');

const upload = multer({ dest: 'uploads' });

router.post('/image', isAuth, upload.single('image'), async (req, res) => {
  const { file } = req;
  try {
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    res.status(200).json({ imagePath: `/upload/image/${result.Key}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/image/:key', async (req, res) => {
  try {
    const fileBuffer = await getFileStream(req.params.key);
    res.status(200).send(fileBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
