const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Rutas Públicas (Búsqueda, categorías y detalles)
router.get('/', itemController.getItems);
router.get('/categories', itemController.getCategories);
router.get('/:id', itemController.getItemById);

// Rutas CRUD (Serán protegidas con autenticación el Día 2)
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
