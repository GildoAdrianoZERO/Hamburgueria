const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartitemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];


//abrir o motal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"

})

//fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//botao fechar modal
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    //console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        
        //adicionar no carrinho
        addToCart(name, price)

    }
})

//função add carrinho
function addToCart(name, price){

    const existinItem = cart.find(item => item.name === name )

    if(existinItem){
        //se o item existe aumenta a quantidade +1 
        existinItem.quantity +=1;
        
    }else{
        cart.push({
            name, 
            price,
            quantity: 1,
        })    
    }

   
    updateCartModal()
}

//atualizar carrinho
function updateCartModal(){

    cartitemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartitemElement = document.createElement("div");
        cartitemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartitemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
                
            </div>
        `
        total += item.price * item.quantity;

        cartitemsContainer.appendChild(cartitemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}

//função remover item
cartitemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        
        cart.splice(index, 1);
        updateCartModal();
    }


}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//finalizar pedido
checkoutBtn.addEventListener("click", async function(){

    const isOpen = checkRestaauranteOpen();
    if(!isOpen){
       
        Toastify({
            text: "Restaurante Fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "rigth", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();

      return;

    }

    if(cart.length === 0) return;

    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar o pedido para api whats
    const cartitems = cart.map((item) =>{
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} `
        )
    }).join("")

    const message = encodeURIComponent(cartitems)
    const phone = "8194708695"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();
    try {
        // Envia a mensagem usando fetch
        const response = await fetch(url);

        if(response.ok) {
            // Mensagem enviada com sucesso
            console.log("Mensagem enviada com sucesso!");
            // Limpa o carrinho
            cart = [];
            updateCartModal();
            // Fecha o modal
            cartModal.style.display = "none";
        } else {
            // Se houver algum problema ao enviar a mensagem
            console.error("Erro ao enviar a mensagem:", response.status);
            // Exiba uma mensagem de erro para o usuário, se desejar
        }
    } catch (error) {
        // Se ocorrer um erro na requisição
        console.error("Erro ao enviar a mensagem:", error);
        // Exiba uma mensagem de erro para o usuário, se desejar
    }
})


function checkRestaauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaauranteOpen();
if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")

}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}