let hoy = new Date();
let espacioSeleccionado = null;


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

            const diasAbierto = document.createElement("p");
            diasAbierto.textContent = espacio.diasabierto;

            const botonReserva = document.createElement('button');
            botonReserva.textContent = "Reservar";
            botonReserva.className = "botonReservar";
            botonReserva.id = "botonReservar";
            botonReserva.addEventListener('click', function(){
                mostrarCalendario(espacio);
            });

            carta.appendChild(fotoespacio);
            carta.appendChild(nombre);
            carta.appendChild(barrio);
            carta.appendChild(precio);
            carta.appendChild(diasAbierto);

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

    try {
        const response = await fetch("http://localhost:3000/reservas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario: idUsuario,
                id_espacio:idEspacio,
                hora_reserva: horaSeleccionada,
                dia_reserva: diaSeleccionado,
                mes_reserva: mesSeleccionado,
                año_reserva: anoSeleccionado
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

function horaEstaReservada(reservasDia, horaSeleccionada){
    if (!reservasDia){
        return false;
    } 
    return reservasDia.includes(horaSeleccionada);
}

async function armarHorarios(reservasDia, diaSeleccionado, mesSeleccionado, anoSeleccionado){
    const { horarioapertura, horariocierre, id } = espacioSeleccionado;
    let contenidoHoras = document.getElementById('contenido_horas');
    
    const hora_actual = hoy.getHours();
    let contenidoTemporal = "<tr>";
    for (let hora = horarioapertura; hora < horariocierre; hora++){
        if (hora > hora_actual){
            if (horaEstaReservada(reservasDia, hora)){
                contenidoTemporal += "<td class='horasReservadas'>" + hora + "</td>";
            }
            else{
                contenidoTemporal += "<td class='horasDisponibles' onclick='reservar(" + diaSeleccionado + ", " + mesSeleccionado + ", " + anoSeleccionado + ", " + hora + ", " + id + ")'>" + hora + "</td>";
            }
        }
        else {
            contenidoTemporal += "<td class='horasAnteriores'>" + hora + "</td>";
        }
    }
    contenidoTemporal += "</tr>";
    contenidoHoras.innerHTML = contenidoTemporal;

}

function mostrarHorarios(diaSeleccionado, reservasDia, mesSeleccionado, anoSeleccionado, hora){
    let horarios = document.getElementById('cuadro_horarios');
    horarios.showModal();
    armarHorarios(reservasDia, diaSeleccionado, mesSeleccionado, anoSeleccionado, hora);
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

async function armarDiccionarioReservasMes(idEspacio, año, mes){
    const url = `http://localhost:3000/reservas/espacios/mes/${idEspacio}/${año}/${mes}`;
    try {
        const dataReservas = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
            }
        })
        const reservas = await dataReservas.json();
        let diccionarioHorarios = {};
        reservas.forEach(reserva => {
            if(!diccionarioHorarios[reserva.dia_reserva]){
                diccionarioHorarios[reserva.dia_reserva] = [];
            }
            diccionarioHorarios[reserva.dia_reserva].push(reserva.hora_reserva);
        });
        return diccionarioHorarios;
    }

    catch(err){
        console.log(err);
    }
}

async function encontrarEstadoDelDia(listaReservasDia, horaApertura, horaCierre) {
    if (!listaReservasDia) {
        return "disponible";
    }
    let estadoDelDia = "";
    const cantidadTurnosPosibles = horaCierre - horaApertura;
    const cantidadTurnosReservados = listaReservasDia.length;
    if (cantidadTurnosPosibles === cantidadTurnosReservados){
        estadoDelDia = "lleno";
    }
    else{
        estadoDelDia = "disponible";
    }
    return estadoDelDia;
}

async function armarCalendario(ano, mes, hora){
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

    const diasSemana = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"]; 
    let primerDiaSemanaAbierto = "";
    let ultimoDiaSemanaAbierto = "";

    let diasAbierto = (espacioSeleccionado.diasabierto).split("-");
    primerDiaSemanaAbierto = diasAbierto[0];
    ultimoDiaSemanaAbierto = diasAbierto[1];

    const diccionarioReservasMes = await armarDiccionarioReservasMes(espacioSeleccionado.id, ano, mes+1);

    let primerDiaSemanaAbiertoParaComparar = diasSemana.indexOf(primerDiaSemanaAbierto);
    let ultimoDiaSemanaAbiertoParaComparar = diasSemana.indexOf(ultimoDiaSemanaAbierto);

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
            let diaCelda = fechaCelda.getDay();
            if (diaCelda === 0){
                diaCelda = 7;
            }
            let estadoDelDia = await encontrarEstadoDelDia(diccionarioReservasMes[diaTemporal], espacioSeleccionado.horarioapertura, espacioSeleccionado.horariocierre);

            if ((fechaCelda < hoyParaComparar) ||(primerDiaSemanaAbiertoParaComparar + 1 > diaCelda || (ultimoDiaSemanaAbiertoParaComparar + 1 < diaCelda))){
                contenidoTemporal += "<td class='diasAnterioresOVacios'>" + diaTemporal + "</td>";
            }
            else if(estadoDelDia == "lleno"){
                contenidoTemporal += "<td class='diasLlenos'>" + diaTemporal + "</td>";  
            }
            else{
                let reservasString = JSON.stringify(diccionarioReservasMes[diaTemporal] || []);
                contenidoTemporal += `<td class='diasPosteriores' onclick='mostrarHorarios(${diaTemporal}, ${reservasString}, ${mes + 1}, ${ano})'>${diaTemporal}</td>`;
            }
            diaTemporal++;
        }
        console
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

    ubicacionCalendario.innerHTML = "<button onclick='armarCalendario(" + anoAnterior +", " + mesAnterior + ", " + hora + ", " + ")'>&#171</button> <div>" + meses[mes] + "/" + ano + "</div> <button class='botonDerecha' onclick='armarCalendario(" + proximoAno + ", " + proximoMes + ", " + hora + ", " + ")'>&#187</button>";

}

function mostrarCalendario(espacio){
    espacioSeleccionado = espacio;
    let calendario = document.getElementById('cuadro_calendario');
    calendario.showModal();
    armarCalendario(hoy.getFullYear(), hoy.getMonth(), hoy.getHours());
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



