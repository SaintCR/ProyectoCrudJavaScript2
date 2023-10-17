import { Gift } from "./Clases_GiftCards.js";

const cuerpoTabla = document.querySelector("#cuerpo-tabla");
const myModal = new bootstrap.Modal(document.getElementById("modalGift"));
const mensajeActualizarDiv = document.querySelector("#mensajeActualizar");
const mensajeDiv = document.querySelector("#mensaje");
const mensajeEliminarDiv = document.querySelector("#mensajeEliminar");
const busqueda = document.querySelector("#busqueda");

let idGiftUpdate = null;

// Función para mostrar un mensaje en la parte superior
const mostrarMensaje = (mensaje, tipo, div) => {
  div.textContent = mensaje;

  // Define las clases CSS para diferentes tipos de mensajes
  const clases = {
      success: 'alert alert-success',
      update: 'alert alert-warning',
      error: 'alert alert-danger'
  };

  // Aplica las clases CSS correspondientes
  div.className = clases[tipo];
  div.style.display = 'block';

  // Oculta el mensaje después de 4 segundos
  setTimeout(() => {
      div.style.display = 'none';
  }, 4000);
};

// Función para cargar los datos desde el localStorage
const cargarDatosDesdeLocalStorage = () => {
    const datosGuardados = localStorage.getItem("giftCardsData");
    if (datosGuardados) {
        return JSON.parse(datosGuardados);
    }
    return [];
};

// Función para guardar los datos en el localStorage
const guardarDatosEnLocalStorage = (datos) => {
    localStorage.setItem("giftCardsData", JSON.stringify(datos));
};

// Inicialización de datos desde el localStorage
let datos = cargarDatosDesdeLocalStorage();

// Función para cargar la tabla con los datos actuales
const cargarTabla = () => {
    cuerpoTabla.innerHTML = "";
    datos.forEach((item) => {
        const fila = document.createElement("tr");
        const celdas = `
            <th>${item.gift}</th>
            <td>${item.tipo}</td>
            <td>${item.tiempo}</td>
            <td>$${item.precio}</td>
            <td><img src="${item.imagen}" alt="${item.gift}" width="40" height="55"></td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-warning" onclick="mostrarModal(${item.id})">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="borrarGift(${item.id})">
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            </td>
        `;
        fila.innerHTML = celdas;
        cuerpoTabla.appendChild(fila);
    });
};

// Función para agregar una Gift Card
const agregarGift = (event) => {
    event.preventDefault();
    const id = datos.length > 0 ? datos[datos.length - 1].id + 1 : 1;
    const gift = document.querySelector("#gift").value;
    const tipo = document.querySelector("#tipo").value;
    const tiempo = document.querySelector("#tiempo").value;
    const precio = document.querySelector("#precio").value;
    const imagen = document.querySelector("#imagen").value;
    const nuevaGiftCard = new Gift(id, gift, tipo, tiempo, precio, imagen);
    datos.push(nuevaGiftCard);
    guardarDatosEnLocalStorage(datos); // Guardar datos en localStorage
    document.querySelector("#formGift").reset();
    cargarTabla();
    mostrarMensaje(`Producto "${nuevaGiftCard.gift}" registrado con éxito`, "success", mensajeDiv);
};

// Función para mostrar el modal de actualización
window.mostrarModal = (id) => {
    idGiftUpdate = id;
    const index = datos.findIndex((item) => item.id === idGiftUpdate);
    const modalGift = document.querySelector("#giftModal");
    const modalTipo = document.querySelector("#tipoModal");
    const modalTiempo = document.querySelector("#tiempoModal");
    const modalPrecio = document.querySelector("#precioModal");
    const modalImagen = document.querySelector("#imagenModal");
    modalGift.value = datos[index].gift;
    modalTipo.value = datos[index].tipo;
    modalTiempo.value = datos[index].tiempo;
    modalPrecio.value = datos[index].precio;
    modalImagen.value = datos[index].imagen;
    myModal.show();
};

// Función para actualizar una Gift Card
const giftUpdate = (e) => {
    e.preventDefault();
    const index = datos.findIndex((item) => item.id === idGiftUpdate);
    datos[index].gift = document.querySelector("#giftModal").value;
    datos[index].tipo = document.querySelector("#tipoModal").value;
    datos[index].tiempo = document.querySelector("#tiempoModal").value;
    datos[index].precio = document.querySelector("#precioModal").value;
    datos[index].imagen = document.querySelector("#imagenModal").value;
    guardarDatosEnLocalStorage(datos); // Actualizar datos en localStorage
    cargarTabla();
    myModal.hide();
    mostrarMensaje(`Producto "${datos[index].gift}" actualizado`, "update", mensajeActualizarDiv);
};

// Función para eliminar una Gift Card
window.borrarGift = (id) => {
  const index = datos.findIndex((item) => item.id === id);
  const giftName = datos[index].gift;
  const confirmar = confirm(`¿Está seguro/a de que desea eliminar la Gift Card "${giftName}"?`);
  if (confirmar) {
      datos.splice(index, 1);
      guardarDatosEnLocalStorage(datos);
      cargarTabla();
      mostrarMensaje(`Gift Card "${giftName}" eliminada`, 'error', mensajeEliminarDiv);
  }
};

// Función para filtrar las Gift Cards
busqueda.addEventListener("input", () => {
    const filtro = busqueda.value.toLowerCase();
    const filas = cuerpoTabla.querySelectorAll("tr");
    filas.forEach((fila) => {
        const gift = fila.querySelector("th").textContent.toLowerCase();
        if (gift.includes(filtro)) {
            fila.style.display = "table-row";
        } else {
            fila.style.display = "none";
        }
    });
});

// Eventos
document.querySelector("#formGift").addEventListener("submit", agregarGift);
document.querySelector("#formModal").addEventListener("submit", giftUpdate);

// Cargar tabla al inicio
cargarTabla();
