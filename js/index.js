document.addEventListener("DOMContentLoaded", () => {
    
    const botonMusicos = document.getElementById('botonMostrarFiltrosMusicos');
    const botonBandas = document.getElementById('botonMostrarFiltrosBandas');
    const botonSalas = document.getElementById('botonMostrarFiltrosSalas');

    const filtroMusicos = document.getElementById('filtroMusicos');
    const filtroBandas = document.getElementById('filtroBandas');
    const filtroSalas = document.getElementById('filtroSalas');

    function ocultarTodo() {
            filtroMusicos.classList.add('hidden');
            filtroBandas.classList.add('hidden');
            filtroSalas.classList.add('hidden');
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
})