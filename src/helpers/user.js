import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const dirname = path.resolve();
const accessAsync = promisify(fs.access);

const getAvatarFilePath = filepath => {
  const avatarFilePath = path.join(dirname, filepath);
  return avatarFilePath;
};

const deleteAvatarFile = async filepath => {
  const avatarFilePath = getAvatarFilePath(filepath);
  const res = await accessAsync(avatarFilePath, fs.constants.F_OK);
  if (!res) {
    fs.unlinkSync(avatarFilePath);
    return true;
  }
  return false;
};

const userHelper = {
  getAvatarFilePath,
  deleteAvatarFile,
};

export default userHelper;
