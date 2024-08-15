const express = require('express');

const ingredientController = require('../backend/controllers/ingredient.controller')
const dishController = require('../backend/controllers/dish.controller');
const portionNameController = require('../backend/controllers/portionName.controller');
const dietRequirementsController = require('../backend/controllers/dietRequirements.controller')
const dietController = require('../backend/controllers/diet.controller')
const shoppingListController = require('../backend/controllers/shoppingList.controller')
const router = express.Router();

router.get('/api/portionNames', portionNameController.getAllPortionNames);
router.post('/api/portionNames', portionNameController.savePortionName);
router.delete('/api/portionNames/delete/:id', portionNameController.deletePortionNameById);

router.get('/api/ingredients', ingredientController.getAllIngredientNames);
router.get('/api/ingredients/:id', ingredientController.getIngredientById);
router.get('/api/ingredients/search/:str', ingredientController.getIngredientsWithStringInName);
router.post('/api/ingredients', ingredientController.saveIngredient);
router.delete('/api/ingredients/delete/:id',ingredientController.deleteIngredientById);

router.post('/api/dishes', dishController.saveDish);
router.get('/api/dishes', dishController.getAllDishNames);
router.get('/api/dishes/:id', dishController.getDishById);
router.get('/api/dishes/search/:str', dishController.getDishesWithStringInName);
router.delete('/api/dishes/delete/:id',dishController.deleteDishById);
router.get('/api/dishes/copy/:id', dishController.copyDishById);

router.post('/api/diets', dietController.saveDiet);
router.get('/api/diets', dietController.getAllDietsNames);
router.get('/api/diets/:id', dietController.getDietById);
router.delete('/api/diets/delete/:id', dietController.deleteDietById);
router.get('/api/diets/copy/:id', dietController.copyDietById);

router.post('/api/dietRequirements', dietRequirementsController.saveDietRequirements);
router.get('/api/dietRequirements', dietRequirementsController.getAllDietRequirementsNames);
router.get('/api/dietRequirements/:id', dietRequirementsController.getDietRequirementsById);
router.delete('/api/dietRequirements/delete/:id',dietRequirementsController.deleteDietRequirementsById);

router.post('/api/shoppinglists', shoppingListController.saveShoppingList);
router.get('/api/shoppinglists', shoppingListController.getAllShoppingListsNames);
router.post('/api/shoppinglists/dietsItemsFetch', shoppingListController.dietsItemsFetch);
router.get('/api/shoppinglists/:id', shoppingListController.getShoppingListById);
router.delete('/api/shoppinglists/delete/:id', shoppingListController.deleteShoppingListById);

module.exports = router;