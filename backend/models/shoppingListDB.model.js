const mongoose = require('mongoose');

const shoppingListItemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    itemName: {type: String, required: true},
    itemWeight: {type: Number, required: true},
    itemPC: {type: Number,},
    itemPCWeight: {type: Number,},
    itemPackages: {type: Number,},
    itemPackagesWeight: {type: Number,},
    itemChecked: {type: Boolean, required: true}
});

const shoppingListSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    shoppingListName: {type: String, required: true },
    shoppingListItems: {type: [shoppingListItemSchema], required: true},
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);