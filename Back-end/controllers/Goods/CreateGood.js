const { TableClient } = require("@azure/data-tables");
const { v1: uuidv1 } = require("uuid");
const { v4: uuidv4 } = require("uuid");
const updateEntity = require('./innerFunctions/updateEntity');

const handleCreateGood = async (req, res) => {
    const { categoryName, goodVisibleName, price, imageBase64, fileRes } = req.body;
    try {
        const blobName = 'image_' + uuidv1() + '.' + fileRes;
        let test = imageBase64.split(',')
        let urlData = await updateEntity.changeThumbnailAndPreview(test[1], fileRes, blobName)
        thumbnailURL = urlData[0]
        previewURL = urlData[1]
        const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );
        const task = {
            partitionKey: "Item",
            rowKey: uuidv4(),
            category: categoryName,         
            visibleName: goodVisibleName,  
            price: price,
            thumbnailName: blobName,
            thumbnailURL: thumbnailURL,
            previewName: blobName,
            previewURL: previewURL
        };
        let insertResult = await tableClient.createEntity(task);
        res.status(201).json({'result': insertResult})
    } catch (error){
        console.log(error)
        res.status(404).json({"result": error})
    }
}

module.exports = {handleCreateGood}