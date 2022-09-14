const fs = require("fs");
const axios = require("axios");

export const downloadFile = async (url:string) => {
  try {
    const dirName = "src/assets";
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
    const urlSplit = url.split("/");
    const fileName = urlSplit[urlSplit.length - 1];
    const DownloadUrl = url || null;
    const DownloadPath = `src/assets/${fileName}`;
    const streamData = await axios({
      url: DownloadUrl,
      method: "GET",
      responseType: "stream",
    });
    return new Promise((resolve, reject) => {
      streamData.data
        .pipe(fs.createWriteStream(DownloadPath))
        .on("finish", () => resolve({ isSucceded: true, path: DownloadPath }))
        .on("error", (e : any) => reject({ isSucceded: false }));
    });
  } catch (err) {
    return {
      isSucceded: false,
    };
  }
};
