import request from "./axios";
import { startsWith } from "lodash";
/**
 * @desc 将文件上传七牛
 * @param {string} file 需要上传的文件
 */
export function uploadFile(file, uploadUrl) {
  uploadUrl = startsWith(uploadUrl, "/api")
    ? uploadUrl.substring(4)
    : uploadUrl;
  return new Promise((resolve, reject) => {
    var formData = new FormData();
    formData.append("file", file);
    request(uploadUrl, {
      method: "POST",
      processData: false,
      data: formData,
      withCredentials: false,
    }).then((response) => {
      resolve(response.data[0].url);
    });
  });
}
