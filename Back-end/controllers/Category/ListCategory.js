const { TableClient } = require("@azure/data-tables");

const handleListCategory = async (req, res) => {
    const { categoryName, categoryParent, categoryVisibleName} = req.body;
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        if (!req.body.requestedCategory){
            let categories = tableClient.getEntity("categoryobject", "root")
            res.status(201).json({'result': categories})
            return;
        }
        else{
            let categories = tableClient.getEntity("categoryobject", req.body.requestedCategory)
            res.status(201).json({'result': categories})
            return;
        }          
    } catch (error){
        console.log(error)
        res.status(404).json({"result": error})
    }
}

module.exports = {handleListCategory}