async function addItem(cart, item) {
  cart.push(item);
}

async function displayCart(cart) {
  console.log("\n🛒 SEU CARRINHO:");

  if (cart.length === 0) {
    console.log("Carrinho vazio.");
    return;
  }

  cart.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.name} | R$ ${item.price.toFixed(2)} | ${item.quantity}x | Subtotal: R$ ${item.subtotal().toFixed(2)}`
    );
  });
}

async function removeItem(cart, index) {
  if (index < 0 || index >= cart.length) {
    console.log("❌ Item inválido.");
    return;
  }

  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
    console.log("➖ Quantidade reduzida.");
  } else {
    cart.splice(index, 1);
    console.log("🗑️ Item removido.");
  }
}

async function calculateTotal(cart) {
  return cart.reduce((total, item) => total + item.subtotal(), 0);
}

export { addItem, displayCart, removeItem, calculateTotal };
