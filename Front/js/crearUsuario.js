function mostrar_contraseña(){
    let contraseña = document.getElementById('contraseña_usuario');
    let contraseña_repetida = document.getElementById('contraseña_usuario_repetida');
    let boton_mostrar_contraseña = document.getElementById('mostrar_contraseña');
    boton_mostrar_contraseña.addEventListener('click', function(){
        if (contraseña.type == 'password'){
            contraseña.type = 'text';
        }
        else{
            contraseña.type = 'password';
        }
        if (contraseña_repetida.type == 'password'){
            contraseña_repetida.type = 'text';
        }
        else{
            contraseña_repetida.type = 'password';
        }
    })
}
mostrar_contraseña();

function asegurar_contraseñas_iguales(event){
    let contraseña = document.getElementById('contraseña_usuario');
    let contraseña_repetida = document.getElementById('contraseña_usuario_repetida');
    let err = document.getElementById('error_contraseña');

    if (contraseña.value !== contraseña_repetida.value){
        err.innerHTML = "Las contraseñas no coinciden.";
        return false;
    }
    else{
        err.innerHTML = "";
        return true;
    }
}

async function crear_usuario(event){
    event.preventDefault();

    if (!asegurar_contraseñas_iguales(event)){
        return
    }

    try{
        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const username = document.getElementById('username');
        const biografia = document.getElementById('biografia');
        const redesSociales = document.getElementById('redessociales');
        const contraseña = document.getElementById('contraseña_usuario');
        const email = document.getElementById('email');
        const linkfoto = document.getElementById('linkfoto');
        const contacto = document.getElementById('contacto');
        const instrumentos = document.getElementById('instrumentos');
        const generos = document.getElementById('generosfavoritos')

        const url = "http://localhost:3000/usuarios";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: nombre.value,
                apellido: apellido.value,
                username: username.value,
                contraseña: contraseña.value,
                email: email.value,
                biografia: biografia.value,
                redesSociales: redesSociales.value,
                linkFoto: linkfoto.value,
                contacto: contacto.value,
                instrumentos: instrumentos.value,
                generos: generos.value
            })
        });
        window.location.href = "iniciar_sesion.html";
    }
    catch (error){
        console.log(error);
    }
    
}

function es_url_valido(url){
    if (!url){
        return false
    }
    return true
}

function mostrar_imagen_por_defecto(){
    document.getElementById("vista_previa").src = "https://cdn-icons-png.flaticon.com/256/847/847969.png";
}

function mostrar_imagen() {
    const url = document.getElementById("linkfoto").value;
    const url_perfil_sin_foto = document.getElementById("vista_previa").src;
    if (!es_url_valido(url)){
        return
    }
    
    document.getElementById("vista_previa").src = url;
}
