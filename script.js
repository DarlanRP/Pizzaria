let cart = [];
let modalQt = 1;
let modalKey = 0;

const d = (e) =>document.querySelector(e);
const ds = (e) => document.querySelectorAll(e);

pizzaJson.map((item, index) => {
    let pizzaItem = d('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `${item.price[2].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        d('.pizzaBig img').src = pizzaJson[key].img;
        d('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        d('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        d('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price[2].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
        d('.pizzaInfo--size.selected').classList.remove('selected');

        ds('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex === 2 ){
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

            size.addEventListener('click', ()=>{
                d('.pizzaInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');
                    
                let pr = pizzaJson[key].price[sizeIndex];
    
                d('.pizzaInfo--actualPrice').innerHTML = `${pr.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
                
             }
            )
            
        });

        d('.pizzaInfo--qt').innerHTML = modalQt;

        d('.pizzaWindowArea').style.opacity = 0;
        d('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {d('.pizzaWindowArea').style.opacity = 1; },100)
    })

    d('.pizza-area').append(pizzaItem);

});

const closeModal = () => {
    d('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {d('.pizzaWindowArea').style.display = 'none'; },500);
};

ds('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal)
})

d('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1) {
        modalQt--;
        d('.pizzaInfo--qt').innerHTML = modalQt;
    }
    if(modalQt < 1) {
        closeModal()
    }
})

d('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    d('.pizzaInfo--qt').innerHTML = modalQt;
})

d('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(d('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    }else{
    cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt,
    });

    }
    updateCart();
    closeModal();
});

d('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0){
        d('aside').style.left = '0';
    }
});

d('.menu-closer').addEventListener('click', () => {
    d('aside').style.left = '100vw';
});

function updateCart() {
    d('.menu-openner span').innerHTML = cart.length;
   if(cart.length > 0) {
    d('aside').classList.add('show');
    d('.cart').innerHTML = '';
    let subtotal = 0;
    let desc = 0;
    let total = 0;

    for(let i in cart) {
        let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
        subtotal += pizzaItem.price[cart[i].size] * cart[i].qt;
        let cartItem = d('.models .cart--item').cloneNode(true);
        
        let pizzaSizeName;
        switch(cart[i].size){
            case 0:
                pizzaSizeName = 'P';
                break;
            case 1:
                pizzaSizeName = 'M';
                break;
            case 2:
                pizzaSizeName = 'G'
                break;
        }

        let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

        cartItem.querySelector('img').src = pizzaItem.img;
        cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
        cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
        cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
            if(cart[i].qt > 1){
                cart[i].qt--;
            }else{
                cart.splice(i, 1);
            }
            updateCart()
        })
        cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
            cart[i].qt++;
            updateCart()
        })

        
        d('.cart').append(cartItem);
    }
    desc = subtotal * 0.1;
    total = subtotal - desc;
    
    d('.subtotal span:last-child').innerHTML = `${subtotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    d('.desconto span:last-child').innerHTML = `${desc.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    d('.total span:last-child').innerHTML = `${total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    
}else{
    d('aside').classList.remove('show');
    d('aside').style.left = '100vw';
}
};

d('.cart--finalizar').addEventListener('click', () =>{
    let namePizza = [];
    let qtd = [];
    let pizzas = [];
    let tota = d('.total span:last-child').innerHTML.replace(/\&nbsp;/g, '');
    let cliente = d('.names').value;
    let street = d('.street').value;
    let cep = d('.cep').value;


    ds('.cart--item-nome').forEach((nomePizza) => {
        return namePizza.push(nomePizza.innerHTML)
    })

    ds('.cart--item--qt').forEach((qtItem) => {
        return qtd.push(qtItem.innerHTML);
    })

    namePizza.shift();
    qtd.shift();

    for (let i = 0; i <namePizza.length; i++) {
        pizzas.push(`${qtd[i] } ${namePizza[i]}`);
    }
       
    confirm(
        `   Confira o seu pedido:
        ${pizzas}
        Total: ${tota.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
        Cliente: ${cliente}
        Endereço: ${street}
        CEP: ${cep}
        `)

    
})