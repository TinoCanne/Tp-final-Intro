document.addEventListener("DOMContentLoaded", function() {

    let id_user = localStorage.getItem('usuarioId');

    const boton_usuarios = document.getElementById("botonUsuarios");
    const boton_bandas = document.getElementById("botonBandas");
    const boton_espacios = document.getElementById("botonEspacios");

    boton_usuarios.onclick = function(){
        mostrar_usuarios(id_user);
    };
    boton_bandas.onclick = function(){
        mostrar_bandas(id_user);
    };
    boton_espacios.onclick = function(){
        mostrar_espacios(id_user);
    };
})

function test_botones(){
    console.log("click");
}

async function cargar_contactos_usarios(userId){
    const url = `http://localhost:3000/contactos_usuarios/${userId}`;
    const contactos = await fetch(url, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
        });
    const contactos_json = await contactos.json();
    console.log("Lo que llegó del servidor:", contactos_json);
    console.log("Es un array?:", Array.isArray(contactos_json));
    contactos_json.forEach(persona => {
        const marco = document.getElementById("marco_usuario");
        const carta = document.createElement("div");
        const foto = document.createElement("img");
        const nombre = document.createElement("h3");
        const contacto = document.createElement("p");

        carta.className=("miniCarta");
        foto.src = persona.linkfotoperfil;
        nombre.innerHTML = persona.username;
        contacto.innerHTML = persona.contacto;

        carta.appendChild(foto);
        carta.appendChild(nombre);
        carta.appendChild(contacto);
        marco.appendChild(carta);

    });
}

async function cargar_contactos_bandas(id){
    const url = `http://localhost:3000/contactos_bandas/${id}`
    const contactos = await fetch(url, {
        method: "GET",
        headers:{
            "Content-Type": "application/json",
        },
    });
    
    const contactos_json = await contactos.json()

    contactos_json.forEach(contacto => {
        const marco = document.getElementById("marco_bandas");
        const carta = document.createElement("div");
        const nombre = document.createElement("h3");
        const descripcion = document.createElement("p")
        const redes = document.createElement("a");

        carta.className=("miniCarta");
        nombre.innerHTML = contacto.nombre;
        descripcion.innerHTML = contacto.descripcion;
        redes.href = contacto.redSocial
        redes.innerHTML = "Nuestras redes"

        carta.appendChild(nombre);
        carta.appendChild(descripcion);
        carta.appendChild(redes);
        marco.appendChild(carta);
    });
}

async function cargar_contactos_espacios(id){
    const url = `http://localhost:3000/contactos_espacios/${id}`
    const contactos = await fetch(url, {
        method: "GET",
        headers:{
            "Content-Type": "application/json",
        },
    });

    const contactos_json = await contactos.json();
    console.log("RESPUESTA ESPACIOS:", contactos_json);
    contactos_json.forEach(espacio => {
        const marco = document.getElementById("marco_espacios");
        const carta = document.createElement("div");
        const foto = document.createElement("img");
        const nombre = document.createElement("h3");
        const direccion = document.createElement("p");
        const contacto = document.createElement("p");

        carta.className = "miniCarta"
        foto.src = espacio.linkFotoEspacio;
        nombre.innerHTML = espacio.nombre;
        contacto.innerHTML = espacio.contacto;
        direccion.innerHTML = espacio.ubicacion;

        carta.appendChild(foto);
        carta.appendChild(nombre);
        carta.appendChild(direccion);
        carta.appendChild(contacto);

        marco.appendChild(carta);

    });

}

function mostrar_usuarios(id){
    const div_usuarios = document.getElementById("marco_usuario");
    const div_espacios = document.getElementById("marco_espacios");
    const div_bandas = document.getElementById("marco_bandas")

    div_bandas.style.display = 'none';
    div_espacios.style.display = 'none';
    div_usuarios.style.display = 'flex';

    div_usuarios.innerHTML = "";
    cargar_contactos_usarios(id);
}

function mostrar_bandas(id){
    const div_usuarios = document.getElementById("marco_usuario");
    const div_espacios = document.getElementById("marco_espacios");
    const div_bandas = document.getElementById("marco_bandas")

    div_bandas.style.display = 'flex';
    div_espacios.style.display = 'none';
    div_usuarios.style.display = 'none';

    div_bandas.innerHTML = "";
    cargar_contactos_bandas(id);
}

function mostrar_espacios(id){
    const div_usuarios = document.getElementById("marco_usuario");
    const div_espacios = document.getElementById("marco_espacios");
    const div_bandas = document.getElementById("marco_bandas")

    div_bandas.style.display = "none";
    div_espacios.style.display = "flex";
    div_usuarios.style.display = "none";

    div_espacios.innerHTML = "";
    cargar_contactos_espacios(id);
    console.log("click");
}
