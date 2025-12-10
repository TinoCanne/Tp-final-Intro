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
    let idPersonaActual = parseInt(document.getElementById("idPersona").value);

    botonSi.addEventListener("click", function(){
        aceptar_persona(idPersonaActual)
    })
    botonNo.addEventListener("click", function(){
        aceptar_persona(idPersonaActual)
    });
})

async function aplicar_filtros_musicos(event){
    event.preventDefault();
    try{
        const genero = document.getElementById('genero-musicos').value;
        const instrumento = document.getElementById('instrumento').value;
        const url = `http://localhost:3000/filtro_musicos?genero='${genero}'&instrumento='${instrumento}'`;
        
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
}

async function aplicar_filtros_bandas(event){
    event.preventDefault();
    try{
        const genero = document.getElementById('genero-bandas').value;
        const url = `http://localhost:3000/filtro_bandas?genero='${genero}'`;
        
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
}

async function aplicar_filtros_espacios(event){
    event.preventDefault();
    try{
        const ubicacion = document.getElementById('ubicacion').value;
        const horarios = document.getElementById('horarios').value;
        const tamaño = document.getElementById('tamaño').value;
        const precioPorHora = document.getElementById('precioPorHora').value;

        const url = `http://localhost:3000/filtro_espacios?ubicacion='${ubicacion}'&horarios='${horarios}'&tamaño='${tamaño}'&precioPorHora=${precioPorHora}`;
        
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
}

async function aceptar_persona(){

    const nombre = document.getElementById("nombre");
    const bio = document.getElementById("bio");
    const tags = document.getElementById("tags");
    const foto = document.getElementById("foto");
    const idPersona = document.getElementById("idPersona");
    const id_persona_actual = parseInt(idPersona.value);
    const url = `http://localhost:3000/usuarios/${id_persona_actual+1}`;

    idPersona.value = toString(id_persona_actual+1);

    try{
        const siguiente_usuario = await fetch(url, {
            method:"GET", headers: {"Content-Type": "application/json",}
        });

        const usuario_json = await siguiente_usuario.json();
        console.log(usuario_json);

        nombre.innerHTML = usuario_json.nombre;
        bio.innerHTML = usuario_json.biografia;
        foto.src = usuario_json.foto

        tags.replaceChildren();

        let generos = usuario_json.generosfavoritos.split(",")
        generos.forEach(genero => {
            const nuevo_Tag = document.createElement("p");
            nuevo_Tag.className = "cartaTag";
            nuevo_Tag.innerHTML = genero;
            tags.appendChild(nuevo_Tag);
        });

        idPersona.value = id_persona_actual + 1;

    }
    catch(error){
        console.log(error);
    }
}