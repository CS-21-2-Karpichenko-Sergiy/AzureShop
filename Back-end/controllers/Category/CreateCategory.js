const { TableClient } = require("@azure/data-tables");
const { v4: uuidv4 } = require("uuid");

const handleCreateCategory = async (req, res) => {
    const categoryName = uuidv4()
    const { categoryParent } = req.body;
    let categoryVisibleName;
    !req.body.categoryVisibleName ? categoryVisibleName = categoryName : categoryVisibleName = req.body.categoryVisibleName;
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        const task = {
            partitionKey: "categoryobject",
            rowKey: categoryName,
            parent: categoryParent,
            name: categoryVisibleName,
        };
        if (categoryParent !== "root"){
            let categoryTableData = tableClient.listEntities();
            let parentFinded = false;
            for await (let category of categoryTableData) {
                if (category.visibleName === categoryParent){
                    parentFinded = true;
                }
            }
            if(!parentFinded){
                res.status(404).json({'error': "Parent couldn't be finded"})
                return
            }
            let insertResult = await tableClient.createEntity(task);
            res.status(201).json({'result': insertResult})
        }
        else {
            let insertResult = await tableClient.createEntity(task);
            res.status(201).json({'result': insertResult})
        }
    } catch (error){
        console.log(error)
        res.status(404).json({"result": error})
    }
}

module.exports = {handleCreateCategory}