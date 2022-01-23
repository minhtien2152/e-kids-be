const mongoose = require("mongoose")

const URL = "https://avatars.dicebear.com/api/avataaars/";

const generateRandomAvatar = () => {
  
  let hair = "";
  if (Math.random()%2===1) hair = "top[]=shortHair";
  else hair = "top[]=longHair";
  const genUrl = URL +mongoose.Types.ObjectId()+ ".svg?mood[]=happy&" + hair;
  
  return genUrl;
};

async function downloadImage(url) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  const fileName = `../uploads/file-${Date.now()}.svg`;
  fs.writeFile(fileName, buffer, () => console.log("finished downloading!"));
  return fileName;
}

module.exports = generateRandomAvatar
