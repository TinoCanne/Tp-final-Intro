let hoy = new Date();

document.addEventListener("DOMContentLoaded", async function(){
    const url = `http://localhost:3000/espacios/`;
    const container = document.getElementById("marco_espacios");
    container.innerHTML = "";
    
    try{
        const espacios = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            }
        })    
        const espaciosJson = await espacios.json();
        espaciosJson.forEach(espacio =>{
            const idEspacio = espacio.id;

            const carta = document.createElement("div");
            carta.className = "cartaEspacio";
        
            const fotoespacio = document.createElement("img");
            fotoespacio.src = espacio.linkfotoespacio;
            fotoespacio.className = "fotoEspacio";
    
            const nombre = document.createElement("p");
            nombre.textContent = espacio.nombre;

            const barrio = document.createElement("p");
            barrio.textContent = espacio.ubicacion;

            const precio = document.createElement("p");
            precio.textContent = `$${espacio.precioporhora}/h`;

            const botonReserva = document.createElement('button');
            botonReserva.textContent = "Reservar";
            botonReserva.className = "botonReservar";
            botonReserva.id = "botonReservar";
            botonReserva.addEventListener('click', function(){
                mostrarCalendario(idEspacio);
            });

            carta.appendChild(fotoespacio);
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

async function reservar(diaSeleccionado,  mesSeleccionado, anoSeleccionado, horaSeleccionada, idEspacio){
    const idUsuario = localStorage.getItem('usuarioId');
    const anoSQL = anoSeleccionado;
    const mesSQL = ("0" + mesSeleccionado).slice(-2);   //necesito que si o si el mes y el dia tengan dos caracteres para que lo lea bien sql, DATE tiene formato YYYY-MM-DD.
    const diaSQL = ("0" + diaSeleccionado).slice(-2);
    const fechaReservaSQL = `${anoSQL}-${mesSQL}-${diaSQL}`;

    try {
        const response = await fetch("http://localhost:3000/reservas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario: idUsuario,
                id_espacio:idEspacio,
                fecha_reserva: fechaReservaSQL,
                hora_reserva: horaSeleccionada
            })
        });
        if (response.ok){
            ocultarHorarios(false, true);
        }
    }
    catch(err) {
        alert("algo salio mal con tu reserva");
        console.log(err);
    }
}

async function EstaReservada(fechaSeleccionada, horaSeleccionada, idEspacio){
    const url = `http://localhost:3000/reservas/`;
    try {
        const reservas = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type" : "application/json",
            }
        })
        const reservasJson = await reservas.json();
        let reservaEncontrada = false;
        let fechaSeleccionadaString = fechaSeleccionada.toLocaleDateString('sv-SE');
        reservasJson.forEach(reserva => {
            let idEspacioReserva = reserva.id_espacio;
            let fechaReserva = (reserva.fecha_reserva).split('T')[0];
            let horaReserva = reserva.hora_reserva;

            if ((idEspacioReserva === idEspacio) && (fechaReserva === fechaSeleccionadaString) && (horaReserva === horaSeleccionada)){
                reservaEncontrada = true;
            }
        })
        return reservaEncontrada;
    }
    catch(err) {
        alert("error en la comparacion con reservas");
        console.log(err);
    }
}

async function armarHorarios(diaSeleccionado, mesSeleccionado, anoSeleccionado, hora, idEspacio){
    let contenidoHoras = document.getElementById('contenido_horas');
    const url = `http://localhost:3000/espacios/${idEspacio}`;
    try {
        const espacio = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
            }
        })
        const espacioJson = await espacio.json();

        let horaApertura = espacioJson.horarioapertura;
        let horaCierre = espacioJson.horariocierre;

        let fechaSeleccionada = new Date(anoSeleccionado, mesSeleccionado - 1, diaSeleccionado);
        let hoySinHora = new Date();
        hoySinHora.setHours(0,0,0,0);

        fechaSeleccionadaParaComparar = fechaSeleccionada.getTime();        //no se pueden compara dos datos tipo Date.
        hoySinHoraParaComparar = hoySinHora.getTime();

        let contenidoTemporal = "<tr>";
        for (let i = horaApertura; i < horaCierre; i++){
            if ((((hora + 1) < i) && (fechaSeleccionadaParaComparar === hoySinHoraParaComparar)) || (fechaSeleccionadaParaComparar > hoySinHoraParaComparar)){
                if (await EstaReservada(fechaSeleccionada, i, idEspacio)){
                    contenidoTemporal += "<td class='horasReservadas'>" + i + "</td>";
                }
                else{
                    contenidoTemporal += "<td class='horasDisponibles' onclick='reservar(" + diaSeleccionado + ", " + mesSeleccionado + ", " + anoSeleccionado + ", " + i + ", " + idEspacio + ")'>" + i + "</td>";
                }
            }
            else {
                contenidoTemporal += "<td class='horasAnteriores'>" + i + "</td>";
            }
        }
        contenidoTemporal += "</tr>";
        contenidoHoras.innerHTML = contenidoTemporal;

    }
    catch(err){
        console.log(err);
    }
}

