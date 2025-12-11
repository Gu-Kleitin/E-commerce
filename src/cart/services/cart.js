// o que meu carrinho faz?
//Casos de uso
//✅-> adicionar itens no carrinho
function addItem(userCart, itemName) {
  userCart.push(itemName);
}

//✅-> Calcular total
function calculateTotal(userCart) {
    if (!userCart || userCart.length === 0) {
    return "0.00";
  }
  const result = userCart.reduce((total, item) => total + (item.price * item.qntd), 0);
  return result.toFixed(2);
}

//✅-> Excluir itens do carrinho
function deleteItem(userCart, itemName) {
  const index = userCart.findIndex((item) => item.itemName === itemName);

  if (index !== -1) {
    userCart.splice(index, 1);
  }
}

//✅ -> Remover item - diminui item
function removeItem(userCart, item) {
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
function displayCart(userCart) {
  console.log("\nSeu carrinho: ");
  userCart.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.itemName} - R$ ${item.price} |Qntd: ${
        item.qntd
      } | Subtotal = ${(item.price * item.qntd).toFixed(2)}`
    );
  });
}

export { addItem, calculateTotal, deleteItem, removeItem, displayCart };
