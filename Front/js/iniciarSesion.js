function mostrar_contraseña(){
    let contraseña = document.getElementById('contraseña_usuario');
    let boton_mostrar_contraseña = document.getElementById('mostrar_contraseña');
    boton_mostrar_contraseña.addEventListener('click', function(){
        if (contraseña.type == 'password'){
            contraseña.type = 'text';
        }
        else{
            contraseña.type = 'password';
        }
    })
}
mostrar_contraseña();


async function login(event) {
    event.preventDefault();
    try {
        const email = document.getElementById('email_usuario');
        const contraseña = document.getElementById('contraseña_usuario');
        
        const url = "http://localhost:3000/usuarios/login"; 
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.value,
                    contraseña: contraseña.value
                }) 
            });
            const data = await response.json();

            if (!(response.ok)){
                let mensajeError = document.getElementById("error_login");
                email.style.backgroundColor = "#F44336";
                contraseña.style.backgroundColor = "#F44336";

                mensajeError.show();
                mensajeError.classList.add("mensajeEnDesaparicion")
                setTimeout(function cerrarDialog(){
                    mensajeError.close();
                    mensajeError.classList.remove("mensajeEnDesaparicion")
                }, 1000);
                return;
            }

            console.log(data);

            const id = data.id;
            localStorage.setItem('usuarioId', id);
            window.location.href = "../index.html";
    }
    catch(error){
        console.log(error);
    }
}