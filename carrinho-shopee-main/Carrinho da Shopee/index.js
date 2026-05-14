// index.js (UX/UI MELHORADA + PAGAMENTO COMPLETO)

import readline from "readline";
import * as cartService from "./cart.js";
import createItem from "./item.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const cart = [];

const produtos = [
  { id: 1, nome: "Xbox Series S", preco: 2500 },
  { id: 2, nome: "Xbox Series X", preco: 4500 },
  { id: 3, nome: "PlayStation 5", preco: 4800 },
  { id: 4, nome: "Controle PS5", preco: 350 },
  { id: 5, nome: "Controle Xbox", preco: 300 },
];

// limpar tela
function limparTela() {
  console.clear();
}

// HEADER bonito
function header() {
  console.log("=====================================");
  console.log("        🛍️ LOJA");
  console.log("=====================================\n");
}

// listar produtos
function listarProdutos() {
  console.log("🎮 PRODUTOS DISPONÍVEIS:\n");

  produtos.forEach((p) => {
    console.log(
      `[${p.id}] ${p.nome.padEnd(20)} R$ ${p.preco.toFixed(2)}`
    );
  });

  console.log("");
}

// menu
function menuUI() {
  console.log("📋 MENU:");
  console.log("[1] ➕ Adicionar produto");
  console.log("[2] 🛒 Ver carrinho");
  console.log("[3] ➖ Remover item");
  console.log("[4] 💳 Finalizar compra");
  console.log("[0] 🚪 Sair\n");
}

// render tela
function render() {
  limparTela();
  header();
  listarProdutos();
  menuUI();
}

// pausa
function pause(cb) {
  rl.question("\n↩️ Pressione ENTER para continuar...", () => cb());
}

// loop principal
function menu() {
  render();

  rl.question("👉 Escolha uma opção: ", async (op) => {
    switch (op) {
      case "1":
        return adicionar();

      case "2":
        limparTela();
        header();
        await cartService.displayCart(cart);
        return pause(menu);

      case "3":
        return remover();

      case "4":
        return finalizar();

      case "0":
        console.log("\n👋 Obrigado por usar a loja!");
        rl.close();
        return;

      default:
        console.log("\n❌ Opção inválida.");
        return pause(menu);
    }
  });
}

// adicionar
function adicionar() {
  render();

  rl.question("🆔 ID do produto (0 = voltar): ", (id) => {
    if (id === "0") return menu();

    const produto = produtos.find((p) => p.id == id);

    if (!produto) {
      console.log("\n❌ Produto não encontrado.");
      return pause(menu);
    }

    rl.question("🔢 Quantidade: ", async (qtd) => {
      const quantidade = Number(qtd);

      if (isNaN(quantidade) || quantidade <= 0) {
        console.log("\n❌ Quantidade inválida.");
        return pause(menu);
      }

      const item = await createItem(
        produto.nome,
        produto.preco,
        quantidade
      );

      await cartService.addItem(cart, item);

      console.log("\n✅ Produto adicionado ao carrinho!");
      return pause(menu);
    });
  });
}

// remover
async function remover() {
  limparTela();
  header();
  await cartService.displayCart(cart);

  if (cart.length === 0) return pause(menu);

  rl.question("\n🔎 Escolha o item (0 = voltar): ", (num) => {
    if (num === "0") return menu();

    const index = Number(num) - 1;

    if (isNaN(index) || !cart[index]) {
      console.log("\n❌ Item inválido.");
      return pause(menu);
    }

    const item = cart[index];

    console.log(`\n📦 Produto: ${item.name}`);
    console.log(`📊 Quantidade atual: ${item.quantity}`);

    rl.question("➖ Quantidade a remover: ", (qtd) => {
      const quantidade = Number(qtd);

      if (
        isNaN(quantidade) ||
        quantidade <= 0 ||
        quantidade > item.quantity
      ) {
        console.log("\n❌ Quantidade inválida.");
        return pause(menu);
      }

      item.quantity -= quantidade;

      if (item.quantity === 0) {
        cart.splice(index, 1);
        console.log("\n🗑️ Item removido completamente.");
      } else {
        console.log("\n➖ Quantidade atualizada.");
      }

      return pause(menu);
    });
  });
}

// pagamento
async function finalizar() {
  limparTela();
  header();

  await cartService.displayCart(cart);

  if (cart.length === 0) {
    console.log("\n❌ Carrinho vazio.");
    return pause(menu);
  }

  const total = await cartService.calculateTotal(cart);

  console.log("\n===============================");
  console.log(`💰 TOTAL: R$ ${total.toFixed(2)}`);
  console.log("===============================\n");

  console.log("💳 FORMAS DE PAGAMENTO:");
  console.log("[1] PIX ⚡");
  console.log("[2] Crédito 💳");
  console.log("[3] Débito 🏦");
  console.log("[0] Cancelar\n");

  rl.question("👉 Escolha o pagamento: ", (op) => {
    switch (op) {
      case "1":
        console.log("\n⚡ Pagamento via PIX aprovado!");
        break;

      case "2":
        console.log("\n💳 Pagamento no crédito aprovado!");
        break;

      case "3":
        console.log("\n🏦 Pagamento no débito aprovado!");
        break;

      case "0":
        console.log("\n❌ Pagamento cancelado.");
        return pause(menu);

      default:
        console.log("\n❌ Opção inválida.");
        return pause(menu);
    }

    console.log("\n🎉 Compra finalizada com sucesso!");
    rl.close();
  });
}

// start
menu();
