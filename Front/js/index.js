document.addEventListener("DOMContentLoaded", () => {
    const botonSi = document.getElementById("botonSi");
    const botonNo = document.getElementById("botonNo");
    armar_primer_carta();
    botonSi.addEventListener("click", function(){
        const id_persona = parseInt(document.getElementById("idPersona").value);
        aceptar_persona(id_persona);
    })
    botonNo.addEventListener("click", function(){
        const id_persona = parseInt(document.getElementById("idPersona").value);
        rechazar_persona(id_persona);
    });
})

document.addEventListener("DOMContentLoaded", () => {
    const id_usuario = localStorage.getItem('usuarioId');
    if (!id_usuario){
        window.location.href = "html/iniciar_sesion.html";
    }
})

//agregar persona a tus contactos
async function aceptar_persona(id_usuario){
    const id_actual = parseInt(document.getElementById("idPersona").value);
    const url_agregar = `http://localhost:3000/aceptar_usuarios/`;
    try{
        const exito_agregar = await fetch(url_agregar, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id_usuario:localStorage.getItem("usuarioId"),
                id_contacto_usuario:id_usuario
            })
        })
    }
    catch(err){
        console.log(err);
    }

    const id_siguiente = id_actual+1;
    const url_buscar_data = `http://localhost:3000/usuarios/${id_siguiente}`;

    try{
        const data_nueva = await fetch(url_buscar_data, {
        method: "GET",
        headers:{
            "Content-Type":"application/json"
        }
        })
        const data_nueva_json = await data_nueva.json();
        console.log(data_nueva_json)

        
        const nombre = document.getElementById("nombre");
        const foto = document.getElementById("foto");
        const redes = document.getElementById("redsocial");
        const biografia = document.getElementById("bio");
        const id_persona = document.getElementById("idPersona");

        nombre.innerText = data_nueva_json.nombre;
        biografia.innerText = data_nueva_json.biografia;
        foto.src = data_nueva_json.linkFotoPerfil;
        redes.innerText = data_nueva_json.redSocial;
        id_persona.value = id_siguiente;
        cargarGenerosUsuario(id_siguiente);
        cargarInstrumentos(id_siguiente);
        console.log("exito");
    }
    catch(err){
        console.log(err);
    }


}

async function cargarInstrumentos(id_usuario) {
    try {
        const response = await fetch(`http://lodcalhost:3000/instrumentos_usuarios/${id_usuario}`);
        const datos = await response.json();

        let instrumentos = "";
        datos.forEach(i => {
            instrumentos += i.instrumento + " ";
        });

        document.getElementById("instrumento").textContent =
            instrumentos || "Sin datos";
    } catch (error) {
        console.error("Error cargando instrumentos:", error);
    }
}

async function cargarGenerosUsuario(id_usuario) {
    try {
        const response = await fetch(`http://localhost:3000/generos_usuarios/${id_usuario}`);
        const datos = await response.json();

        let generos = "";
        datos.forEach(g => {
            generos += g.genero + " ";
        });

        document.getElementById("generos").textContent =
            generos || "Sin datos";
    } catch (error) {
        console.error("Error cargando géneros:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const lista = localStorage.getItem("musicos_filtrados");

    if (!lista) return;

    const musicos = JSON.parse(lista);

    if (musicos.length > 0) {
        mostrarCartaMusico(musicos[0]);
    }
});

async function cargar_info_persona(id_persona){
    const id_persona_actual = document.getElementById("idPersona").value;
    const url = `http://localhost:3000/usuarios/${id_persona_actual}`;
    const data_usuario = await fetch(url, {
        method:"GET",
        headers:{
            "Content-Type":"application/json",
        }
    });

    data_usuario_json = await data_usuario.json();
    reemplazar_data_carta(data_usuario_json);


}

function reemplazar_data_carta(data){
    const carta = document.getElementById("carta");
    const nombre = document.getElementById("nombre");
    const instrumentos = document.getElementById("instrumento");
    const generos = document.getElementById("generos");
    const redes = document.getElementById("redsocial");
    const bio = document.getElementById("bio");
    const foto = document.getElementById("foto");

    console.log(data);
}

//funcion para rechazar a un usuario
async function rechazar_persona(id_persona){
    const nombre = document.getElementById("nombre");
    const bio = document.getElementById("bio");
    const foto = document.getElementById("foto");
    const idPersona = document.getElementById("idPersona");
    const id_persona_actual = parseInt(idPersona.value)+1;
    idPersona.value = id_persona_actual;
    const url = `http://localhost:3000/usuarios/${id_persona_actual}`;

    console.log(id_persona_actual)

    try{
        const siguiente_usuario = await fetch(url, {
            method:"GET", headers: {"Content-Type": "application/json",}
        });

        const usuario_json = await siguiente_usuario.json();
        console.log(usuario_json);

        nombre.innerHTML = usuario_json.nombre;
        bio.innerHTML = usuario_json.biografia;
        foto.src = usuario_json.foto

    }
    catch(error){
        console.log(error);
    }
}

//funcion para mostrar la primera carta de la homepage
async function armar_primer_carta(){
    const nombre = document.getElementById("nombre");

    const url = `http://localhost:3000/usuarios/1`;
    
}
