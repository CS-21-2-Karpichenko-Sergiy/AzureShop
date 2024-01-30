const express = require('express');
const router = express.Router();
const listGoods = require('../controllers/Goods/ListGoods');
const createGood = require('../controllers/Goods/CreateGood');
const updateGood = require('../controllers/Goods/UpdateGood');
const deleteGood = require('../controllers/Goods/DeleteGood');

router.get("/ListGoods", listGoods.handleListGoods);

router.post("/CreateGood", createGood.handleCreateGood);

router.put("/UpdateGood", updateGood.handleUpdateGood);

router.delete("/DeleteGood", deleteGood.handleDeleteGood);

module.exports = router;