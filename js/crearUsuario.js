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