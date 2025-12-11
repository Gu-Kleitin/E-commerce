// O que o item faz?

// Casos de usa
//✅ -> Criar o item com o valor correto do subtotal
<<<<<<< HEAD
function createItem(itemName, price, qntd) {
=======
async function createItem(itemName, price, qntd) {
>>>>>>> 467574ff5bebf34fefd06fc0c7316724c82f7c2b
  return {
    itemName,
    price,
    qntd,
<<<<<<< HEAD
=======
    subtotal: () => price * qntd,
>>>>>>> 467574ff5bebf34fefd06fc0c7316724c82f7c2b
  };
}

export default createItem;
