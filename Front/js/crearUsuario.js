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
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const username = document.getElementById('username').value;
        const biografia = document.getElementById('biografia').value;
        const redesSociales = document.getElementById('redessociales').value;
        const contraseña = document.getElementById('contraseña_usuario').value;
        const email = document.getElementById('email').value;
        let linkfoto = document.getElementById('linkfoto').value;
        const contacto = document.getElementById('contacto').value;
        const instrumentos = document.getElementById('instrumentos').value;
        const generos = document.getElementById('generosfavoritos').value;
        if (!linkfoto){
            linkfoto = "https://cdn-icons-png.flaticon.com/256/847/847969.png";
        }

        const url = "http://localhost:3000/usuarios";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                username: username,
                contraseña: contraseña,
                email: email,
                biografia: biografia,
                redesSociales: redesSociales,
                linkFoto: linkfoto,
                contacto: contacto,
                instrumentos: instrumentos,
                generos: generos
            })
        });
        if (response.ok){
            window.location.href = "iniciar_sesion.html";
        }
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

function validarPalabras(input) {
    const formato = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ,\s]*$/;

    if (!formato.test(input.value)){
        input.setCustomValidity("Solo se permiten letras.");
        input.reportValidity();
        input.style.backgroundColor = "#F44336";
    }
    else{
        input.setCustomValidity("");
        input.style.backgroundColor = "grey";
    }
}

function validarNumeros(input){
    const formato = /^[0-9+]*$/;

    if (!formato.test(input.value)){
        input.setCustomValidity("Solo se permiten numeros.");
        input.reportValidity();
        input.style.backgroundColor = "#F44336";
    }
    else{
        input.setCustomValidity("");
        input.style.backgroundColor = "grey";
    }
}

async function validarCorreo(input){
    const formato = /^.*@.*$/
    let mensajeError = "";

    if (!formato.test(input.value)){
        mensajeError = "Ingrese una direccion valida.";
    }
    else{
        const url = `http://localhost:3000/usuarios/email/${input.value}`;
        try{
            const usuario = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type":"application/json",
                }
            })
            if (usuario.ok){
                mensajeError = "Ya existe un usuario con esa direccion.";
            }
            else{
                input.style.backgroundColor = "grey";
            }
        }
        catch(err){
            console.log(err);
        }
    }
    
    input.setCustomValidity(mensajeError);
    if (mensajeError !== ""){
        input.reportValidity();
        input.style.backgroundColor = "#F44336";
    }
}

function validarContraseña(input){
    let contraseña = input.value;
    let mensajeError = "";

    if (contraseña.length < 8){
        mensajeError = "La contraseña es demasiado corta.";
    }
    else if (!(/[A-Z]/.test(contraseña))){
        mensajeError = "La contraseña debe tener minimo una mayúscula.";
    }
    else if (!(/[0-9]/.test(contraseña))){
        mensajeError = "La contraseña debe tener minimo un número."
    }
    else{
        input.style.backgroundColor = "grey";
    }

    input.setCustomValidity(mensajeError);
    if (mensajeError !== ""){
        input.reportValidity();
        input.style.backgroundColor = "#F44336";
    }
}