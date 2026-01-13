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

async function aceptar_persona(id_persona){

    const nombre = document.getElementById("nombre");
    const bio = document.getElementById("bio");
    const generos = document.getElementById("generos");
    const foto = document.getElementById("foto");
    const instrumento = document.getElementById("instrumento");
    const idPersona = document.getElementById("idPersona");
    const id_persona_siguiente = parseInt(idPersona.value)+1;
    idPersona.value = id_persona_siguiente;
    const url = `http://localhost:3000/usuarios/${id_persona_siguiente}`;

    const url_agregar_contacto = `http://localhost:3000/aceptar_usuarios`
    const agregar_a_contactos = await fetch(url_agregar_contacto, {
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            id_usuario:localStorage.getItem("usuarioId"),
            id_contacto_usuario:id_persona
        })
    })

    console.log("exito");

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

function mostrarCartaMusico(musico) {
    document.getElementById("idPersona").value = musico.id;
    document.getElementById("nombre").textContent = musico.nombre;
    document.getElementById("instrumento").textContent = musico.instrumentos || "Sin datos";
    document.getElementById("generos").textContent = musico.generos_favoritos || "Sin datos";
    document.getElementById("bio").textContent = musico.biografia || "Sin biografía";
    document.getElementById("redsocial").textContent = musico.redsocial || "No disponible";

    if (musico.linkfotoperfil) {
        document.getElementById("foto").src = musico.linkfotoperfil;
    }
    
    cargarInstrumentos(musico.id);
    cargarGenerosUsuario(musico.id);
}

async function cargarInstrumentos(id_usuario) {
    try {
        const response = await fetch(`http://localhost:3000/instrumentos_usuarios/${id_usuario}`);
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

async function rechazar_persona(id_persona){
    const nombre = document.getElementById("nombre");
    const bio = document.getElementById("bio");
    const foto = document.getElementById("foto");
    const idPersona = document.getElementById("idPersona");
    const id_persona_actual = parseInt(idPersona.value)+1;
    idPersona.value = id_persona_actual;
    const url = `http://localhost:3000/usuarios/${id_persona_actual}`;


     console.log("exito");

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

async function armar_primer_carta(){
    const url = `http://localhost:3000/usuarios/1`;

    const data_primer_usuario = await fetch(url, {
        method: "GET",
        headers:{
            "Content-Type":"application:json"
        }
    })
    const primer_usuario_json = await data_primer_usuario.json();
    console.log(primer_usuario_json);

    const nombre = document.getElementById("nombre");
    const bio = document.getElementById("bio");
    const foto = document.getElementById("foto");
    const redes = document.getElementById("redsocial");
    const id = document.getElementById("idPersona");

    cargar_generos(parseInt(id.value));
    
    const id_persona_siguiente = parseInt(id.value)+1;
    id.value = id_persona_siguiente;
    nombre.innerText = primer_usuario_json.nombre;
    bio.innerText = primer_usuario_json.biografia;
    foto.src = primer_usuario_json.linkFotoPerfil;
    redes.innerText = primer_usuario_json.redSocial;

}

async function cargar_generos(id_usuario){
    const url = `http://localhost:3000/pedir_generos/${id_usuario}`;

    try{
        const generos_data = await fetch(url, {
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        const generos_json = await generos_data.json();

        let generos_string = "";

        generos_json.forEach(genero=> {
            generos_string+=genero.genero+" ";
        });

        const generos = document.getElementById("generos");
        generos.innerText = generos_string
    }
    catch(err){
        console.log(err);
    }
}