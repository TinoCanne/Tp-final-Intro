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