function mostrarHorarios(diaSeleccionado, mesSeleccionado, anoSeleccionado, hora, idEspacio){
    let horarios = document.getElementById('cuadro_horarios');
    horarios.showModal();
    armarHorarios(diaSeleccionado, mesSeleccionado, anoSeleccionado, hora, idEspacio);
}

function ocultarHorarios(vuelveCalendario, reservaRealizada){
    let horarios = document.getElementById('cuadro_horarios');
    horarios.classList.add("cerrandoCuadro");
    if (vuelveCalendario) {
        setTimeout(function animacionCerrando() {
            horarios.close();
            horarios.classList.remove("cerrandoCuadro");
        }, 400);
    }
    else{
        let calendario = document.getElementById('cuadro_calendario');
        calendario.classList.add("cerrandoCuadro");
        let textoReservaExitosa = document.getElementById("texto_reserva_exitosa");
        setTimeout(function animacionCerrando() {
            horarios.close();
            calendario.close()
            horarios.classList.remove("cerrandoCuadro");
            calendario.classList.remove("cerrandoCuadro")
        }, 400);
        if (reservaRealizada) {
            setTimeout(function animacionReservaExitosa() {
                textoReservaExitosa.showModal();
            }, 200);
        }
        setTimeout(function tiempoDeLectura() {
            textoReservaExitosa.classList.add("textoDesapareciendo");
            setTimeout(function animacionSalidaTextoReservaExitosa() {
                textoReservaExitosa.close();
                textoReservaExitosa.classList.remove("textoDesapareciendo");
            }, 400);
        }, 1000);
    }
}

function armarCalendario(ano, mes, hora, idEspacio){
    let meses = Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    let ubicacionCalendario = document.getElementById('ubicacion_en_calendario');
    let contenidoCalendario = document.getElementById('contenido_calendario');
    let hoyParaComparar = new Date().setHours(0,0,0,0);
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
            contenidoTemporal += "<td class='diasAnterioresOVacios'> </td>";
        }
        else{
            if (i === primerDiaMesSemana){
                diaTemporal = 1;
            }
            let fechaCelda = new Date(ano, mes, diaTemporal);
            if (fechaCelda < hoyParaComparar){
                contenidoTemporal += "<td class='diasAnterioresOVacios'>" + diaTemporal + "</td>";
            }
            else{
                contenidoTemporal += "<td class='diasPosteriores' onclick='mostrarHorarios(" + diaTemporal + ", " + (mes + 1) + ", " + ano + ", " + hora + ", " + idEspacio + ")'>" + diaTemporal + "</td>";
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

    ubicacionCalendario.innerHTML = "<button onclick='armarCalendario(" + anoAnterior +", " + mesAnterior + ", " + hora + ", " + idEspacio + ")'>&#171</button> <div>" + meses[mes] + "/" + ano + "</div> <button class='botonDerecha' onclick='armarCalendario(" + proximoAno + ", " + proximoMes + ", " + hora + ", " + idEspacio + ")'>&#187</button>";

}

function mostrarCalendario(idEspacio){
    let calendario = document.getElementById('cuadro_calendario');
    calendario.showModal();
    armarCalendario(hoy.getFullYear(), hoy.getMonth(), hoy.getHours(), idEspacio);
}

function cerrarCalendario(){
    let calendario = document.getElementById('cuadro_calendario');
    calendario.classList.add("cerrandoCuadro");
    setTimeout(function animacionCerrando() {
        calendario.close();
        calendario.classList.remove("cerrandoCuadro");
    }, 400);
}

const calendario = document.getElementById('cuadro_calendario');
const horarios = document.getElementById('cuadro_horarios');

calendario.addEventListener('cancel', function cerrarCalendarioConAnimacion(event) {
    event.preventDefault();
    cerrarCalendario();
})
horarios.addEventListener('cancel', function cerrarHorariosConAnimacion(event) {
    event.preventDefault();
    ocultarHorarios(true, false);
})



