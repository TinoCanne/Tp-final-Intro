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
        const estudiosJson = await estudios.json();
        estudiosJson.forEach(estudio =>{      
            const carta = document.createElement("div");
            carta.className = "cartaEstudio";
        
            const fotoEstudio = document.createElement("img");
            fotoEstudio.src = estudio.linkfotoespacio;
            fotoEstudio.className = "fotoEstudio";
    
            const nombre = document.createElement("p");
            nombre.textContent = estudio.nombre;

            const barrio = document.createElement("p");
            barrio.textContent = estudio.ubicacion;

            const precio = document.createElement("p");
            precio.textContent = `$${estudio.precioporhora}/h`;

            const botonReserva = document.createElement('button');
            botonReserva.textContent = "Reservar";
            botonReserva.className = "botonReservar";
            botonReserva.id = "botonReservar";


            carta.appendChild(fotoEstudio);
            carta.appendChild(nombre);
            carta.appendChild(barrio);
            carta.appendChild(precio);

            carta.appendChild(botonReserva);
            container.appendChild(carta);

        })

    }
    catch(err){
        console.log(err);
    }
}

armarCartaEstudio();