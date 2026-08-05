const express = require("express");
const router = express.Router();

// Perbaikan path: ditambahkan 's' -> ../controllers/
const penulisController = require("../controllers/penulisController");
const komikController = require("../controllers/komikController");
const genreController = require("../controllers/genreController");
const authMiddleware = require("../middleware/authMiddleware");

// --- Auth Routes ---
router.post("/register", penulisController.register);
router.post("/login", penulisController.login);

// --- Penulis CRUD Routes ---
router.get("/penulis", authMiddleware, penulisController.getAll);
router.post("/penulis", authMiddleware, penulisController.create);
router.put("/penulis/:id", authMiddleware, penulisController.update);
router.delete("/penulis/:id", authMiddleware, penulisController.remove);

// --- Genre Routes ---
router.get("/genre", authMiddleware, genreController.getAll);
router.post("/genre", authMiddleware, genreController.create);
router.put("/genre/:id", authMiddleware, genreController.update);
router.delete("/genre/:id", authMiddleware, genreController.remove);

// --- Komik Routes ---
router.get("/komik", authMiddleware, komikController.getAll);
router.post("/komik", authMiddleware, komikController.create);
router.put("/komik/:id", authMiddleware, komikController.update);
router.delete("/komik/:id", authMiddleware, komikController.remove);

module.exports = router;