document.addEventListener("DOMContentLoaded", () => {
    const botonBuscador = document.getElementById("botonBuscador");
    
    const idUsuario = document.getElementById("idUsuario");

    const botonMusicos = document.getElementById('botonMostrarFiltrosMusicos');
    const botonBandas = document.getElementById('botonMostrarFiltrosBandas');
    const botonSalas = document.getElementById('botonMostrarFiltrosSalas');

    const filtroMusicos = document.getElementById('filtroMusicos');
    const filtroBandas = document.getElementById('filtroBandas');
    const filtroSalas = document.getElementById('filtroSalas');

    const botonSi = document.getElementById("botonSi");
    const botonNo = document.getElementById("botonNo");

    idUsuario.value = localStorage.getItem('usuarioId')

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

async function agregar_a_contactos(idPropio, idContacto){
    url = `http://localhost:3000/`
    const subida = await fetch(url, {
        method:"POST", 
        headers: {"Content-Type": "application/json"}, 
        body: {
            id_propia:idPropio,
            id_contacto:idContacto
        }
    })
}

async function aceptar_persona(){

    const nombre = document.getElementById("nombre");
    const id_propio = document.getElementById("idPropia")
    const bio = document.getElementById("bio");
    const tags = document.getElementById("tags");
    const foto = document.getElementById("foto");
    const idPersona = document.getElementById("idPersona");
    const id_persona_actual = parseInt(idPersona.value);
    const url = `http://localhost:3000/usuarios/${id_persona_actual+1}`;
    const url_generos = `http://localhost:3000/generos_usuarios/${id_persona_actual+1}`

    idPersona.value = toString(id_persona_actual+1);

    try{
        const siguiente_usuario = await fetch(url, {
            method:"GET", headers: {"Content-Type": "application/json",}
        });

        const generos = await fetch(url_generos, {
            method:"GET", headers: {"Content-Type": "application/json",}
        });

        const usuario_json = await siguiente_usuario.json();
        const generos_json = await generos.json();

        console.log(usuario_json);

        nombre.innerHTML = usuario_json.nombre;
        bio.innerHTML = usuario_json.biografia;
        foto.src = usuario_json.foto

        tags.replaceChildren();

        generos_json.forEach(genero => {
            const nuevo_Tag = document.createElement("p");
            nuevo_Tag.className = "cartaTag";
            nuevo_Tag.innerHTML = genero.genero;
            tags.appendChild(nuevo_Tag);
        });

        agregar_a_contactos(id_propio, id_persona_actual)

        idPersona.value = id_persona_actual + 1;

    }
    catch(error){
        console.log(error);
    }
}