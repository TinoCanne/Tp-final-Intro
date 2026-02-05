const idUsuario = localStorage.getItem('usuarioId');
let numeroUsuarioMostrado = 0;
let numeroBandaMostrada = 0;
let controladorBotonesUsuarios = null;
let controladorBotonesBandas = null;

async function mostrarUsuarios(url){
    const cartaUsuario = document.getElementById("cartaUsuarios");
    const botonFiltrosUsuarios = document.getElementById("botonFiltroUsuarios");
    
    cartaUsuario.classList.add("hidden");
    botonFiltrosUsuarios.classList.add("hidden");

    if (controladorBotonesUsuarios) {
        controladorBotonesUsuarios.abort();
    }
    controladorBotonesUsuarios = new AbortController();
    const signal = controladorBotonesUsuarios.signal;

    numeroUsuarioMostrado = 0;
    const botonSi = document.getElementById("botonSiUsuarios");
    const botonNo = document.getElementById("botonNoUsuarios");
    
    let personas = await devolverPersonas(url);

    if (!personas || personas.length === 0){
            alert("No se encontraron usuarios."); 
            return;
    };
    cartaUsuario.classList.remove("hidden");
    botonFiltrosUsuarios.classList.remove("hidden");
    cargarCartaUsuario(personas[numeroUsuarioMostrado]);

    botonSi.addEventListener("click", function(){
        aceptarPersona(personas[numeroUsuarioMostrado].id);
        personas.splice(numeroUsuarioMostrado, 1);
        if (personas.length === 0){ 
            alert("No hay más usuarios nuevos para mostrar, se mostraran los rechazados."); 
            cartaUsuario.classList.add("hidden");
            botonFiltrosUsuarios.classList.add("hidden");
            return;
        };
        cargarCartaUsuario(personas[numeroUsuarioMostrado]);
    }, { signal : signal });

    botonNo.addEventListener("click", function(){
        personas.splice(numeroUsuarioMostrado, 1);
        
        if (personas.length === 0){
            alert("No hay más usuarios nuevos para mostrar, se mostraran los rechazados.");
            cartaUsuario.classList.add("hidden"); 
            botonFiltrosUsuarios.classList.add("hidden");
            return;
        };
        cargarCartaUsuario(personas[numeroUsuarioMostrado]);
    }, { signal : signal });
}

async function devolverPersonas(url){
    try{
        const response = await fetch(url);
        const personas = await response.json();
        return personas;
    }
    catch(error){
        console.log(error);
    }
}

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

async function cargarInstrumentosUsuario(idUsuarioAMostrar) {
    try {
        const response = await fetch(`http://localhost:3000/instrumentos_usuarios/${idUsuarioAMostrar}`);
        const datos = await response.json();

        let instrumentos = "";
        datos.forEach(i => {
            instrumentos += i.instrumento + " ";
        });

        document.getElementById("instrumentosUsuario").textContent =
            instrumentos || "Sin datos";
    } catch (error) {
        console.error("Error cargando instrumentos:", error);
    }
}

async function cargarGenerosUsuario(idUsuarioAMostrar) {
    try {
        const response = await fetch(`http://localhost:3000/generos_usuarios/${idUsuarioAMostrar}`);
        const datos = await response.json();

        let generos = "";
        datos.forEach(g => {
            generos += g.genero + " ";
        });

        document.getElementById("generosUsuario").textContent =
            generos || "Sin datos";
    } catch (error) {
        console.error("Error cargando géneros:", error);
    }
}

async function cargarCartaUsuario(Usuario){
    const nombre = document.getElementById("nombreUsuario");
    const foto = document.getElementById("fotoUsuario");
    const redes = document.getElementById("redsocialUsuario");
    const biografia = document.getElementById("bioUsuario");

    nombre.innerText = Usuario.nombre;
    biografia.innerText = Usuario.biografia;
    foto.src = Usuario.linkfotoperfil;
    if(!Usuario.linkfotoperfil){
        foto.src = "https://cdn-icons-png.flaticon.com/256/847/847969.png";
    }
    redes.innerText = Usuario.redsocial;
    cargarInstrumentosUsuario(Usuario.id);
    cargarGenerosUsuario(Usuario.id);
}

document.addEventListener("DOMContentLoaded", () => {
    if (!idUsuario){
        window.location.href = "html/iniciar_sesion.html";
    }
    const botonMostrarUsuarios = document.getElementById("botonBuscarUsuarios");
    const botonMostrarBandas = document.getElementById("botonBuscarBandas");
    const botonFiltrosUsuarios = document.getElementById("botonFiltroUsuarios");
    const botonFiltrosBandas = document.getElementById("botonFiltroBandas");
    const cartaUsuario = document.getElementById("cartaUsuarios");
    const cartaBanda = document.getElementById("cartaBandas");
    
    cartaBanda.classList.add("hidden");  
    cartaUsuario.classList.add("hidden");

    botonMostrarUsuarios.addEventListener("click", function(){
        cartaBanda.classList.add("hidden");  
        botonFiltrosUsuarios.classList.remove("hidden")
        botonFiltrosBandas.classList.add("hidden");
        mostrarUsuarios(`http://localhost:3000/usuarios_index/${idUsuario}`);
    });

    botonMostrarBandas.addEventListener("click", function(){
        cartaUsuario.classList.add("hidden");
        botonFiltrosUsuarios.classList.add("hidden")
        botonFiltrosBandas.classList.remove("hidden");
        mostrarBandas(`http://localhost:3000/bandas_index/${idUsuario}`);
    });
});

