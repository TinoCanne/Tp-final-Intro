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

    }
    catch (error) {
        console.error("Error:", error);
    }    
}

async function cargarDatosBandas(){
    const idUsuario = localStorage.getItem('usuarioId');
    const responseIdBandas = await fetch(`http://localhost:3000/usuarios/${idUsuario}`)
    const data = await responseIdBandas.json();
    const id = data.id_bandas;
    if (id) {
        console.log("La banda es la " + id);
    }
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
        fechaCreacionBanda.textContent = datos.fechaCreacion;

        const redesBanda = document.getElementById('redesBanda');
        redesBanda.textContent = datos.redsocial;
    }
    catch (error) {
        console.error("Error:", error);
    }    
}

function mostrarBanda(tieneBanda) {
    const divBanda = document.getElementById("infoBanda");

    if (tieneBanda) {
        divBanda.classList.remove("hiddenBanda");
    } else {
        divBanda.classList.add("hiddenBanda");
    }
}

function cargarDatosEnBanda(usuario) {
    if (!usuario.banda) {
        mostrarBanda(false);
    } else {
        mostrarBanda(true);

        document.getElementById("nombreBanda").nextElementSibling.textContent = usuario.banda.nombre;
        document.getElementById("generosBanda").nextElementSibling.textContent = usuario.banda.generos;
        document.getElementById("descripcionBanda").nextElementSibling.textContent = usuario.banda.descripcion;
        document.getElementById("integrantesBanda").nextElementSibling.textContent = usuario.banda.integrantes.join(", ");
        document.getElementById("fechaCreacionBanda").nextElementSibling.textContent = usuario.banda.fechacreacion;
    }
}
