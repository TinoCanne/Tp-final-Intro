document.addEventListener("DOMContentLoaded", function() {
    cargar_contactos("2");
})

async function cargar_contactos(userId){
    const url = `http://localhost:3000/contactos/${userId}`
    try{
        const contactos = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const contactos_json = await contactos.json();
        console.log(contactos_json);

        contactos_json.forEach(contacto =>{
            cargar_info(contacto.id_contacto_usuario)
        });
    }
    catch(error){
        console.log(error);
    }
}

async function cargar_info(id){
    try{
        const usuario = await fetch(`http://localhost:3000/usuarios/${id}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
        });
        const usuario_json = await usuario.json();
        const marco = document.getElementById("marco");
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
        console.log(error)
    }
    
}
