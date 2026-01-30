async function perfil_usuario(event){
    event.preventDefault();

    try{
        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const username = document.getElementById('username');
        const redesSociales = document.getElementById('redSocial');
        const email = document.getElementById('email');
        const instrumentos = document.getElementById('instrumentosUsuario');
        const generos = document.getElementById('generosUsuario')
        const biografia = document.getElementById('biografia');
        const contacto = document.getElementById('contacto');
        const linkfoto = document.getElementById('linkFotoUsuario').src;
        const id = localStorage.getItem('usuarioId');

        const url = "http://localhost:3000/usuarios";
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                nombre: nombre.textContent,
                apellido: apellido.textContent,
                username: username.textContent,
                email: email.textContent,
                biografia: biografia.textContent,
                redesSociales: redesSociales.textContent,
                linkFoto: linkfoto,
                contacto: contacto.textContent,
                instrumentos: instrumentos.textContent,
                generos: generos.textContent,
                id: id
            })
        });
    }
    catch (error){
        console.log(error);
    }
}

function prevenirSaltoDeLinea(event) {
    if (event.keyCode === 13){      //Enter
        event.preventDefault();
        event.target.blur();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const boton= document.getElementById("botonDeEdicionPerfil");
    const datos= document.querySelectorAll(".spanDatosPerfil");
    const perfilContainer = document.getElementById("perfilContainer");
    const fotoPerfil= document.getElementById("linkFotoUsuario");
    const inputNuevoLink= document.getElementById("inputNuevoLink");

    function cambiarFotoPerfil(event) {
        if (event.keyCode === 13){
            event.preventDefault();
            if (inputNuevoLink.value !== ""){
                fotoPerfil.src = inputNuevoLink.value;
                inputNuevoLink.value = "";
            }
            inputNuevoLink.type = "hidden";
        }
    }
    
    function mostrarInputNuevoLink() {
        if (inputNuevoLink.type === "hidden"){
            inputNuevoLink.type= "url";
            inputNuevoLink.addEventListener('keydown', cambiarFotoPerfil)
        }
        else{
            inputNuevoLink.type= "hidden";
        }
    }

    boton.onclick = function(event){

        const enEdicion = perfilContainer.classList.toggle("modo-edicion");

        datos.forEach(elemento => {
            if (enEdicion){
                elemento.contentEditable = "true";
                elemento.addEventListener('keydown', prevenirSaltoDeLinea);
                fotoPerfil.addEventListener('click', mostrarInputNuevoLink);
            }
            else{
                elemento.contentEditable = "false";
                elemento.removeEventListener('keydown', prevenirSaltoDeLinea);
                fotoPerfil.removeEventListener('click', mostrarInputNuevoLink);
                if (inputNuevoLink.type !== "hidden"){
                    inputNuevoLink.type = "hidden";
                }
            }
        });

        boton.textContent = enEdicion ? "Guardar cambios" : "Editar perfil";

        if (!enEdicion){
            perfil_usuario(event);
        }
    };
});

document.addEventListener("DOMContentLoaded", function () {
    const botonBanda = document.getElementById("botonDeEdicionBanda");
    const datosBanda = document.querySelectorAll(".spanDatosBanda");
    const contenedorBanda = document.getElementById("infoBanda");

    if (!botonBanda || !contenedorBanda) return;

    botonBanda.onclick = function (event) {
        const enEdicion = contenedorBanda.classList.toggle("modo-edicion");

        datosBanda.forEach(elemento => {
            if (enEdicion) {
                elemento.contentEditable = "true";
                elemento.addEventListener("keydown", prevenirSaltoDeLinea);
            } else {
                elemento.contentEditable = "false";
                elemento.removeEventListener("keydown", prevenirSaltoDeLinea);
            }
        });

        botonBanda.textContent = enEdicion ? "Guardar cambios" : "Editar banda";

        if (!enEdicion) {
            guardarCambiosBanda(event);
        }
    };
});

