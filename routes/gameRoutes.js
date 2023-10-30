const router = require("express").Router();
const gameController = require("../controllers/game.js")

router.get("/game",gameController.getGame);

module.exports = router;