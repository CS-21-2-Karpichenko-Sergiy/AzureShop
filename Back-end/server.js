require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsSettings = require('./config/corsSettings');
const { TableServiceClient } = require("@azure/data-tables");
const { QueueClient } = require("@azure/storage-queue");
const { BlobServiceClient, ContainerCreateOptions, PublicAccessType } = require("@azure/storage-blob");
const checkQueue = require('./controllers/Queue/checkQueue');
const PORT = process.env.PORT || 3500;
app.use(cors(corsSettings));
app.use(express.json({limit: '50mb'}));
app.use('/categories', require('./routes/categories'));
app.use('/goods', require('./routes/goods'));

startupChecks().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`)
    })
})

async function startupChecks(){
    const tableServiceClient = await TableServiceClient.fromConnectionString(process.env.connString, { allowInsecureConnection: true } );
    await createTableIfDoesntExist(tableServiceClient, 'categories')
    await createTableIfDoesntExist(tableServiceClient, 'goods')
    const queueClient = new QueueClient(process.env.AZURE_STORAGE_QUEUE_CONNECTION_STRING, "pending-thumbnails");
    const createQueueResponse = await queueClient.createIfNotExists();
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_BLOB_CONNECTION_STRING
    );
    await createBlobContainerIfDoesntExist(blobServiceClient, 'test', )
    await createBlobContainerIfDoesntExist(blobServiceClient, 'thumbnails')
}

async function createTableIfDoesntExist(tableServiceClient, tableName) {
    await tableServiceClient.createTable(tableName, {
      onResponse: (response) => {
        if (response.status === 409) {
          console.log(`Table ${tableName} already exists`);
        }
      }
    });
}

async function createBlobContainerIfDoesntExist(blobServiceClient, containerName) {
    var options = { access: "container"}
    try {
        await blobServiceClient.createContainer(containerName, options)
    }
    catch {
        console.log("Error")
    }
}