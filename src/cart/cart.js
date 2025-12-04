import createItem from "./services/itens.js";
import * as cartService from "./services/cart.js";

const cart = [];
const myWhishList = [];

console.log("Seu carrinho de compras");

const item1 = await createItem("Mouse", 12.9, 1);
const item2 = await createItem("hotwheels bugatti chiron", 31.9, 4);

await cartService.addItem(cart, item1);
await cartService.addItem(cart, item2);

await cartService.removeItem(cart, item2);
await cartService.removeItem(cart, item2);
await cartService.removeItem(cart, item2);

await cartService.displayCart(cart);
// await cartService.deleteItem(cart, item2.itemName);
// await cartService.deleteItem(cart, item1.itemName)

await cartService.calculateTotal(cart);
