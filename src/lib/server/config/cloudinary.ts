import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env';

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_NAME,
    api_key: ENV.CLOUDINARY_ID,
    api_secret: ENV.CLOUDINARY_SECRET,
    secure: true
})

export { cloudinary }