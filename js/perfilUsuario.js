function editorPerfil(){
                const editor = document.getElementById("formularioDeEdicion");
                editor.style.display = "block"
            }

            document.addEventListener("DOMContentLoaded", function(){
                const boton = document.getElementById("botonDeEdicion");
                boton.onclick =function(){
                    editorPerfil();
                };
            })