async function devolverBandas(url){
    try{
        const response = await fetch(url);
        const bandas = await response.json();
        return bandas;
    }
    catch(error){
        console.log(error);
    }
}

async function cargarGenerosBanda(idBandaAMostrar){
    try {
        const response = await fetch(`http://localhost:3000/generos_bandas/${idBandaAMostrar}`);
        const datos = await response.json();

        let generos = "";
        datos.forEach(g => {
            generos += g.genero + " ";
        });

        document.getElementById("generosBanda").textContent =
            generos || "Sin datos";
    } catch (error) {
        console.error("Error cargando géneros:", error);
    }
}

async function cargarMiembrosBanda(idBandaAMostrar) {
    try {
        const response = await fetch(`http://localhost:3000/username_integrantes_bandas/${idBandaAMostrar}`);
        const datos = await response.json();

        let miembros = "";
        datos.forEach(m => {
            miembros += m.username + ", ";
        });

        document.getElementById("miembrosBanda").textContent =
            miembros || "Sin datos";
    } catch (error) {
        console.error("Error cargando miembros:", error);
    }
}

async function cargarCartaBanda(Banda){
    const nombre = document.getElementById("nombreBanda");
    const foto = document.getElementById("fotoBanda");
    const redes = document.getElementById("redsocialBanda");
    const biografia = document.getElementById("bioBanda");
    if(!Banda.linkfotobanda){
        foto.src = "https://cdn-icons-png.flaticon.com/512/681/681494.png";
    }
    nombre.innerText = Banda.nombre;
    biografia.innerText = Banda.descripcion;
    foto.src = Banda.linkfotobanda;
    redes.innerText = Banda.redsocial;
    cargarMiembrosBanda(Banda.id);
    cargarGenerosBanda(Banda.id);
}

async function aceptarBanda(id_banda){
    const url_agregar = `http://localhost:3000/aceptar_banda/`;
    try{
        const exito_agregar = await fetch(url_agregar, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id_usuario:localStorage.getItem("usuarioId"),
                id_contacto_banda:id_banda
            })
        })
    }
    catch(err){
        console.log(err);
    }
}

async function mostrarBandas(url){
    const marco_bandas = document.getElementById("cartaBandas"); 
    const botonFiltrosBandas = document.getElementById("botonFiltroBandas");

    marco_bandas.classList.add("hidden");
    botonFiltrosBandas.classList.add("hidden");

    if (controladorBotonesBandas) {
        controladorBotonesBandas.abort();
    }
    controladorBotonesBandas = new AbortController();
    const signal = controladorBotonesBandas.signal;

    numeroBandaMostrada = 0;
    const botonSiBanda = document.getElementById("botonSiBanda");
    const botonNoBanda = document.getElementById("botonNoBanda");

    let bandas = await devolverBandas(url);
    
    if (!bandas || bandas.length === 0) {
        alert("No se encontraron bandas."); 
        return; 
    }

    marco_bandas.classList.remove("hidden");
    botonFiltrosBandas.classList.remove("hidden");
    cargarCartaBanda(bandas[numeroBandaMostrada]);

    botonSiBanda.addEventListener("click", function(){
        aceptarBanda(bandas[numeroBandaMostrada].id);
        bandas.splice(numeroBandaMostrada, 1);
        if (bandas.length === 0){
            alert("No hay más bandas nuevas para mostrar, se mostraran las rechazados."); 
            marco_bandas.classList.add("hidden"); 
            botonFiltrosBandas.classList.add("hidden");
            return; 
        };
        cargarCartaBanda(bandas[numeroBandaMostrada]);
    }, { signal:signal })

    botonNoBanda.addEventListener("click", function(){
        bandas.splice(numeroBandaMostrada, 1);
        if (bandas.length === 0){
            alert("No hay más bandas nuevas para mostrar, se mostraran las rechazados."); 
            marco_bandas.classList.add("hidden"); 
            botonFiltrosBandas.classList.add("hidden");
            return; 
        };
        cargarCartaBanda(bandas[numeroBandaMostrada]);
    }, { signal:signal });
}

function mostrarFiltroBandas(){
    const filtroBandas = document.getElementById('popUpFiltrosBandas');
    filtroBandas.showModal();
}

function ocultarFiltroBandas(){
    const filtroBandas = document.getElementById('popUpFiltrosBandas');
    filtroBandas.close();
}

async function aplicarFiltrosBandas(event){
    event.preventDefault();
    const genero = document.getElementById('generoBandasFiltros').value;
    const url = `http://localhost:3000/filtro_bandas?genero=${genero}&idUsuario=${idUsuario}`;
    mostrarBandas(url);
    event.target.reset();
    ocultarFiltroBandas()
}

function mostrarFiltroUsuarios(){
    const filtroUsuarios = document.getElementById('popUpFiltrosUsuarios');
    filtroUsuarios.showModal();
}

function ocultarFiltroUsuarios(){
    const filtroUsuarios = document.getElementById('popUpFiltrosUsuarios');
    filtroUsuarios.close();
}

async function aplicarFiltrosUsuarios(event){
    event.preventDefault();
    try{
        const genero = document.getElementById('generoUsuariosFiltros').value;
        const instrumento = document.getElementById('instrumentoUsuariosFiltros').value;
        const url = `http://localhost:3000/filtro_usuarios?genero=${genero}&instrumento=${instrumento}&idUsuario=${idUsuario}`;
        mostrarUsuarios(url);
    }
    catch (error){
        console.log(error);
    }
    event.target.reset();
    ocultarFiltroUsuarios()
}