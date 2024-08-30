import multer from 'multer';
import path from 'path';

const imgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imgs');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/contracts');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const paymentImgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/payments');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});




// Multer upload instance
const imgUpload = multer({ storage: imgStorage  });
const docUpload = multer({ storage: docStorage });
const paymentImgUpload = multer({ storage: paymentImgStorage });

export { imgUpload, docUpload, paymentImgUpload };