document.addEventListener("DOMContentLoaded", function () {
    const botonEspacio = document.getElementById("botonEditarEspacio");
    const datosEspacio = document.querySelectorAll(".spanDatosEspacio");
    const contenedorEspacio = document.getElementById("infoEspacio");

    if (!botonEspacio || !contenedorEspacio) return;

    botonEspacio.onclick = function (event) {
        const enEdicion = contenedorEspacio.classList.toggle("modo-edicion");

        datosEspacio.forEach(elemento => {
            if (enEdicion) {
                elemento.contentEditable = "true";
                elemento.addEventListener("keydown", prevenirSaltoDeLinea);
            } else {
                elemento.contentEditable = "false";
                elemento.removeEventListener("keydown", prevenirSaltoDeLinea);
            }
        });

        botonEspacio.textContent = enEdicion ? "Guardar cambios" : "Editar espacio";

        if (!enEdicion) {
            guardarCambiosEspacio(event);
        }
    };
});

async function cargarGenerosUsuario(id_usuario) {
    try{
        const response = await fetch(`http://localhost:3000/generos_usuarios/${id_usuario}`);
        const datos_generos = await response.json();
        let string_generos = '';
        datos_generos.forEach(generos_usuario => {
            string_generos += ` ${generos_usuario.genero},`;
        })
        let string_generos_limpia = string_generos.slice(0, -1);

        const generosPaginaUsuario = document.getElementById('generosUsuario');
        generosPaginaUsuario.textContent = string_generos_limpia;
    }
    catch (error) {
        console.error("Error:", error);
    }   
}

async function cargarInstrumentos(id_usuario) {
    try{
        const response = await fetch(`http://localhost:3000/instrumentos_usuarios/${id_usuario}`);
        const datos_instrumentos = await response.json();
        let string_instrumentos = '';
        datos_instrumentos.forEach(instrumentos_usuario => {
            string_instrumentos += ` ${instrumentos_usuario.instrumento},`;
        })
        let string_instrumentos_limpia = string_instrumentos.slice(0, -1);

        const generosInstrumentosUsuario = document.getElementById('instrumentosUsuario');
        generosInstrumentosUsuario.textContent = string_instrumentos_limpia;
    }
    catch (error) {
        console.error("Error:", error);
    }   
}

function mostrarImagenPorDefectoUsuario() {
    document.getElementById("linkFotoUsuario").src = "https://cdn-icons-png.flaticon.com/256/847/847969.png";
}

async function cargarDatosPerfil(){
    const id = localStorage.getItem('usuarioId');
    try{
        const response = await fetch(`http://localhost:3000/usuarios/${id}`);
        const datos = await response.json();

        const nombreUsuario = document.getElementById('nombre');
        nombreUsuario.textContent = datos.nombre;

        const apellidoUsuario = document.getElementById('apellido');
        apellidoUsuario.textContent = datos.apellido;

        const usernameUsuario = document.getElementById('username');
        usernameUsuario.textContent = datos.username;

        const redSocialUsuario = document.getElementById('redSocial');
        redSocialUsuario.textContent = datos.redsocial;

        const emailUsuario = document.getElementById('email');
        emailUsuario.textContent = datos.email;

        const bioUsuario = document.getElementById('biografia');
        bioUsuario.textContent = datos.biografia;

        const contactoUsuario = document.getElementById('contacto');
        contactoUsuario.textContent = datos.contacto;

        const urlImagenUsuario = document.getElementById('linkFotoUsuario');
        urlImagenUsuario.src = datos.linkfotoperfil;


        cargarGenerosUsuario(id);
        cargarInstrumentos(id);

    }
    catch (error) {
        console.error("Error:", error);
    }    
}

