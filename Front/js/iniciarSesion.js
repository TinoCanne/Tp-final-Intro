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

async function obtenerId(event) {
    event.preventDefault();
    
    try {
        const email = document.getElementById('email_usuario').value;
        const contraseña = document.getElementById('contraseña_usuario').value;
        
        const url = "http://localhost:3000/login"; 
        
        const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        contraseña: contraseña
                        }) 
                    });
                const data = await response.json();
                const id = data.id;
                
                console.log("Login exitoso. ID guardado:", id);
                localStorage.setItem('usuarioId', id);
                
                window.location.href = "perfil.html";
            }
            catch(error){
                console.log(error);
                }
            }
