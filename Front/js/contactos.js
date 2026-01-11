document.addEventListener("DOMContentLoaded", function(){
    const boton_usuarios = document.getElementById("botonUsuarios");
    const boton_bandas = document.getElementById("botonBandas");
    const id_usuario = localStorage.getItem('usuarioId')
    boton_usuarios.onclick = function(){
        mostrar_contactos_usuarios(id_usuario);
    }
    boton_bandas.onclick=function(){
        mostrar_contactos_bandas(id_usuario);
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

async function aramrCartaBanda(id_banda){
    const url = `http://localhost:3000/bandas/${id_banda}`;

    try{
        const data_banda = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            },
        })

        const data_banda_json = await data_banda.json();

        const marco = document.getElementById("marco_bandas");

        console.log("funciona");
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

async function mostrar_contactos_bandas(id_usuario){
    const url = `http://localhost:3000/pedir_bandas/${id_usuario}`;
    const usuarios = document.getElementById("marco_usuario");
    usuarios.innerHTML = "";

    try{
            const data = await fetch(url, {
            method:"GET",
            headers: {
                "Contnent-Type": "application/json",
            },
        });

        const data_json = await data.json();
        data_json.forEach(banda => {
            aramrCartaBanda(banda.id_banda);          
        });
    }
    catch(err){
        console.log(err);
    }
}