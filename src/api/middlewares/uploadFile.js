import multer from 'multer';

const uploadFile = dest => multer({ dest });

export default uploadFile;
