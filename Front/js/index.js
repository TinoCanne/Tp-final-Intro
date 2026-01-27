const idUsuario = localStorage.getItem('usuarioId');
let numeroUsuarioMostrado = 0;

document.addEventListener("DOMContentLoaded", async () => {
    const botonSi = document.getElementById("botonSi");
    const botonNo = document.getElementById("botonNo");
    const personas = await devolverPersonas();
    console.log(personas[numeroUsuarioMostrado]);
    cargarCarta(personas[numeroUsuarioMostrado]);
    botonSi.addEventListener("click", function(){
        aceptarPersona(personas[numeroUsuarioMostrado].id);
        numeroUsuarioMostrado = numeroUsuarioMostrado + 1;
        if (!personas[numeroUsuarioMostrado]){
            numeroUsuarioMostrado = 0;
        };
        console.log(personas[numeroUsuarioMostrado]);
        cargarCarta(personas[numeroUsuarioMostrado]);
    })
    botonNo.addEventListener("click", function(){
        numeroUsuarioMostrado = numeroUsuarioMostrado + 1;
        if (!personas[numeroUsuarioMostrado]){
            numeroUsuarioMostrado = 0;
        };
        console.log(personas[numeroUsuarioMostrado]);
        cargarCarta(personas[numeroUsuarioMostrado]);
    });
})

async function devolverPersonas(){
    try{
        const response = await fetch(`http://localhost:3000/usuarios_index/${idUsuario}`);
        const personas = await response.json();
        return personas;
    }
    catch(error){
        console.log(error);
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const id_usuario = localStorage.getItem('usuarioId');
    if (!id_usuario){
        window.location.href = "html/iniciar_sesion.html";
    }
})

//agregar persona a tus contactos
async function aceptarPersona(id_usuario){
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
}

async function cargarInstrumentos(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/instrumentos_usuarios/${idUsuario}`);
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

async function cargarGeneros(idUsuario) {
    try {
        const response = await fetch(`http://localhost:3000/generos_usuarios/${idUsuario}`);
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

async function cargarCarta(Usuario){
    const nombre = document.getElementById("nombre");
    const foto = document.getElementById("foto");
    const redes = document.getElementById("redsocial");
    const biografia = document.getElementById("bio");

    nombre.innerText = Usuario.nombre;
    biografia.innerText = Usuario.biografia;
    foto.src = Usuario.linkfotoperfil;
    redes.innerText = Usuario.redsocial;
    cargarInstrumentos(Usuario.id);
    cargarGeneros(Usuario.id);
}


document.addEventListener("DOMContentLoaded", () => {
    const lista = localStorage.getItem("musicos_filtrados");

    if (!lista) return;

    const musicos = JSON.parse(lista);

    if (musicos.length > 0) {
        mostrarCartaMusico(musicos[0]);
    }
});
