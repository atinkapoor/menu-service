import axios from "axios";
const path = require('path');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const allItemsFiles = await s3functions.downloadAllObjectsS3(params);

  const categoriesList = await axios.get(categoriesFileUrl);
  const assignedCategories = await assignCategories(downloadPath);
  params = {
    Bucket: process.env.S3_MENU_ITEMS_BUCKET,
    Key: `${menuItemFolderName}/categoriesGenerated-${postType}-${market}.json`,
    Body: JSON.stringify(assignedCategories, null, 2),
    ACL: "public-read",
  };
  await s3functions.putS3(params);
  
  const baselineMenus = await getMenus(downloadPath);

  const menuFileName = `${aggregatorName}-${menuItemFolderName}-${posType}-${market}.json`;
  params = {
    Bucket: process.env.S3_MENU_ITEMS_BUCKET,
    Key: menuFileName,
    Body: JSON.stringify(baselineMenus, null, 2),
    ACL: "public-read",
  };
  await s3functions.putS3(params);

  return {
    'menuURL': `https://${process.env.S3_MENU_ITEMS_BUCKET}.s3-${process.env.AWS_REGION_NAME}.amazonaws.com/${menuFileName}`
  }
};
