document.addEventListener("DOMContentLoaded", function(){
    const boton_usuarios = document.getElementById("botonUsuarios");
    const boton_bandas = document.getElementById("botonBandas");
    const boton_espacios = document.getElementById("botonEspacios");
    boton_usuarios.onclick = function(){
        testBoton(1);
    }
    boton_bandas.onclick=function(){
        testBoton(2);
    }
    boton_espacios.onclick=function(){
        testBoton(3);
    }
})

function testBoton(num){
    console.log(`click ${num}`);
}