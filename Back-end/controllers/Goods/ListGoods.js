const { TableClient } = require("@azure/data-tables");

const handleListGoods = async (req, res) => {
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "goods", { allowInsecureConnection: true } );
        let items = tableClient.getEntity("Item")
        res.status(201).json({'result': items}) 
    } catch (error){
        console.log(error)
        res.status(404).json({"result": error})
    }
}

module.exports = {handleListGoods}