async function cargarGenerosBanda(id_banda){
    try{
        const response = await fetch(`http://localhost:3000/generos_bandas/${id_banda}`);
        const datos_generos = await response.json();
        let string_generos = '';
        datos_generos.forEach(generos_banda => {
            string_generos += ` ${generos_banda.genero},`;
        })
        let string_generos_limpia = string_generos.slice(0, -1);

        const generosPaginaBanda = document.getElementById('generosBanda');
        generosPaginaBanda.textContent = string_generos_limpia;
    }
    catch (error) {
        console.error("Error:", error);
    }   
}

async function cargarIntegrantesBanda(id_banda){
    try{
        const response = await fetch(`http://localhost:3000/integrantes_bandas/${id_banda}`);
        const integrantes = await response.json();
        let string_username_integrantes = '';
        integrantes.forEach(integrante => {
            string_username_integrantes += ` ${integrante.username},`;
        })
        let string_username_integrantes_limpia = string_username_integrantes.slice(0, -1);

        const integrantesPaginaBanda = document.getElementById('integrantesBanda');
        integrantesPaginaBanda.textContent = string_username_integrantes_limpia;
    }
    catch (error) {
        console.error("Error:", error);
    }   
}

async function cargarDatosBanda() {
    const idUsuario = localStorage.getItem('usuarioId');
    const divInfoBanda = document.getElementById('infoBanda');
    const divCrearBanda = document.getElementById('divCrearBanda');
    const divUnirseBanda = document.getElementById('divUnirseBanda');

    try {
        const responseBandas = await fetch(`http://localhost:3000/obtener_bandas/${idUsuario}`);
        let datosBandas = await responseBandas.json();

        if (!responseBandas.ok || datosBandas.length === 0) {
            divInfoBanda.classList.add("hidden");
            divCrearBanda.classList.remove("hidden");
            divUnirseBanda.classList.remove("hidden");
            return; 
        }

        let idBandaLocalStorage = localStorage.getItem('bandaId');
        let existeId = false;

        datosBandas.forEach(banda => {
            if (banda.id == idBandaLocalStorage) {
                existeId = true;
            }
        });

        if (!idBandaLocalStorage || !existeId) {
            idBandaLocalStorage = datosBandas[0].id;
            localStorage.setItem('bandaId', idBandaLocalStorage);
        }

        const response = await fetch(`http://localhost:3000/bandas/${idBandaLocalStorage}`);
        
        if (!response.ok){
            throw new Error("Error al cargar detalles de la banda");
        } 

        let data = await response.json();

        let datosBanda = data;
        if (Array.isArray(data)){
            datosBanda = data[0];
        }

        document.getElementById('nombreBanda').textContent = datosBanda.nombre || "Sin nombre";
        document.getElementById('descripcionBanda').textContent = datosBanda.descripcion || "";
        document.getElementById('fechaCreacionBanda').textContent = datosBanda.fechacreacion ? String(datosBanda.fechacreacion).split('T')[0] : "";
        document.getElementById('redesBanda').textContent = datosBanda.redsocial || "";

        cargarGenerosBanda(idBandaLocalStorage);
        cargarIntegrantesBanda(idBandaLocalStorage);

        divInfoBanda.classList.remove("hidden");
        divCrearBanda.classList.add("hidden");
        divUnirseBanda.classList.add("hidden");

    } catch (error) {
        console.error("Error en cargarDatosBanda:", error);
        divInfoBanda.classList.add("hidden");
        divCrearBanda.classList.remove("hidden");
        divUnirseBanda.classList.remove("hidden");
    }
}

async function unirseBanda(event) {
    event.preventDefault();
    
    const idUsuario = localStorage.getItem('usuarioId');
    const nombreBanda = document.getElementById('nombreUnirseBanda').value;
    const contraseñaBanda = document.getElementById('contraseñaUnirseBanda').value;

    try {
        const response = await fetch("http://localhost:3000/unirse_banda", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombreBanda,
                contraseña: contraseñaBanda,
                idUsuario: idUsuario
            })
        });

        const datos = await response.json();
    } catch (error) {
        console.error("Error de red:", error);
    }
    event.target.reset();
    location.reload()
}

