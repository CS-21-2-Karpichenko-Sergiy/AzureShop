const { BlobServiceClient } = require("@azure/storage-blob");
const Jimp = require('jimp');


async function changeThumbnailAndPreview(imageBase64, fileRes, blobName){

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient("images");
    const thumbnail = containerClient.getBlockBlobClient(blobName + "_thumbnail");
    const preview = previewContainerClient.getBlockBlobClient(blobName);
    const blobOptions = { blobHTTPHeaders: { blobContentType: `image/${fileRes}` } };
    let buf = Buffer.from(imageBase64, 'base64')
    const uploadBlobResponse = await thumbnail.upload(buf, buf.length, blobOptions);
    const image = await Jimp.create(buf)
    image.resize(64,64, function(err){
        if (err) throw err;
    })
    const previewBuf = await image.getBufferAsync(`image/${fileRes}`)
    const previewUploadBlobResponse = await preview.upload(previewBuf, previewBuf.length, blobOptions);

    return [thumbnail.url, preview.url]
}

module.exports = {changeThumbnailAndPreview}