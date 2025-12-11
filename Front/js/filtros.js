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
})

async function aplicar_filtros_musicos(event){
    event.preventDefault();
    try{
        const genero = document.getElementById('genero-musicos').value;
        const instrumento = document.getElementById('instrumento').value;
        const url = `http://localhost:3000/filtro_musicos?genero=${genero}&instrumento=${instrumento}`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await response.json();
        console.log("Results:", data);
        
        localStorage.setItem("musicos_filtrados", JSON.stringify(data));
    }
    catch (error){
        console.log(error);
    }
    event.target.reset();
    window.location.href = "index.html";
}

async function aplicar_filtros_bandas(event){
    event.preventDefault();
    try{
        const genero = document.getElementById('genero-bandas').value;
        const url = `http://localhost:3000/filtro_bandas?genero=${genero}`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await response.json();
        console.log("Results:", data);
    }
    catch (error){
        console.log(error);
    }
    event.target.reset();
    window.location.href = "bandas.html";
}

async function aplicar_filtros_espacios(event){
    event.preventDefault();
    try{
        const ubicacion = document.getElementById('ubicacion').value;
        const tamaño = document.getElementById('tamaño').value;
        const precioPorHora = document.getElementById('precioPorHora').value;

        const url = `http://localhost:3000/filtro_espacios?ubicacion=${ubicacion}&tamaño=${tamaño}&precioPorHora=${precioPorHora}`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const data = await response.json();
        console.log("Results:", data);
    }
    catch (error){
        console.log(error);
    }
    event.target.reset();
    window.location.href = "perfil_espacio.html";
}

function mostrarCartaMusico(musico) {
    document.getElementById("idPersona").value = musico.id;
    document.getElementById("nombre").textContent = musico.nombre;

    document.getElementById("instrumento").textContent =
        musico.instrumentos || "Sin datos";

    document.getElementById("generos").textContent =
        musico.generos_favoritos || "Sin datos";

    document.getElementById("bio").textContent =
        musico.biografia || "Sin biografía";

    document.getElementById("redsocial").textContent =
        musico.redsocial || "No disponible";

    if (musico.foto) {
        document.getElementById("foto").src = musico.foto;
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const resultado = localStorage.getItem("musicos_filtrados");

    if (resultado) {
        const musicos = JSON.parse(resultado);

        if (musicos.length === 0) {
            mostrarMensajeSinResultados();
            return;
        }

        mostrarCartaMusico(musicos[0]);
        localStorage.removeItem("musicos_filtrados");
    }
});