async function crearBanda(event){
    event.preventDefault();
    const idUsuario = localStorage.getItem('usuarioId');
    const nombreBanda = document.getElementById('nombreCrearBanda').value;
    const redSocial = document.getElementById('redSocialCrearBanda').value;
    const generos = document.getElementById('generosUsuarioCrearBanda').value;
    const descripcion = document.getElementById('descripcionCrearBanda').value;
    const contraseñaBanda = document.getElementById('contraseñaCrearBanda').value;

    const fechaCompleta = new Date();
    const fechaCreacion = String(fechaCompleta.getFullYear() + '-' + String(fechaCompleta.getMonth() +1) + '-' + String(fechaCompleta.getDate()));

    try {
        const response = await fetch("http://localhost:3000/bandas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombreBanda,
                fecha: fechaCreacion,
                contraseña: contraseñaBanda,
                descripcion: descripcion,
                redSocial: redSocial,
                idUsuario: idUsuario,
                generos: generos
            })
        });

        const datos = await response.json();
    } catch (error) {
        console.error("Error de red:", error);
    }
    event.target.reset();
    location.reload()
}

function mostrarImagenCrearEspacio() {
    let linkFotoCrearEspacio = document.getElementById("linkFotoEspacio").value;
    let fotoMuestraEspacio = document.getElementById("fotoDeMuestraEspacio");
    fotoMuestraEspacio.src = linkFotoCrearEspacio;
}

async function crearEspacio(event){
    event.preventDefault();
    const nombreEspacio = document.getElementById('nombreCrearEspacio').value;
    const linkFotoEspacio = document.getElementById('linkFotoEspacio').value;
    const ubicacionEspacio = document.getElementById('ubicacionCrearEspacio').value;
    const descripcionEspacio = document.getElementById('descripcionCrearEspacio').value;
    const contactoEspacio = document.getElementById('contactoCrearEspacio').value;
    const tamañoEspacio = document.getElementById('tamañoCrearEspacio').value;
    const precioEspacio = document.getElementById('precioPorHoraCrearEspacio').value;
    const idUsuario = localStorage.getItem('usuarioId');

    try {
        const response = await fetch("http://localhost:3000/espacios", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombreEspacio,
                ubicacion: ubicacionEspacio,
                linkfotoespacio: linkFotoEspacio,
                descripcion: descripcionEspacio,
                contacto: contactoEspacio,
                tamaño: tamañoEspacio,
                precio: precioEspacio,
                idUsuario: idUsuario
            })
        });

        const datos = await response.json();

        if (response.ok){
            event.target.reset();
            location.reload()
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
}

async function cargarDatosEspacio(){
    const idUsuario = localStorage.getItem('usuarioId');
    const divEspacio = document.getElementById('infoEspacio');
    const divCrearEspacio = document.getElementById('crearEspacio');

    try {
        
        const responseIdEspacios = await fetch(`http://localhost:3000/obtener_id_espacio/${idUsuario}`);
        const datosId = await responseIdEspacios.json(); 

        if (!responseIdEspacios.ok || datosId.length === 0) {
            divEspacio.classList.add("hidden");
            divCrearEspacio.classList.remove("hidden");
            return; 
        }

        let idEspacioLocalStorage = localStorage.getItem('espacioId');

        let existeId = false;
        datosId.forEach(element => {
            if(element.id == idEspacioLocalStorage){
                existeId = true;
            }
        });
        
        if (!idEspacioLocalStorage || !existeId) {
            idEspacioLocalStorage = datosId[0].id;
            localStorage.setItem('espacioId', idEspacioLocalStorage);
        }

        const response = await fetch(`http://localhost:3000/espacios/${idEspacioLocalStorage}`);
        if(!response.ok) throw new Error("Error al cargar detalles");
        
        const datos = await response.json();

        document.getElementById('nombreEspacio').textContent = datos.nombre;
        document.getElementById('ubicacionEspacio').textContent = datos.ubicacion;
        document.getElementById('imagenEspacioMiniespacio').src = datos.linkfotoespacio;
        document.getElementById('descripcionEspacio').textContent = datos.descripcion;
        document.getElementById('contactoEspacio').textContent = datos.contacto;
        document.getElementById('tamañoEspacio').textContent = datos.tamaño;
        document.getElementById('precioEspacio').textContent = datos.precioporhora || 0;

        divEspacio.classList.remove("hidden");
        divCrearEspacio.classList.add("hidden");

    } catch (error) {
        console.error("Error:", error);
        divEspacio.classList.add("hidden");
        divCrearEspacio.classList.remove("hidden");
    }    
}

