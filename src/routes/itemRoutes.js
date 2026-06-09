const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Rutas Públicas (Búsqueda, categorías y detalles)
router.get('/', itemController.getItems);
router.get('/categories', itemController.getCategories);
router.get('/:id', itemController.getItemById);

// Rutas CRUD (Protegidas: requiere autenticación y rol de ADMIN)
router.post('/', authMiddleware, roleMiddleware('ADMIN'), itemController.createItem);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), itemController.updateItem);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), itemController.deleteItem);

module.exports = router;
