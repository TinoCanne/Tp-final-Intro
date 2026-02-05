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
    const email = document.createElement("p");
    const contacto = document.createElement("p");
    carta.className = "miniCarta";
    
    const foto_usuario = document.createElement("img");
    foto_usuario.src = usuario.linkfotoperfil;
    if (!usuario.linkfotoperfil){
        foto_usuario.src = "https://cdn-icons-png.flaticon.com/256/847/847969.png";
    }

    const id_contacto = document.createElement("input");
    id_contacto.type = "hidden";
    id_contacto.value = usuario.id;

    const boton_eliminar = document.createElement("button");
    boton_eliminar.className = "botonEliminarContacto";
    boton_eliminar.innerText = "Eliminar Contacto"
    boton_eliminar.onclick = function(){
        let user_id = localStorage.getItem("usuarioId");
        let contact_id = usuario.id;
        eliminar_contacto(user_id, contact_id);
    }

    const nombre = document.createElement("p");
    nombre.innerText = usuario.nombre + " " + usuario.apellido;

    const username = document.createElement("p");
    username.innerText = '"' + usuario.username + '"';

    email.innerText = usuario.email;
    contacto.innerText = "N° Tel: " + usuario.contacto;
    carta.appendChild(id_contacto);
    carta.appendChild(foto_usuario);
    carta.appendChild(nombre);
    carta.appendChild(username);
    carta.appendChild(email);
    carta.appendChild(contacto);
    carta.appendChild(boton_eliminar);
    container.appendChild(carta);
}

async function armarCartaBanda(banda){
    const container = document.getElementById("marco_bandas");
    const carta = document.createElement("div");
    carta.className = "miniCarta";

    const nombre = document.createElement("p");
    nombre.textContent = banda.nombre;

    const foto = document.createElement("img");
    foto.src = banda.linkfotobanda;
    if (!banda.linkfotobanda){
        foto.src = "https://cdn-icons-png.flaticon.com/256/847/847969.png";
    }
    
    const redSocial = document.createElement("p");
    redSocial.innerText = banda.redsocial;

    const fechaCreacion = document.createElement("p");
    const indiceSplitFecha = banda.fechacreacion.indexOf("T");
    if (indiceSplitFecha !== -1 ){
        fechaCreacion.innerText = banda.fechacreacion.slice(0, indiceSplitFecha);
    }
    else{
        fechaCreacion.innerText = banda.fechaCreacion;
    }

    const boton_eliminar_banda = document.createElement("button");
    boton_eliminar_banda.innerText = "Eliminar contacto";
    boton_eliminar_banda.className = "botonEliminarContacto";
    boton_eliminar_banda.onclick = ()=>{
        const id_usuario = localStorage.getItem("usuarioId");
        eliminar_banda_contactos(id_usuario, banda.id);
    }

    carta.appendChild(foto);
    carta.appendChild(nombre);
    carta.appendChild(redSocial);
    carta.appendChild(fechaCreacion);
    carta.appendChild(boton_eliminar_banda)
    container.appendChild(carta);
}


async function mostrar_contactos_usuarios(id_usuario){
    try{
        const container = document.getElementById("marco_usuario"); 
        container.innerHTML = "";
        const url = `http://localhost:3000/usuarios/contactos/usuarios/${id_usuario}`
        const contactos = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            },
        });
        const contactos_json = await contactos.json();
        contactos_json.forEach(contacto => {
            armarCartaUsuario(contacto);
            console.log(contacto);
        });
    }
    catch(error){
        console.log(error);
    }
    
        
}

async function mostrar_contactos_bandas(id_usuario){
    const container = document.getElementById("marco_bandas"); 
    container.innerHTML = "";
    const url = `http://localhost:3000/usuarios/contactos/bandas/${id_usuario}`;
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

async function eliminar_contacto(id_usuario, id_contacto){
    const url = `http://localhost:3000/usuarios/contactos/usuarios/${id_usuario}/${id_contacto}`;
    try{
        const response = await fetch(url, {
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            }
        })
        if(response.ok){
            mostrar_contactos_usuarios(id_usuario);
        }
    }
    catch(err){
        console.log(err);
    }
}

async function eliminar_banda_contactos(id_usuario, id_banda){

    const url = `http://localhost:3000/usuarios/contactos/bandas/${id_usuario}/${id_banda}`;

    try{
        const response = await fetch(url, {
            method: "DELETE",
            headers:{
                "Content-Type":"application/json"
            }
        })
        if(response.ok){
            mostrar_contactos_bandas(id_usuario);
        }
    }
    catch(err){
        console.log(err);
    }
}