async function eliminarPerfil() {
    const idUsuario = localStorage.getItem('usuarioId');
    if (!idUsuario) {
        alert("ERROR: No hay ID en localStorage");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const textoError = await response.text();
            throw new Error(textoError); 
        }

        localStorage.removeItem('usuarioId'); 
        window.location.href = "/html/iniciar_sesion.html"; 

    } catch (error) {
        console.error(error);
    }
};

async function dejarBanda() {
    try{
        const idUsuario = localStorage.getItem('usuarioId');
        const responseIdBandas = await fetch(`http://localhost:3000/obtener_id_banda/${idUsuario}`);
        const data_banda = await responseIdBandas.json();
        const idBanda = data_banda.id_banda;
        const responseCantidadIntegrantes = await fetch(`http://localhost:3000/obtener_cantidad_personas_banda/${idBanda}`);
        const dataCantidadIntegrantes = await responseCantidadIntegrantes.json();
        const cantidadIntegrantes = dataCantidadIntegrantes.count;
        if (parseInt(cantidadIntegrantes) > 1){
            const response = await fetch(`http://localhost:3000/dejar_banda/${idUsuario}/${idBanda}`, {
                method: 'DELETE'
            }); 
            if (!response.ok) {
                const textoError = await response.text();
                throw new Error(textoError); 
            }
        }
        else if (parseInt(cantidadIntegrantes) == 1){
            const response = await fetch(`http://localhost:3000/bandas/${idBanda}`, {
                method: 'DELETE'
            }); 
            if (!response.ok) {
                const textoError = await response.text();
                throw new Error(textoError); 
            }
        }
    
    }
    catch(error){
        console.error(error);
    }
    location.reload()
}

async function eliminarEspacio(){
    try{
        const response = await fetch(`http://localhost:3000/espacios/${localStorage.getItem('espacioId')}` , {
            method: 'DELETE'
        });
    }
    catch(error){
        console.error(error);
    }
    location.reload()
    localStorage.removeItem('espacioId');
}

function ocultarMostrarCrearBanda() {
    const divCrearBanda = document.getElementById('divCrearBanda');
    const divUnirseBanda = document.getElementById('divUnirseBanda');
    const botonCrearBanda = document.getElementById('ocultarMostrarCrearBanda');

    if (divCrearBanda.classList.contains('hidden')) {

        divCrearBanda.classList.remove('hidden');   
        divUnirseBanda.classList.add('hidden');  
        
        botonCrearBanda.textContent = "Cancelar / Ocultar formulario";
    } else {

        divCrearBanda.classList.add('hidden');   
        divUnirseBanda.classList.add('hidden');  
        botonCrearBanda.textContent = "Crea otra Banda!";
    }
}

function ocultarMostrarUnirseBanda() {
    const divCrearBanda = document.getElementById('divCrearBanda');
    const divUnirseBanda = document.getElementById('divUnirseBanda');
    const botonUnirseBanda = document.getElementById('ocultarMostrarUnirseBanda');

    if (divUnirseBanda.classList.contains('hidden')) {

        divUnirseBanda.classList.remove('hidden');   
        divCrearBanda.classList.add('hidden');  
        
        botonUnirseBanda.textContent = "Cancelar / Ocultar formulario";
    } else {

        divUnirseBanda.classList.add('hidden');   
        divCrearBanda.classList.add('hidden');  
        botonUnirseBanda.textContent = "Unete a otra Banda!";
    }
}

