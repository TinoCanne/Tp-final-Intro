document.addEventListener("DOMContentLoaded", function(){
    const boton_usuarios = document.getElementById("botonUsuarios");
    const boton_bandas = document.getElementById("botonBandas");
    const boton_espacios = document.getElementById("botonEspacios");
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

async function conseguir_data_usuario(user_id){
    try{
        const url = `http://localhost:3000/usuarios/${user_id}`;
        const data_usuario = await fetch(url, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
        });

        const data_usuario_json = await data_usuario.json();
        console.log(data_usuario_json);
        return data_usuario_json;
    }
    catch(err){
        console.log(err);
    }
}

async function mostrar_contactos_usuarios(id_usuario){
    const url = `http://localhost:3000/pedir_contactos/${id_usuario}`
    try{
        const contactos = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            },
        });
        const contactos_json = await contactos.json();
        const marco_usuarios = document.getElementById("marco_usuario");
        marco_usuarios.innerHTML = "";
        contactos_json.forEach(contacto => {

            const data = conseguir_data_usuario(contacto.id_contacto_usuario);

            const carta_contacto = document.createElement("div");
            carta_contacto.className = "miniCarta";
            marco_usuarios.appendChild(carta_contacto);
        });
    }
    catch(err){
        console.log(err);
    }
}

function mostrar_contactos_bandas(id_usuario){

}

function mostrarcontactos_espacios(id_usuario){
    
}