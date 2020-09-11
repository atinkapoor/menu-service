import * as AWS from "aws-sdk";
import axios from "axios";

const s3 = new AWS.S3({
  region: AWS_REGION,
  apiVersion: "2006-03-01"
});

export const getCategoryS3Url = async storeParams => {
  let cats;
  try {
    const categoryAPIUrl = `/categories`;
    const categoryRequestParams = {
      url: categoryAPIUrl,
      method: "GET",
      headers: {
        "content-type": "application/json",
        "x-api-key": X_API_KEY
      }
    };
    cats = await axios(categoryRequestParams);
  } catch (e) {
    console.log(`Fetching categories failed for store:, Error: ${e.message}`);
  }

  const s3CategoryPath = `categories.json`;

  const params = {
    Body: JSON.stringify(cats.data, null, 2),
    Bucket: S3_BUCKET,
    Key: s3CategoryPath,
    ACL: "public-read",
  };
  await s3.putObject(params).promise();
  return `https://${S3_BUCKET}.s3-${AWS_REGION}.amazonaws.com/${s3CategoryPath}`;
};

