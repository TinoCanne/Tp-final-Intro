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

async function crear_usuario(event){

    event.preventDefault();
    try{
        const nombre = document.getElementById('nombre');
        const username = document.getElementById('username');
        const contraseña = document.getElementById('contraseña_usuario');
        const email = document.getElementById('email');

        const url = "http://localhost:3000/crear_usuario";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre: nombre.value,
                username: username.value,
                contraseña: contraseña.value,
                email: email.value
            })
        });
    }
    catch (error){
        console.log(error);
    }
    event.target.reset();
}