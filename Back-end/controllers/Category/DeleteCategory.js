const { TableClient } = require("@azure/data-tables");

const GetChilds = (TableClient, parentName) => {
    let childs = [];
    let objects = TableClient.getEntity("categoryobject", parentName)
    for(let object in objects){
        if(object.parent === parentName) {
            childs.push(i.Name)
            let childs_of_child = GetChilds(TableClient, i.Name)
            if(child_of_child.length > 0){
                childs = childs.concat(childs_of_child);
            }
        } 
    }
    return childs
}

const handleDeleteCategory = async (req, res) => {
    const { categoryName } = req.body;
    let cascade = false
    req.body.cascade === "true" ? cascade = true : cascade = false
    try {
        const tableClient = TableClient.fromConnectionString(process.env.connString, "categories", { allowInsecureConnection: true } );
        if (cascade === true) {
            let cascadeCollapseQueue = [categoryName]
            cascadeCollapseQueue = cascadeCollapseQueue.concat(GetChilds(tableClient, categoryName));
            do {
                var deleteResult = await tableClient.deleteEntity("categoryobject", cascadeCollapseQueue[0]);
                cascadeCollapseQueue.shift()
            } while (cascadeCollapseQueue.length > 0)
            res.status(201).json({'result': deleteResult})

        } else {
            let deleteResult = await tableClient.deleteEntity("categoryobject", categoryName);
            res.status(201).json({'result': deleteResult})
        }
    } catch (error){
        res.status(404).json({"result": error})
    }
}

module.exports = {handleDeleteCategory}