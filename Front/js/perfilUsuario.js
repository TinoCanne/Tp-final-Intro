function editorPerfil(){
    document.addEventListener("DOMContentLoaded", function () {
        const boton= document.getElementById("botonDeEdicionPerfil");
        boton.onclick= function(){
            const datos= document.querySelectorAll(".spanDatosPerfil");
            datos.forEach(elemento => {
                if (elemento.contentEditable === "true"){
                    elemento.contentEditable = "false";
                }
                else{
                    elemento.contentEditable = "true";
                }
            })
            if (boton.textContent === "Editar perfil"){
                boton.textContent = "Guardar cambios";
            }
            else{
                boton.textContent = "Editar perfil"
            }
        }
    })
}
editorPerfil()

function editorBanda(){
    document.addEventListener("DOMContentLoaded", function () {
        const boton= document.getElementById("botonDeEdicionBanda");
        boton.onclick= function(){
            const datos= document.querySelectorAll(".spanDatosBanda");
            datos.forEach(elemento => {
                if (elemento.contentEditable === "true"){
                    elemento.contentEditable = "false";
                }
                else{
                    elemento.contentEditable = "true";
                }
            })
            if (boton.textContent === "Editar banda"){
                boton.textContent = "Guardar cambios";
            }
            else{
                boton.textContent = "Editar banda"
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

        const generosPaginaUsuario = document.getElementById('instrumentosUsuario');
        generosPaginaUsuario.textContent = string_instrumentos_limpia;
    }
    catch (error) {
        console.error("Error:", error);
    }   
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
    const divBanda = document.getElementById('infoBanda')
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

