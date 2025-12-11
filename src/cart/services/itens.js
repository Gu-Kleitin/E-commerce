// O que o item faz?

// Casos de usa
//✅ -> Criar o item com o valor correto do subtotal
function createItem(itemName, price, qntd) {
  return {
    itemName,
    price,
    qntd,
  };
}

export default createItem;
