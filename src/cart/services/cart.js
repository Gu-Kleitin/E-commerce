// o que meu carrinho faz?
//Casos de uso
//✅-> adicionar itens no carrinho
async function addItem(userCart, itemName) {
  userCart.push(itemName);
}

//✅-> Calcular total
async function calculateTotal(userCart) {
  console.log("\nTotal do carrinho é: ");
  const result = userCart.reduce((total, item) => total + item.subtotal(), 0);
  console.log(`🛍️ Total: ${result}`);
}

//✅-> Excluir itens do carrinho
async function deleteItem(userCart, itemName) {
  const index = userCart.findIndex((item) => item.itemName === itemName);

  if (index !== -1) {
    userCart.splice(index, 1);
  }
}

//✅ -> Remover item - diminui item
async function removeItem(userCart, item) {
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
async function displayCart(userCart) {
  console.log("\nSeu carrinho: ");
  userCart.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.itemName} - R$ ${item.price} |Qntd: ${
        item.qntd
      } | Subtotal = ${item.subtotal()}`
    );
  });
}

export { addItem, calculateTotal, deleteItem, removeItem, displayCart };
