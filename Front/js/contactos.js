document.addEventListener("DOMContentLoaded", function(){
    const boton_usuarios = document.getElementById("botonUsuarios");
    const boton_bandas = document.getElementById("botonBandas");
    const id_usuario = localStorage.getItem('usuarioId');
    const marco_usuario = document.getElementById('marco_usuario');
    const marco_bandas = document.getElementById('marco_bandas');
    marco_usuario.innerHTML = "";
    marco_bandas.innerHTML = "";
    boton_usuarios.onclick = function(){
        mostrar_contactos_usuarios(id_usuario);
        marco_bandas.classList.add("hidden");  
        marco_usuario.classList.remove("hidden");
    }
    boton_bandas.onclick=function(){
        mostrar_contactos_bandas(id_usuario);
        marco_bandas.classList.remove("hidden");  
        marco_usuario.classList.add("hidden");
    }
})

function testBoton(num){
    console.log(`click ${num}`);
}

async function armarCartaUsuario(usuario){

    const container = document.getElementById("marco_usuario");
    const carta = document.createElement("div");
    carta.className = "miniCarta";
    
    const foto_usuario = document.createElement("img");
    foto_usuario.src = usuario.linkfotoperfil;

    const nombre = document.createElement("p");
    nombre.textContent = usuario.nombre;
    carta.appendChild(foto_usuario);
    carta.appendChild(nombre);
    container.appendChild(carta);
}

async function armarCartaBanda(banda){
    const container = document.getElementById("marco_bandas");
    const carta = document.createElement("div");
    carta.className = "miniCarta";

    const nombre = document.createElement("p");
    nombre.textContent = banda.nombre;
    carta.appendChild(nombre);
    container.appendChild(carta);
}


async function mostrar_contactos_usuarios(id_usuario){
    try{
        const container = document.getElementById("marco_usuario"); 
        container.innerHTML = "";
        const url = `http://localhost:3000/pedir_contactos/${id_usuario}`
        const contactos = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            },
        });
        const contactos_json = await contactos.json();
        contactos_json.forEach(contacto => {
            armarCartaUsuario(contacto);
        });
    }
    catch(error){
        console.log(error);
    }
    
        
}

async function mostrar_contactos_bandas(id_usuario){
    const container = document.getElementById("marco_bandas"); 
    container.innerHTML = "";
    const url = `http://localhost:3000/pedir_bandas/${id_usuario}`;

    try{
            const data = await fetch(url, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data_json = await data.json();
        console.log(data_json);
        data_json.forEach(banda => {
            armarCartaBanda(banda);          
        });
    }
    catch(err){
        console.log(err);
    }
}