

document.addEventListener("DOMContentLoaded", async function(){
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
            botonReserva.onclick = mostrarCalendario;

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
})

function mostrarCalendario(){
    let calendario = document.getElementById('cuadro_reservas');
    let fondo = document.getElementById('fondo_reservas');
    calendario.style.display = 'flex';
    fondo.style.display = 'block';
}

function cerrarCalendario(){
    let calendario = document.getElementById('cuadro_reservas')
    let fondo = document.getElementById('fondo_reservas');
    calendario.style.display = 'none';
    fondo.style.display = 'none';
}

let hoy = new Date();
let hoyParaComparacion = hoy.setHours(0, 0, 0, 0);
function armarCalendario(ano, mes, hoyParaComparacion){
    let meses = Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    let ubicacionCalendario = document.getElementById('ubicacion_en_calendario');
    let contenidoCalendario = document.getElementById('contenido_calendario');
    
    let primerDiaMesSemana = (new Date(ano, mes, 1)).getDay();
    if (primerDiaMesSemana === 0) {    //en js el 0 significa domingo, no lunes.
        primerDiaMesSemana = 7;
    }
    let ultimoDiaMes = (new Date(ano, mes+1, 0)).getDate();
    let ultimaCeldaMes = (primerDiaMesSemana + ultimoDiaMes - 1);
    let cantidadCeldas = 42;
    console.log(ultimaCeldaMes);
    if (ultimaCeldaMes <= 35){
        cantidadCeldas = 35;
    }

    let contenidoTemporal = "";
    let diaTemporal = 0;
    for (let i = 1; i <= cantidadCeldas; i++){  //empieza en 1 porque el primerDiaMes minimo es 1.
        if ((i % 7) === 1 ) {
            contenidoTemporal += "<tr>";
        }
        if ((i < primerDiaMesSemana) || (i > ultimaCeldaMes)){
            contenidoTemporal += "<td> </td>";
        }
        else{
            if (i === primerDiaMesSemana){
                diaTemporal = 1;
            }
            let fechaCelda = new Date(ano, mes, diaTemporal);
            if (fechaCelda < hoyParaComparacion){
                contenidoTemporal += "<td class='diasAnteriores'>" + diaTemporal + "</td>";
            }
            else{
                contenidoTemporal += "<td class='diasPosteriores' onclick=''>" + diaTemporal + "</td>";
            }
            diaTemporal++;
        }

        if ((i % 7) === 0){
            contenidoTemporal += "</tr>"
        }
    }

    contenidoCalendario.innerHTML = contenidoTemporal;

    let proximoMes = mes + 1;
    let mesAnterior = mes -1
    let proximoAno = ano;
    let anoAnterior = ano;

    if (proximoMes === 12){
        proximoMes = 0;
        proximoAno = ano + 1;
    }

    if (mesAnterior === -1){
        mesAnterior = 11
        anoAnterior = ano - 1;
    }

    ubicacionCalendario.innerHTML = "<button onclick='armarCalendario(" + anoAnterior +", " + mesAnterior + ", " + hoyParaComparacion + ")'>&#171</button> <div>" + meses[mes] + "/" + ano + "</div> <button class='botonDerecha' onclick='armarCalendario(" + proximoAno + ", " + proximoMes + ", " + hoyParaComparacion + ")'>&#187</button>";

}

armarCalendario(hoy.getFullYear(), hoy.getMonth(), hoyParaComparacion);