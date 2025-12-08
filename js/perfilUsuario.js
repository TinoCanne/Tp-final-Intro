function editorPerfil(){
    document.addEventListener("DOMContentLoaded", function () {
        const boton= document.getElementById("botonDeEdicion");
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