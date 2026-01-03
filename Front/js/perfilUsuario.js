
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

        const url = "http://localhost:3000/perfil_usuario";
        const response = await fetch(url, {
            method: "POST",
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

    boton.onclick= function(event){
        datos.forEach(elemento => {
            if (elemento.contentEditable === "true"){
                elemento.contentEditable = "false";
                elemento.removeEventListener('keydown', prevenirSaltoDeLinea);
                fotoPerfil.removeEventListener('click', mostrarInputNuevoLink);
                if (inputNuevoLink.type !== "hidden"){
                    inputNuevoLink.type = "hidden";
                }
            }
            else{
                elemento.contentEditable = "true";
                elemento.addEventListener('keydown', prevenirSaltoDeLinea);
                fotoPerfil.addEventListener('click', mostrarInputNuevoLink);
            }
        })
        if (boton.textContent === "Editar perfil"){
            boton.textContent = "Guardar cambios";
        }
        else{
            boton.textContent = "Editar perfil"
            perfil_usuario(event);
        }
    }
})

async function banda_usuario(event){
    event.preventDefault();

    try{
        const nombreBanda = document.getElementById('nombreBanda');
        const genersoBanda = document.getElementById('generosBanda');
        const descripcionBanda = document.getElementById('descripcionBanda');
        const fechaCreacionBanda = document.getElementById('fechaCreacionBanda');
        const redesBanda = document.getElementById('redesBanda');
        const idUsuario = localStorage.getItem('usuarioId');
        
        const responseIdBandas = await fetch(`http://localhost:3000/usuarios/${idUsuario}`)
        const data = await responseIdBandas.json();
        const idBanda = data.id_banda;

        const url = "http://localhost:3000/banda_usuario";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                nombre: nombreBanda.textContent,
                fechaCreacion: fechaCreacionBanda.textContent,
                descripcion: descripcionBanda.textContent,
                redes: redesBanda.textContent,
                generos: genersoBanda.textContent,
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
                banda_usuario(event);
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
    if (id) {
        console.log("El usuario es el " + id);
    }
    try{
        const response = await fetch(`http://localhost:3000/usuarios/${id}`);
        const datos = await response.json();
        console.log(datos);
        console.log("el link es: " + datos.linkfotoperfil);

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
        const response = await fetch(`http://localhost:3000/username_integrantes_bandas/${id_banda}`);
        const username_integrantes = await response.json();
        let string_username_integrantes = '';
        username_integrantes.forEach(integrante => {
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
    const responseIdBandas = await fetch(`http://localhost:3000/usuarios/${idUsuario}`)
    const data = await responseIdBandas.json();
    const id = data.id_banda;
    const divBanda = document.getElementById('infoBanda');
    const divBandaOpciones = document.getElementById('opcionesBanda');
    if (id) {
        console.log("La banda es la " + id);

        try{
            const response = await fetch(`http://localhost:3000/bandas/${id}`);
            const datos = await response.json();
            console.log(datos);

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
        console.log(datos);
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

    try {
        const response = await fetch("http://localhost:3000/crear_banda", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombreBanda,
                contraseña: contraseñaBanda,
                descripcion: descripcion,
                redSocial: redSocial,
                idUsuario: idUsuario,
                generos: generos
            })
        });

        const datos = await response.json();
        console.log(datos);
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
        console.log(datos);
    } catch (error) {
        console.error("Error de red:", error);
    }
    event.target.reset();
}

async function cargarDatosEspacio(){
    const idUsuario = localStorage.getItem('usuarioId');
    const responseIdEspacios = await fetch(`http://localhost:3000/usuarios/${idUsuario}`);
    const data = await responseIdEspacios.json();
    const id = data.id_espacio;
    const divEspacio = document.getElementById('infoEspacio');
    const divCrearEspacio = document.getElementById('crearEspacio');
    console.log("ACA");
    if (id) {
        console.log("El espacio es el " + id);

        try{
            const response = await fetch(`http://localhost:3000/espacios/${id}`);
            const datos = await response.json();
            console.log(datos);

            const nombreEspacio = document.getElementById('nombreEspacio');
            nombreEspacio.textContent = datos.nombre;

            const ubicacionEspacio = document.getElementById('ubicacionEspacio');
            ubicacionEspacio.textContent = datos.ubicacion;

            const descripcionEspacio = document.getElementById('descripcionEspacio');
            descripcionEspacio.textContent = datos.descripcion;
            
            const contactoEspacio = document.getElementById('contactoEspacio');
            contactoEspacio.textContent = datos.contacto;

            const tamañoEspacio = document.getElementById('tamañoEspacio');
            tamañoEspacio.textContent = datos.tamaño;

            const precioEspacio = document.getElementById('precioEspacio');
            const precio = String(datos.precioporhora);
            precioEspacio.textContent = precio;   

    
            divEspacio.classList.remove("hiddenEspacio");
            divCrearEspacio.classList.add("hiddenEspacio");
        }
        catch (error) {
            console.error("Error:", error);
        }    
    }
    else{
        divEspacio.classList.add("hiddenEspacio");
        divCrearEspacio.classList.remove("hiddenEspacio");
    }
}