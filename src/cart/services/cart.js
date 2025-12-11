// o que meu carrinho faz?
//Casos de uso
//✅-> adicionar itens no carrinho
<<<<<<< HEAD
function addItem(userCart, itemName) {
=======
async function addItem(userCart, itemName) {
>>>>>>> 467574ff5bebf34fefd06fc0c7316724c82f7c2b
  userCart.push(itemName);
}

//✅-> Calcular total
<<<<<<< HEAD
function calculateTotal(userCart) {
    if (!userCart || userCart.length === 0) {
    return "0.00";
  }
  const result = userCart.reduce((total, item) => total + (item.price * item.qntd), 0);
  return result.toFixed(2);
}

//✅-> Excluir itens do carrinho
function deleteItem(userCart, itemName) {
=======
async function calculateTotal(userCart) {
  console.log("\nTotal do carrinho é: ");
  const result = userCart.reduce((total, item) => total + item.subtotal(), 0);
  console.log(`🛍️ Total: ${result}`);
}

//✅-> Excluir itens do carrinho
async function deleteItem(userCart, itemName) {
>>>>>>> 467574ff5bebf34fefd06fc0c7316724c82f7c2b
  const index = userCart.findIndex((item) => item.itemName === itemName);

  if (index !== -1) {
    userCart.splice(index, 1);
  }
}

//✅ -> Remover item - diminui item
<<<<<<< HEAD
function removeItem(userCart, item) {
=======
async function removeItem(userCart, item) {
>>>>>>> 467574ff5bebf34fefd06fc0c7316724c82f7c2b
  const indexFound = userCart.findIndex(
    (product) => product.itemName === item.itemName
  );

  if (indexFound == -1) {
    console.log("Item não encontrado");
    return;
  }

  if (userCart[indexFound].qntd > 1) {
    userCart[indexFound].qntd -= 1;
    return;
  }
  if (userCart[indexFound].qntd == 1) {
    userCart.splice(indexFound, 1);
    return;
  }
}

//✅-> Mostrar os itens do carrinho
<<<<<<< HEAD
function displayCart(userCart) {
=======
async function displayCart(userCart) {
>>>>>>> 467574ff5bebf34fefd06fc0c7316724c82f7c2b
  console.log("\nSeu carrinho: ");
  userCart.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.itemName} - R$ ${item.price} |Qntd: ${
        item.qntd
<<<<<<< HEAD
      } | Subtotal = ${(item.price * item.qntd).toFixed(2)}`
=======
      } | Subtotal = ${item.subtotal()}`
>>>>>>> 467574ff5bebf34fefd06fc0c7316724c82f7c2b
    );
  });
}

export { addItem, calculateTotal, deleteItem, removeItem, displayCart };
