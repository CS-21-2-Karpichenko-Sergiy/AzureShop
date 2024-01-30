const { TableClient } = require("@azure/data-tables");

const handleUpdateCategory = async (req, res) => {
    const { categoryName, categoryParent, categoryVisibleName} = req.body;
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        const task = {
            partitionKey: "categoryobject",
            rowKey: categoryName,
            
        };
        if (categoryParent){
            task.parent = categoryParent
        }
        if (categoryVisibleName){
            task.Name = categoryVisibleName
        }
        let updateResult = await tableClient.updateEntity(task, "Merge");
        res.status(201).json({'result': updateResult})
    } catch (error){
        console.log(error)
        res.status(404).json({"result": error})
    }
}

module.exports = {handleUpdateCategory}