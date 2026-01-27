document.addEventListener("DOMContentLoaded", function(){
    const boton_usuarios = document.getElementById("botonUsuarios");
    const boton_bandas = document.getElementById("botonBandas");
    const boton_espacios = document.getElementById("botonEspacios");
    const id_usuario = localStorage.getItem('usuarioId')
    boton_usuarios.onclick = function(){
        mostrar_contactos_usuarios(1);
    }
    boton_bandas.onclick=function(){
        testBoton(2);
    }
    boton_espacios.onclick=function(){
        testBoton(3);
    }
})

function testBoton(num){
    console.log(`click ${num}`);
}

async function armarCartaUsuario(id){
    const url = `http://localhost:3000/usuarios/${id}`;
    const container = document.getElementById("marco_usuario");
    container.innerHTML = "";
    const carta = document.createElement("div");
    carta.className = "miniCarta";

    try{
        const data_usuario = await fetch(url, {
                method: "GET",
                headers: {
                        "Content-Type":"application/json",
                }
            }
        )

        const data_usuario_json = await data_usuario.json()
        console.log(data_usuario_json);


        const foto_usuario = document.createElement("img");
        foto_usuario.src = data_usuario_json.linkFotoPerfil;

        const nombre = document.createElement("p");
        nombre.textContent = data_usuario_json.nombre;
        carta.appendChild(foto_usuario);
        carta.appendChild(nombre);
        container.appendChild(carta);

    }
    catch(err){
        console.log(err);
    }
}


async function mostrar_contactos_usuarios(id_usuario){
    const url = `http://localhost:3000/pedir_contactos/${id_usuario}`
    const contactos = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type":"application/json",
        },
    });
    const contactos_json = await contactos.json();
    contactos_json.forEach(contacto => {
        armarCartaUsuario(contacto.id_contacto_usuario);
    });
        
}

function mostrar_contactos_bandas(id_usuario){

}