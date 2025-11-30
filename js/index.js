document.addEventListener("DOMContentLoaded", () => {
    const botonBuscador = document.getElementById("botonBuscador");
    
    const botonMusicos = document.getElementById('botonMostrarFiltrosMusicos');
    const botonBandas = document.getElementById('botonMostrarFiltrosBandas');
    const botonSalas = document.getElementById('botonMostrarFiltrosSalas');

    const filtroMusicos = document.getElementById('filtroMusicos');
    const filtroBandas = document.getElementById('filtroBandas');
    const filtroSalas = document.getElementById('filtroSalas');

    const botonSi = document.getElementById("botonSi");
    const botonNo = document.getElementById("botonNo");

    function testBotones(){
        console.log("click");
    }

    function ocultarTodo() {
            filtroMusicos.classList.add('hidden');
            filtroBandas.classList.add('hidden');
            filtroSalas.classList.add('hidden');
    }

    function mostrarBuscador(){
        const buscador = document.getElementById("cartaBuscador");

        if(buscador.style.display == 'none'){
            buscador.style.display = 'block';
        }
        else if(buscador.style.display == 'block'){
            buscador.style.display = 'none';
        }
    }

    botonMusicos.addEventListener('click', () => {
        ocultarTodo(); 
        filtroMusicos.classList.remove('hidden'); 
    });

    botonBandas.addEventListener('click', () => {
        ocultarTodo(); 
        filtroBandas.classList.remove('hidden'); 
    });

    botonSalas.addEventListener('click', () => {
        ocultarTodo(); 
        filtroSalas.classList.remove('hidden'); 
    });

    botonBuscador.addEventListener("click", mostrarBuscador);
    botonSi.addEventListener("click", testBotones);
    botonNo.addEventListener("click", testBotones);
})