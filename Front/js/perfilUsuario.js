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

async function editar_banda_usuario(event){
    event.preventDefault();

    try{
        const generosBanda = document.getElementById('generosBanda');
        const descripcionBanda = document.getElementById('descripcionBanda');
        const redesBanda = document.getElementById('redesBanda');
        const idUsuario = localStorage.getItem('usuarioId');
        
        const responseIdBandas = await fetch(`http://localhost:3000/obtener_id_banda/${idUsuario}`)
        const data = await responseIdBandas.json();

    
        const idBanda = data.id_banda;

        const url = "http://localhost:3000/bandas";
        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                descripcion: descripcionBanda.textContent,
                redes: redesBanda.textContent,
                generos: generosBanda.textContent,
                idUsuario: idUsuario,
                idBanda: idBanda
            })
        });
    }
    catch (error){
        console.log(error);
    }
}


function editorBanda(){
    document.addEventListener("DOMContentLoaded", function () {
        const boton= document.getElementById("botonDeEdicionBanda");
        boton.onclick= function(event){
            const datos= document.querySelectorAll(".spanDatosBanda");
            datos.forEach(elemento => {
                if (elemento.contentEditable === "true"){
                    elemento.contentEditable = "false";
                    elemento.removeEventListener('keydown', prevenirSaltoDeLinea);
                }
                else{
                    elemento.contentEditable = "true";
                    elemento.addEventListener('keydown', prevenirSaltoDeLinea)
                }
            })
            if (boton.textContent === "Editar banda"){
                boton.textContent = "Guardar cambios";
            }
            else{
                boton.textContent = "Editar banda"
                editar_banda_usuario(event);
            }
        }
    })
}
editorBanda()

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

function mostrarImagenPorDefecto() {
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

async function cargarDatosBanda(){
    const idUsuario = localStorage.getItem('usuarioId');
    const responseIdBandas = await fetch(`http://localhost:3000/obtener_id_banda/${idUsuario}`)
    const data = await responseIdBandas.json();
    const id = data.id_banda;
    const divBanda = document.getElementById('infoBanda');
    const divBandaOpciones = document.getElementById('opcionesBanda');
    if (id) {
        try{
            const response = await fetch(`http://localhost:3000/bandas/${id}`);
            const datos = await response.json();

            const nombreBanda = document.getElementById('nombreBanda');
            nombreBanda.textContent = datos.nombre;

            const integrantesBanda = document.getElementById('integrantesBanda');
            integrantesBanda.textContent = datos.integrantes;

            const descripcionBanda = document.getElementById('descripcionBanda');
            descripcionBanda.textContent = datos.descripcion;
            
            const fechaCreacionBanda = document.getElementById('fechaCreacionBanda');
            fecha = String(datos.fechacreacion);
            fechaCreacionBanda.textContent = fecha;

            const redesBanda = document.getElementById('redesBanda');
            redesBanda.textContent = datos.redsocial;
            divBanda.classList.remove("hiddenBanda");
            divBandaOpciones.style.display = "none";
            cargarGenerosBanda(id);
            cargarIntegrantesBanda(id);
        }
        catch (error) {
            console.error("Error:", error);
        }    
    }
    else{
        divBanda.classList.add("hiddenBanda");
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
}

async function crearEspacio(event){
    event.preventDefault();
    const nombreEspacio = document.getElementById('nombreCrearEspacio').value;
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
                descripcion: descripcionEspacio,
                contacto: contactoEspacio,
                tamaño: tamañoEspacio,
                precio: precioEspacio,
                idUsuario: idUsuario
            })
        });

        const datos = await response.json();
    } catch (error) {
        console.error("Error de red:", error);
    }
    event.target.reset();
}

async function cargarDatosEspacio(){
    const idUsuario = localStorage.getItem('usuarioId');
    const divEspacio = document.getElementById('infoEspacio');
    const divCrearEspacio = document.getElementById('crearEspacio');

    try {
        const responseIdEspacios = await fetch(`http://localhost:3000/obtener_id_espacio/${idUsuario}`);

        if (!responseIdEspacios.ok) {
            console.log("No tiene espacio (404), mostrando formulario.");
            divEspacio.classList.add("hiddenEspacio");
            divCrearEspacio.classList.remove("hiddenEspacio");
            return; 
        }
        
        const datosId = await responseIdEspacios.json(); 
        console.log(datosId);

        if (datosId[0]) {
            const primerId = datosId[0].id;
            const response = await fetch(`http://localhost:3000/espacios/${primerId}`);
        
            if(!response.ok) throw new Error("Error al cargar detalles");

            const datos = await response.json();
            const botonMostrarTodosEspacios = document.getElementById('mostrarTodosEspacios');

            document.getElementById('nombreEspacio').textContent = datos.nombre;
            document.getElementById('ubicacionEspacio').textContent = datos.ubicacion;
            document.getElementById('descripcionEspacio').textContent = datos.descripcion;
            document.getElementById('contactoEspacio').textContent = datos.contacto;
            document.getElementById('tamañoEspacio').textContent = datos.tamaño;
            
            const precio = String(datos.precioporhora || 0);
            document.getElementById('precioEspacio').textContent = precio;   
    
            divEspacio.classList.remove("hiddenEspacio");
            divCrearEspacio.classList.add("hiddenEspacio");
        }
        else {
            divEspacio.classList.add("hiddenEspacio");
            divCrearEspacio.classList.remove("hiddenEspacio");
        }

    } catch (error) {
        console.error("Error de red o servidor:", error);
        divEspacio.classList.add("hiddenEspacio");
        divCrearEspacio.classList.remove("hiddenEspacio");
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
}

async function eliminarEspacio(){
    try{
        const idUsuario = localStorage.getItem('usuarioId');
        const dataEspacio = await fetch(`http://localhost:3000/obtener_id_espacio/${idUsuario}`);
        const Espacio = await dataEspacio.json();
        const idEspacio = Espacio.id;
        const response = await fetch(`http://localhost:3000/espacios/${idEspacio}` , {
            method: 'DELETE'
        });
    }
    catch(error){
        console.error(error);
    }
}

function ocultarMostrarCrearEspacio(){
    const divCrearEspacio = document.getElementById('crearEspacio');
    const botonVerCrearEspacio = document.getElementById('ocultarMostrarCrearEspacio');
    
    if (divCrearEspacio.classList.contains('hiddenEspacio')) {
        
        divCrearEspacio.classList.remove('hiddenEspacio'); 
        botonVerCrearEspacio.textContent = "Ocultar formulario crear espacio"; 
        
    } else {
        
        divCrearEspacio.classList.add('hiddenEspacio'); 
        botonVerCrearEspacio.textContent = "Crea otro Espacio Jameet!"; 
    }
}

async function mostrarTodosEspacios(idsEspacios){

}