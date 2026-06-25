const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createExpense, getExpenses, updateExpense, deleteExpense,
} = require('../controllers/expenseController.js');

router.use(protect);
router.post('/', createExpense);
router.get('/', getExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;