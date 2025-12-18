document.addEventListener("DOMContentLoaded", () => {
    const botonSi = document.getElementById("botonSi");
    const botonNo = document.getElementById("botonNo");
    let idPersonaActual = parseInt(document.getElementById("idPersona").value);

    botonSi.addEventListener("click", function(){
        aceptar_persona(idPersonaActual)
    })
    botonNo.addEventListener("click", function(){
        aceptar_persona(idPersonaActual)
    });
})

async function aceptar_persona(){

    const nombre = document.getElementById("nombre");
    const bio = document.getElementById("bio");
    const generos = document.getElementById("generos");
    const foto = document.getElementById("foto");
    const instrumento = document.getElementById("instrumento");
    const idPersona = document.getElementById("idPersona");
    const id_persona_actual = parseInt(idPersona.value);
    const url = `http://localhost:3000/usuarios/${id_persona_actual+1}`;

    idPersona.value = toString(id_persona_actual+1);

    try{
        const siguiente_usuario = await fetch(url, {
            method:"GET", headers: {"Content-Type": "application/json",}
        });

        const usuario_json = await siguiente_usuario.json();
        console.log(usuario_json);

        nombre.innerHTML = usuario_json.nombre;
        bio.innerHTML = usuario_json.biografia;
        foto.src = usuario_json.foto

        tags.replaceChildren();

        let generos = usuario_json.generosfavoritos.split(",")
        generos.forEach(genero => {
            const nuevo_Tag = document.createElement("p");
            nuevo_Tag.className = "cartaTag";
            nuevo_Tag.innerHTML = genero;
            tags.appendChild(nuevo_Tag);
        });

        idPersona.value = id_persona_actual + 1;

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
