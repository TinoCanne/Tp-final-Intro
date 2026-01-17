async function armarCartaEstudio(){
    const url = `http://localhost:3000/espacios/`;
    const container = document.getElementById("marco_estudios");
    container.innerHTML = "";
    
    try{
        const estudios = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            }
        }
    )
    
    
        const estudios_json = await estudios.json();
        estudios_json.forEach(estudio =>{      
            const carta = document.createElement("div");
            carta.className = "cartaEstudio";
        
            const foto_estudio = document.createElement("img");
            foto_estudio.src = estudio.linkFotoEspacio;
    
            const nombre = document.createElement("p");
            nombre.textContent = estudio.nombre;
            carta.appendChild(foto_estudio);
            carta.appendChild(nombre);
            container.appendChild(carta);

        })

    }
    catch(err){
        console.log(err);
    }
}

armarCartaEstudio();