function ocultarMostrarCrearEspacio(){
    const divCrearEspacio = document.getElementById('crearEspacio');
    const botonVerCrearEspacio = document.getElementById('ocultarMostrarCrearEspacio');
    
    if (divCrearEspacio.classList.contains('hidden')) {
        
        divCrearEspacio.classList.remove('hidden'); 
        botonVerCrearEspacio.textContent = "Ocultar formulario crear espacio"; 
        
    } else {
        
        divCrearEspacio.classList.add('hidden'); 
        botonVerCrearEspacio.textContent = "Crea otro Espacio Jameet!"; 
    }
}

async function mostrarTodosEspacios(){
    const idUsuario = localStorage.getItem('usuarioId');
    const popUpEspacios = document.getElementById('popUpEspacios');
    const divContenedorPopUp = document.getElementById('contenedorPopUpEspacio');
    divContenedorPopUp.innerHTML = '';
    
    try{
        const dataEspacios = await fetch(`http://localhost:3000/obtener_espacios/${idUsuario}`);
        const Espacios = await dataEspacios.json()
        Espacios.forEach(espacio => {
            armarCartaEspacio(espacio);
        });
        popUpEspacios.showModal()
    }
    catch(error){
        console.error(error);
    }
}

async function mostrarTodasBandas(){
    const idUsuario = localStorage.getItem('usuarioId');
    const popUpBandas = document.getElementById('popUpBandas');
    const divContenedorPopUp = document.getElementById('contenedorPopUpBandas');
    divContenedorPopUp.innerHTML = '';
    
    try{
        const dataBandas = await fetch(`http://localhost:3000/obtener_bandas/${idUsuario}`);
        let Bandas = await dataBandas.json()

        if (!Array.isArray(Bandas)) {
            Bandas = Bandas ? [Bandas] : [];
        }

        Bandas.forEach(banda => {
                armarCartaBanda(banda);
            });
        popUpBandas.showModal()
    }
    catch(error){
        console.error(error);
    }
}

function cerrarPopUpEspacio(){
    const popUpEspacios = document.getElementById('popUpEspacios');
    popUpEspacios.close();
}


function cerrarPopUpBanda(){
    const popUpBandas = document.getElementById('popUpBandas');
    popUpBandas.close();
}

function seleccionarEstudio(espacio){
    localStorage.setItem('espacioId', espacio.id);
    cerrarPopUpEspacio();
    location.reload();
}

function seleccionarBanda(banda){
    localStorage.setItem('bandaId', banda.id);
    cerrarPopUpBanda();
    location.reload();
}

async function armarCartaEspacio(espacio){
    const divContenedorPopUp = document.getElementById('contenedorPopUpEspacio');
    const cartaEspacio = document.createElement('div');
    cartaEspacio.className = "miniCartaEspacio";
    const nombreEspacio = document.createElement('h3');
    nombreEspacio.textContent = espacio.nombre;
    const imagenEspacio = document.createElement('img');
    imagenEspacio.src = espacio.linkfotoespacio;
    const botonSeleccionarEspacio = document.createElement('button');
    botonSeleccionarEspacio.textContent = "Seleccionar y mostrar";
    botonSeleccionarEspacio.onclick = () => seleccionarEstudio(espacio);
    cartaEspacio.appendChild(nombreEspacio);
    cartaEspacio.appendChild(imagenEspacio);
    cartaEspacio.appendChild(botonSeleccionarEspacio);
    divContenedorPopUp.appendChild(cartaEspacio);
}

