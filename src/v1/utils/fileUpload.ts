import multer from 'multer';
import path from 'path';
import QRCode from 'qrcode';

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
    cb(null, 'public/contracts/contract_delivery_doc');
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

export async function qrCodeGenerator(pathurl:string):Promise<string> {
    try {
        return  await QRCode.toDataURL(pathurl)
    } catch (error:any) {
        throw new Error()
    }
}
