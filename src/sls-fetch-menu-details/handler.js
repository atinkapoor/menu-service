import {
  getCategoryS3Url,
  getMenuS3Url
} from "./fetchMenuDetails";

module.exports.handler = async (event) => {
// console.log(event);
  let storeParams = event;

  storeParams.categoriesFileUrl = await getCategoryS3Url(
    storeParams
  );

  return storeParams;
};