async function armarCartaBanda(Banda){
    const divContenedorPopUp = document.getElementById('contenedorPopUpBandas');
    const cartaBanda = document.createElement('div');
    cartaBanda.className = "miniCartaBanda";
    const nombreBanda = document.createElement('h3');
    nombreBanda.textContent = Banda.nombre;
    const imagenBanda = document.createElement('img');
    imagenBanda.src = Banda.linkfotobanda;
    const botonSeleccionarBanda = document.createElement('button');
    botonSeleccionarBanda.textContent = "Seleccionar y mostrar";
    botonSeleccionarBanda.onclick = () => seleccionarBanda(Banda);
    cartaBanda.appendChild(nombreBanda);
    cartaBanda.appendChild(imagenBanda);
    cartaBanda.appendChild(botonSeleccionarBanda);
    divContenedorPopUp.appendChild(cartaBanda);
}


async function guardarEspacioEditado() {
    try{
        let nombreEspacio = document.getElementById("nombreEspacio");
        let ubicacionEspacio = document.getElementById("ubicacionEspacio");
        let linkFotoEspacio = document.getElementById("imagenEspacioMiniespacio");
        let descripcionEspacio = document.getElementById("descripcionEspacio");
        let contactoEspacio = document.getElementById("contactoEspacio");
        let tamañoEspacio = document.getElementById("tamañoEspacio");
        let precioEspacio = document.getElementById("precioEspacio");
        let idEspacio = localStorage.getItem("espacioId");

        const url = "http://localhost:3000/espacios";
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                nombreEspacio:nombreEspacio.textContent,
                ubicacionEspacio:ubicacionEspacio.textContent,
                linkFotoEspacio:linkFotoEspacio.src,
                descripcionEspacio:descripcionEspacio.textContent,
                contactoEspacio:contactoEspacio.textContent,
                tamañoEspacio:tamañoEspacio.textContent,
                precioPorHora:precioEspacio.textContent,
                espacioId:idEspacio
            })
        })

    }
    catch(err){
        console.error(err);
    }
    
}

async function guardarCambiosBanda(event) {
    event.preventDefault();

    try {
        const generosBanda = document.getElementById('generosBanda');
        const descripcionBanda = document.getElementById('descripcionBanda');
        const redesBanda = document.getElementById('redesBanda');
        const idUsuario = localStorage.getItem('usuarioId');

        const responseIdBandas = await fetch(`http://localhost:3000/obtener_id_banda/${idUsuario}`);
        const data = await responseIdBandas.json();

        const idBanda = data.id_banda;

        await fetch("http://localhost:3000/bandas", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                descripcion: descripcionBanda.textContent,
                redes: redesBanda.textContent,
                generos: generosBanda.textContent,
                idUsuario,
                idBanda
            })
        });

    } catch (error) {
        console.log(error);
    }
}

function cambiarFotoEspacio(event) {
    let imagenEspacio = document.getElementById("imagenEspacioMiniespacio");
    let inputNuevoLink = document.getElementById("inputNuevoLinkEspacio");
    if (event.keyCode === 13){
        event.preventDefault();
        if (inputNuevoLink.value !== ""){
            imagenEspacio.src = inputNuevoLink.value;
            inputNuevoLink.value = "";
        }
        inputNuevoLink.type = "hidden";
    }
}

function mostrarInputNuevoLinkEspacio() {
    let inputNuevoLink = document.getElementById("inputNuevoLinkEspacio"); 
    if (inputNuevoLink.type === "hidden"){
        inputNuevoLink.type= "url";
        inputNuevoLink.addEventListener('keydown', cambiarFotoEspacio)
    }
    else{
        inputNuevoLink.type= "hidden";
    }
}

function mostrarImagenPorDefectoEspacio(creandoEspacio) {
    if (creandoEspacio){
        document.getElementById("fotoDeMuestraEspacio").src = "https://cdn-icons-png.flaticon.com/256/847/847969.png";
    }
    else{
        document.getElementById("imagenEspacioMiniespacio").src = "https://cdn-icons-png.flaticon.com/256/847/847969.png";
    }
}

document.addEventListener("DOMContentLoaded", function(){
    cargarDatosPerfil();
    cargarDatosBanda();
    cargarDatosEspacio();
})