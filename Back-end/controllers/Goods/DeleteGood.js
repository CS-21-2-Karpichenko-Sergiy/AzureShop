const { TableClient } = require("@azure/data-tables");
const { BlobServiceClient } = require("@azure/storage-blob");

const handleDeleteGood = async (req, res) => {
    let deleteBlob = false;
    const {goodName} = req.body;
    req.body.deleteBlob === "true" ? deleteBlob = true : deleteBlob = false;
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );
        if (deleteBlob === true) {
            let blobDeletionResult = []
            const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING);
            let data = await tableClient.getEntity("Item", goodName)
            const blobName = data.thumbnailName
            const previewBlobName = data.previewName
            const containerClient = blobServiceClient.getContainerClient("test");
            const thumbnailContainerClient = blobServiceClient.getContainerClient("thumbnails");
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const previewBlockBlobClient = thumbnailContainerClient.getBlockBlobClient(previewBlobName);
            const options = {
                deleteSnapshots: 'include'
            }
            
              
            const deleteBlobResponse = await blockBlobClient.delete(options);
            blobDeletionResult.push(deleteBlobResponse)
            
            const deletePreviewBlobResponse = await previewBlockBlobClient.delete(options);
            blobDeletionResult.push(deletePreviewBlobResponse)
        
            let result = await tableClient.deleteEntity("Item", goodName);
            res.status(201).json({"result": result, 'blobDeletionResult': JSON.stringify(blobDeletionResult)})
        }
        else {
            let result = await tableClient.deleteEntity("Item", goodName);
            res.status(201).json({"result": result})
        }
        
    } catch (error){
        res.status(404).json({"result": error})
    }
}

module.exports = {handleDeleteGood}