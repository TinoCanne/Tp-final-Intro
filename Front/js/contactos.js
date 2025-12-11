document.addEventListener("DOMContentLoaded", function() {

    let id_user = "2";

    const boton_usuarios = document.getElementById("botonUsuarios");
    const boton_bandas = document.getElementById("botonBandas");
    const a = document.getElementById("botonEspacios");

    boton_usuarios.onclick = function(){
        cargar_contactos_usarios(id_user);
    };
    boton_bandas.onclick = function(){
        mostrar_bandas(id_user);
    };
    a.onclick = test_botones;
})

function test_botones(){
    console.log("click");
}

function mostrar_usuarios(id){
    const div_usuarios = document.getElementById("marco_usuario");
    const div_espacios = document.getElementById("marco_espacios");
    const div_bandas = document.getElementById("marco_bandas")

    div_bandas.style.display = 'none';
    div_espacios.style.display = 'none';
    div_usuarios.style.display = 'block';

    cargar_contactos_usuarios(id);
}

function mostrar_bandas(id){
    const div_usuarios = document.getElementById("marco_usuario");
    const div_espacios = document.getElementById("marco_espacios");
    const div_bandas = document.getElementById("marco_bandas")

    div_bandas.style.display = "block";
    div_espacios.style.display = "none";
    div_usuarios.style.display = "none";

    cargar_contactos(id, "bandas");
}

function mostrar_espacios(id){
    const div_usuarios = document.getElementById("marco_usuario");
    const div_espacios = document.getElementById("marco_espacios");
    const div_bandas = document.getElementById("marco_bandas")

    div_bandas.style.display = "none";
    div_espacios.style.display = "block";
    div_usuarios.style.display = "none";

    cargar_contactos(id, "contactos_espacios");
}

async function cargar_info_bandas(id){
    try{
        const banda = await fetch(`http://localhost:3000/bandas/${id}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
        });

        const banda_json = await banda.json();

        const marco = document.getElementById("marco_bandas");
        const carta = document.createElement("div");
        const nombre = document.createElement("h3");
        const descripcion = document.createElement("p");
        const redes = document.createElement("a");

        carta.className = "miniCarta";
        nombre.innerHTML = banda_json.nombre;
        descripcion.innerHTML = banda_json.descripcion
        redes.innerHTML = "Nuetras Redes"
        redes.href = banda_json.redSocial;

        carta.appendChild(nombre);
        carta.appendChild(descripcion);
        carta.appendChild(redes)

        marco.appendChild(carta);

    }
    catch(error){
        console.log("error");
    }
}

async function cargar_info_espacios(id){

}

async function cargar_contactos_usarios(userId){
    const url = `http://localhost:3000/contactos_usuarios/${userId}`;
    const contactos = await fetch(url, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
        });
    contactos_json = await contactos.json();
    contactos_json.forEach(contacto => {
        const marco = document.getElementById("marco_usuario");
        const carta = document.createElement("div");
        const foto = document.createElement("img");
        const nombre = document.createElement("h3");
        const contacto = document.createElement("p");

        carta.className=("miniCarta");
        foto.src = contacto.linkfotoperfil;
        nombre.innerHTML = contacto.username;
        contacto.innerHTML = contacto.contacto;

        carta.appendChild(foto);
        carta.appendChild(nombre)
        carta.appendChild(contacto);
        marco.appendChild(carta);

    });
}

async function cargar_contactos_bandas(id){
    const url = `http//localhost:3000/contactos_bandas/${id}`

}