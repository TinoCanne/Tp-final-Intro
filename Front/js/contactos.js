document.addEventListener("DOMContentLoaded", function() {

    const path_usuarios = "contactos_usuarios";
    const path_bandas = "contactos_bandas"
    const path_espacios = "contactos_espacios"

    cargar_contactos("2", "contactos_usuarios");
})

async function cargar_contactos(userId, path){
    const url = `http://localhost:3000/${path}/${userId}`
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
            cargar_info(contacto.id_contacto_usuario, path)
        });
    }
    catch(error){
        console.log(error);
    }
}

async function cargar_info(id, path){
    try{
        const usuario = await fetch(`http://localhost:3000/${path}/${id}`, {
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
        console.log("DB error")
    }
    
}

async function cargar_contactos_bandas(){

}