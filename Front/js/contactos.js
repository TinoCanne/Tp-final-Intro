document.addEventListener("DOMContentLoaded", function() {

    let id_user = "2";

    const boton_usuarios = document.getElementById("botonUsuarios");
    const boton_bandas = document.getElementById("botonBandas");
    const a = document.getElementById("botonEspacios");

    boton_usuarios.onclick = function(){
        mostrar_usuarios(id_user);
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

    div_bandas.style.display = "none";
    div_espacios.style.display = "none";
    div_usuarios.style.display = "block";

    cargar_contactos(id, "usuarios");
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

function mastrar_espacios(id){
    const div_usuarios = document.getElementById("marco_usuario");
    const div_espacios = document.getElementById("marco_espacios");
    const div_bandas = document.getElementById("marco_bandas")

    div_bandas.style.display = "none";
    div_espacios.style.display = "block";
    div_usuarios.style.display = "none";

    cargar_contactos(id, "contactos_espacios");
}

async function cargar_contactos(userId, path){
    const url = `http://localhost:3000/${path}/${userId}`
    console.log(url);
    try{
        const contactos = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const contactos_json = await contactos.json();
        console.log(contactos_json);

        if(path === "contactos_usuarios"){
            contactos_json.forEach(contacto => {
                cargar_info_usuarios(contacto.id_contacto_usuario, "usuarios")
            });
        }
        else if(path === "contactos_bandas"){
            contactos_json.forEach(contacto => {
                cargar_info_bandas(contacto.id_contacto_bandas, "bandas")
            });
        }
        else if(path === "contactos_espacios"){
            contactos_json.forEach(contacto => {
                cargar_info_espacios(contacto.id_contacto_espacio, "espacios")
            });
        }
    }
    catch(error){
        console.log(error);
    }
}

async function cargar_info_usuarios(id, path){
    try{
        const usuario = await fetch(`http://localhost:3000/${path}/${id}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
        });
        const usuario_json = await usuario.json();
        const marco = document.getElementById("marco_usuario");
        const carta = document.createElement("div");
        const foto = document.createElement("img");
        const nombre = document.createElement("h3");
        const contacto = document.createElement("p");

        carta.className=("miniCarta");
        foto.src = usuario_json.linkfotoperfil;
        nombre.innerHTML = usuario_json.username;
        contacto.innerHTML = usuario_json.contacto;

        carta.appendChild(foto);
        carta.appendChild(nombre)
        carta.appendChild(contacto);
        marco.appendChild(carta);

        console.log(usuario_json)

    }
    catch(error){
        console.log("DB error")
    }
    
}

async function cargar_info_bandas(id, path){
    try{
        const banda = await fetch(`http://localhost:3000/${path}/${id}`, {
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

async function cargar_info_espacios(id, path){

}