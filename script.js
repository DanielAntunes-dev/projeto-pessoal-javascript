const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutbtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addresInput = document.getElementById("address");
const addresWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

// fechar o modal quando clicar fora ou no fechar
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal || event.target === closeModalBtn) {
    cartModal.style.display = "none";
  }
});

// Adicionar no carrinho
menu.addEventListener("click", (event) => {
  let parentButton = event.target.closest(".add-to-card-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    // adicionar no carrinho
    addToCart(name, price);
  }
});

// FUNÇÃO PARA ADICIONAR NO CARRINHO
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    // se o item já existe, aumenta a quantidade +1
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// ATUALIZA CARRINHO
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
        <div>
            <p class="font-mediun">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>

        <button class="remove-from-cart-btn" data-name="${item.name}">
            Remover   
        </button>


    </div>
    `;
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

// FUNÇÃO PARA REMOVER ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    console.log(name);

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];
    console.log(item);

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

// MANIPULAÇÃO DO INPUT ENDEREÇO
addresInput.addEventListener("input", (event) => {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addresInput.classList.remove("border-red-500");
    addresWarn.classList.add("hidden");
  }
});

// FINALIZAR PEDIDOS
checkoutbtn.addEventListener("click", () => {
  const isOpen = checkRestauranteOpen();
  if (!isOpen) {
    Toastify({
      text: "Restaurante fechado!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;

  if (addresInput.value === "") {
    addresWarn.classList.remove("hidden");
    addresInput.classList.add("border-red-500");
    return;
  }

  // Enviar o pedido para api Whatsapp
  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`;
    })
    .join("");

  const message = encodeURIComponent(cartItems);
  const phone = "27981571426";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addresInput.value}`,
    "_blank"
  );

  cart = [];
  updateCartModal();
});

// VERIFICAÇÃO DE HORÁRIO DE FUNCIONAMENTO
function checkRestauranteOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22; // true = restaurante aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
