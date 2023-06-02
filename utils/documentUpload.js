const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
    }
  });

  //validate file format required
  function fileFilter (req, file, cb) {
      cb(null, true)
    
  }
  const document = multer({ storage, fileFilter });

  //file size formatter 
  const fileSizeFormatter = (bytes, decimal) => {
    if(bytes === 0){
        return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return(
        parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
    );
}

  module.exports = {document, fileSizeFormatter};