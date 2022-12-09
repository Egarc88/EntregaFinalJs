const formularioUsuario = document.getElementById('formulario')
const tituloBienvenida = document.getElementById('tituloBienvenida')
const nombreUsuario = document.getElementById('nombre')
const apellidoUsuario = document.getElementById('apellido')


const infoUsuario = {}

formularioUsuario.onsubmit = (event) => {
    event.preventDefault()
    infoUsuario.nombre = nombreUsuario.value
    infoUsuario.apellido = apellidoUsuario.value
 
    localStorage.setItem('infoUsuario', JSON.stringify(infoUsuario))
   

}

const infoUsuarioStorage = JSON.parse(localStorage.getItem('infoUsuario'))

if(infoUsuarioStorage.nombre !== "" || infoUsuarioStorage.apellido !== "") {
    tituloBienvenida.innerText =  `Hola ${infoUsuarioStorage.nombre} ${infoUsuarioStorage.apellido}, Comencemos con tu compra.!!!`
}



const divCards= document.querySelector('.cards')

const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment();
let carrito = {};
const procesarCompra = document.querySelector('#procesarCompra');

document.addEventListener('DOMContentLoaded', () => {
  productosFetch();
  if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'));
    pintarCarrito();
  }
})
cards.addEventListener('click', e => {
  addCarrito(e);
})

items.addEventListener('click', e => {
  btnAccion(e);
} )

const productosFetch = async () => {
  const productosFetch = await fetch('productos.json');
  const productosJson = await productosFetch.json();
  pintarCards(productosJson);
}

const pintarCards = productosJson => {
  productosJson.forEach(producto => {
    templateCard.querySelector('h5').textContent = producto.nombre;
    templateCard.querySelector('p').textContent = producto.precio;
    templateCard.querySelector('img').setAttribute("src", producto.imagen);
    templateCard.querySelector('.btn-dark').dataset.id = producto.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  })
  cards.appendChild(fragment);
}

const addCarrito = e => {
  if (e.target.classList.contains('btn-dark')) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
} 

const setCarrito = objeto => {
  const producto = {
    id: objeto.querySelector('.btn-dark').dataset.id,
    nombre: objeto.querySelector('h5').textContent,
    precio: objeto.querySelector('p').textContent,
    cantidad: 1,
  }

  if (carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = {...producto};
  pintarCarrito();
}

const pintarCarrito = () => {
  items.innerHTML = '';
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector('th').textContent = producto.id;
    templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre;
    templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
    templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
    templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
    templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;
    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  })
  items.appendChild(fragment);

  pintarFooter();

  localStorage.setItem('carrito', JSON.stringify(carrito));
}

const pintarFooter = () => {
  footer.innerHTML = '';
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
    <th scope="row" colspan="5"> Carrito Vacío  Comenzemos </th>;
    `
    return;
  }

  const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0);
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0);

  templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
  templateFooter.querySelector('span').textContent = nPrecio;
  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnVaciar = document.getElementById('vaciar-carrito');
  btnVaciar.addEventListener('click', () => {
    carrito = {};
    pintarCarrito();
  })
}

const btnAccion = e => {
  if (e.target.classList.contains('btn-info')) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = {...producto};
    pintarCarrito();
  }
  if (e.target.classList.contains('btn-danger')) {;
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito();
  }
  e.stopPropagation();
}

procesarCompra.addEventListener('click', () => {
  Swal.fire('¡Muchas gracias por su compra!');
});