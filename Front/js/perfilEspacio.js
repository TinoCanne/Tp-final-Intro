let hoy = new Date();

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
        })    
        const estudiosJson = await estudios.json();
        estudiosJson.forEach(estudio =>{
            const idEstudio = estudio.id;

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
            botonReserva.addEventListener('click', function(){
                mostrarCalendario(idEstudio);
            });

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

async function armarHorarios(diaSeleccionado, hora, idEstudio){
    let contenidoHoras = document.getElementById('contenido_horas');
    const url = `http://localhost:3000/espacios/${idEstudio}`;
    try{
        const estudio = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
            }
        })
        const estudioJson = await estudio.json();

        const horaApertura = estudioJson.horarioapertura;
        const horaCierre = estudioJson.horariocierre;

        let contenidoTemporal = "<tr>";

        for (let i = horaApertura; i <= horaCierre; i++){
            contenidoTemporal += "<td>" + i + "</td>";
        }
        contenidoTemporal += "</tr>";

        contenidoHoras.innerHTML = contenidoTemporal;

    }
    catch(err){
        console.log(err);
    }
}

function mostrarHorarios(diaSeleccionado, hora, idEstudio){
    let calendario = document.getElementById('cuadro_calendario');
    let horarios = document.getElementById('cuadro_horarios');
    calendario.style.display = 'none';
    horarios.style.display = 'flex';

    armarHorarios(diaSeleccionado, hora, idEstudio);
}

function ocultarHorarios(vuelveCalendario){
    let horarios = document.getElementById('cuadro_horarios')
    horarios.style.display = 'none';
    if (vuelveCalendario){
        let calendario = document.getElementById('cuadro_calendario');
        calendario.style.display = 'flex';
    }
    else{
        let fondo = document.getElementById('fondo_reservas');
        fondo.style.display = 'none';
    }
}

function armarCalendario(ano, mes, hora, idEstudio){
    let meses = Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    let ubicacionCalendario = document.getElementById('ubicacion_en_calendario');
    let contenidoCalendario = document.getElementById('contenido_calendario');
    let hoyParaComparar = new Date().setHours(0,0,0,0);
    console.log(hora);
    let primerDiaMesSemana = (new Date(ano, mes, 1)).getDay();
    if (primerDiaMesSemana === 0) {    //en js el 0 significa domingo, no lunes.
        primerDiaMesSemana = 7;
    }
    let ultimoDiaMes = (new Date(ano, mes+1, 0)).getDate();
    let ultimaCeldaMes = (primerDiaMesSemana + ultimoDiaMes - 1);
    let cantidadCeldas = 42;
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
            if (fechaCelda < hoyParaComparar){
                contenidoTemporal += "<td class='diasAnteriores'>" + diaTemporal + "</td>";
            }
            else{
                contenidoTemporal += "<td class='diasPosteriores' onclick='mostrarHorarios(" + diaTemporal + ", " + hora + ", " + idEstudio + ")'>" + diaTemporal + "</td>";
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

    ubicacionCalendario.innerHTML = "<button onclick='armarCalendario(" + anoAnterior +", " + mesAnterior + ", " + hora + ", " + idEstudio + ")'>&#171</button> <div>" + meses[mes] + "/" + ano + "</div> <button class='botonDerecha' onclick='armarCalendario(" + proximoAno + ", " + proximoMes + ", " + hora + ", " + idEstudio + ")'>&#187</button>";

}

function mostrarCalendario(idEstudio){
    let calendario = document.getElementById('cuadro_calendario');
    let fondo = document.getElementById('fondo_reservas');
    calendario.style.display = 'flex';
    fondo.style.display = 'block';
    armarCalendario(hoy.getFullYear(), hoy.getMonth(), hoy.getHours(), idEstudio);
}

function cerrarCalendario(){
    let calendario = document.getElementById('cuadro_calendario')
    let fondo = document.getElementById('fondo_reservas');
    calendario.style.display = 'none';
    fondo.style.display = 'none';
}


