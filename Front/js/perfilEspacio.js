const idUsuario = localStorage.getItem('usuarioId');
let espacioSeleccionado = null;


document.addEventListener("DOMContentLoaded", async function(){
    const url = `http://localhost:3000/espacios/usuarios/idUsuario/${idUsuario}`;
    crearCartasEspacios(url);
})

async function crearCartasEspacios(url){
    const container = document.getElementById("marco_espacios");
    container.innerHTML = "";
    
    try{
        const espacios = await fetch(url);    
        const espaciosJson = await espacios.json();
        espaciosJson.forEach(espacio =>{

            const carta = document.createElement("div");
            carta.className = "cartaEspacio";
        
            const fotoespacio = document.createElement("img");
            fotoespacio.src = espacio.linkfotoespacio;
            if (!espacio.linkfotoespacio){
                fotoespacio.src = "https://cdn-icons-png.flaticon.com/512/13163/13163762.png";
            }
            fotoespacio.className = "fotoEspacio";
    
            const nombre = document.createElement("h3");
            nombre.textContent = espacio.nombre;

            const barrio = document.createElement("p");
            barrio.textContent = espacio.ubicacion;

            const precio = document.createElement("p");
            precio.textContent = `$${espacio.precioporhora}/h`;

            const diasAbierto = document.createElement("p");
            diasAbierto.textContent = espacio.diasabierto;
            
            const divDiasYPrecio = document.createElement("div");
            divDiasYPrecio.classList.add("divDiasPrecioEspacio");


            const contacto = document.createElement("p");
            contacto.textContent = espacio.contacto;

            const descripcion = document.createElement("p");
            descripcion.innerText = espacio.descripcion;

            const tamaño = document.createElement("p");
            tamaño.innerText = espacio.tamaño;
            
            const contenedorBotonesCarta = document.createElement('div');
            contenedorBotonesCarta.className = "contenedorBotonesCarta";
            
            const botonReserva = document.createElement('button');
            botonReserva.textContent = "Reservar";
            botonReserva.className = "botonReservar";
            botonReserva.id = "botonReservar";
            botonReserva.addEventListener('click', function(){
                mostrarCalendario(espacio);
            });
            
            carta.appendChild(fotoespacio);
            carta.appendChild(nombre);
            carta.appendChild(descripcion);
            carta.appendChild(barrio);
            divDiasYPrecio.appendChild(diasAbierto);
            divDiasYPrecio.appendChild(precio);
            carta.appendChild(divDiasYPrecio);
            carta.appendChild(contacto);
            carta.appendChild(tamaño);
            carta.appendChild(botonReserva);
            
            const botonFavorito = document.createElement('button');
            if (!espacio.es_favorito){
                botonFavorito.className = "botonAgregarFavorito";
                botonFavorito.textContent = "Agregar a favoritos";
                botonFavorito.onclick = async () => {
                    await agregarEspacioFavorito(espacio.id);
                };
            }
            if (espacio.es_favorito){
                botonFavorito.className = "botonSacarFavorito";
                botonFavorito.textContent = "Sacar de favoritos";
                botonFavorito.onclick = async () => {
                    await sacarEspacioFavorito(espacio.id);
                };
                carta.className = "cartaEspacioFavorito";
            }
            
            carta.appendChild(botonFavorito);
            contenedorBotonesCarta.appendChild(botonReserva);
            contenedorBotonesCarta.appendChild(botonFavorito);
            contenedorBotonesCarta.appendChild(botonFavorito);
            carta.appendChild(contenedorBotonesCarta);
            container.appendChild(carta);

        })

    }
    catch(err){
        console.log(err);
    }
}

async function agregarEspacioFavorito(idEspacio){
    try{
        await fetch("http://localhost:3000/espacios/favoritos", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario: idUsuario,
                id_espacio: idEspacio,
            })
        });
        window.location.reload()
    }
    catch(err){
        console.log(err);
    }
}

async function sacarEspacioFavorito(idEspacio){
    try{
        await fetch(`http://localhost:3000/espacios/favoritos/${idEspacio}/${idUsuario}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        window.location.reload()
    }
    catch(err){
        console.log(err);
    }
}

async function reservar(diaSeleccionado,  mesSeleccionado, anoSeleccionado, horaSeleccionada, idEspacio){

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

function armarHorarios(reservasDia, diaSeleccionado, mesSeleccionado, anoSeleccionado){
    let { horarioapertura, horariocierre, id } = espacioSeleccionado;
    let contenidoHoras = document.getElementById('contenido_horas');
    
    const FechaSeleccionadaParaComparar = (new Date(anoSeleccionado, mesSeleccionado - 1, diaSeleccionado)).getTime();
    const hoyParaComparar = (new Date()).setHours(0,0,0,0);

    let pasaDeDia = false;
    if (horarioapertura > horariocierre){
        pasaDeDia = true;
    }

    const hora_actual = (new Date()).getHours();
    let contenidoTemporal = "<tr>";
    if (!pasaDeDia){
        for (let hora = horarioapertura; hora < horariocierre; hora++){
            if (((hora > hora_actual) && (FechaSeleccionadaParaComparar === hoyParaComparar)) || (FechaSeleccionadaParaComparar > hoyParaComparar)){
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
    }
    else {
        for (let hora = 1; hora < horariocierre; hora++){
            if (((hora > hora_actual) && (FechaSeleccionadaParaComparar === hoyParaComparar)) || (FechaSeleccionadaParaComparar > hoyParaComparar)){
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
        for (let hora = horarioapertura; hora < 25; hora++){
            if (((hora > hora_actual) && (FechaSeleccionadaParaComparar === hoyParaComparar)) || (FechaSeleccionadaParaComparar > hoyParaComparar)){
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
    }
    contenidoTemporal += "</tr>";
    contenidoHoras.innerHTML = contenidoTemporal;

}

function mostrarHorarios(diaSeleccionado, reservasDia, mesSeleccionado, anoSeleccionado){
    let horarios = document.getElementById('cuadro_horarios');
    horarios.showModal();
    armarHorarios(reservasDia, diaSeleccionado, mesSeleccionado, anoSeleccionado);
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

function encontrarEstadoDelDia(listaReservasDia, horaApertura, horaCierre, hora, esHoy){
    if (!esHoy && !listaReservasDia){
        return "disponible";
    }
    let estadoDelDia = "";

    let cantidadTurnosPosibles = horaCierre - horaApertura;
    if (cantidadTurnosPosibles < 0){
        cantidadTurnosPosibles += 24;
    }
    let horasPasadas = 0;
    if (esHoy){
        horasPasadas += (hora + 1 - horaApertura);
    }
    
    if (horaCierre < horaApertura){
        horaCierre = 24;
    }

    if (esHoy && (hora >= horaCierre - 1)){
        estadoDelDia = "pasado";
    }
    else if (listaReservasDia && (cantidadTurnosPosibles - horasPasadas <= listaReservasDia.length)){
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
        if ((i % 7) === 1 ){
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
            let estadoDelDia = ""
            if (hoyParaComparar === (new Date(ano, mes, diaTemporal)).setHours(0,0,0,0)){
                estadoDelDia = encontrarEstadoDelDia(diccionarioReservasMes[diaTemporal], espacioSeleccionado.horarioapertura, espacioSeleccionado.horariocierre, hora, true);
            }
            else{
                estadoDelDia = encontrarEstadoDelDia(diccionarioReservasMes[diaTemporal], espacioSeleccionado.horarioapertura, espacioSeleccionado.horariocierre, hora, false);    
            }

            let estaAbierto = false;

            if (primerDiaSemanaAbiertoParaComparar <= ultimoDiaSemanaAbiertoParaComparar) {
                if (diaCelda >= primerDiaSemanaAbiertoParaComparar +1 && diaCelda <= ultimoDiaSemanaAbiertoParaComparar +1 ) {
                    estaAbierto = true;
                }
            } else {
                if (diaCelda >= primerDiaSemanaAbiertoParaComparar +1  || diaCelda <= ultimoDiaSemanaAbiertoParaComparar +1 ) {
                    estaAbierto = true;
                }
            }
            if ((fechaCelda.getTime() < hoyParaComparar) || !estaAbierto || estadoDelDia === "pasado") {
                contenidoTemporal += "<td class='diasAnterioresOVacios'>" + diaTemporal + "</td>";
            }
            else if(estadoDelDia === "lleno"){
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

    ubicacionCalendario.innerHTML = "<button onclick='armarCalendario(" + anoAnterior +", " + mesAnterior + ", " + hora + ")'>&#171</button> <div>" + meses[mes] + "/" + ano + "</div> <button class='botonDerecha' onclick='armarCalendario(" + proximoAno + ", " + proximoMes + ", " + hora + ", " + ")'>&#187</button>";

}

function mostrarCalendario(espacio){
    let hoy = new Date();
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

async function eliminarReserva(idReserva, expiro){
    try{
        url = `http://localhost:3000/reservas/${idReserva}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json",
            }
        })
        if(response.ok) {
            await armarMisReservas(); 
        }
    }
    catch(error){
        console.log(error);
    }
}

async function armarMisReservas(){
    contenidoTablaReservas = document.getElementById('contenidoMisReservas');
    try{
        const url = `http://localhost:3000/reservas/usuarios/${idUsuario}`;
        const dataReservas = await fetch(url);
        const reservas = await dataReservas.json();
        let contenidoFinal = ``;
        const hoy = new Date()
        reservas.forEach(reserva => {
            const diaYHoraReserva = (new Date(reserva.año_reserva, reserva.mes_reserva - 1, reserva.dia_reserva));
            diaYHoraReserva.setHours(reserva.hora_reserva,0,0,0);
            if (diaYHoraReserva.getTime() < hoy.getTime()){
                eliminarReserva(reserva.id, true);
            }
            else{
                contenidoTabla = '';
                contenidoTabla += `<tr><td>${reserva.hora_reserva}</td><td>${reserva.dia_reserva}/${reserva.mes_reserva}/${reserva.año_reserva}</td><td>${reserva.nombre}</td><td>${reserva.precioporhora}</td><td>${reserva.id}</td><td><button onclick="eliminarReserva(${reserva.id}, false)">Cancelar</button></td>`;
                if(reserva.reserva_confirmada){
                    contenidoTabla += '<td class="reservaConfirmada">CONFIRMADA</td></tr>'
                }
                else if(!reserva.reserva_confirmada){
                    contenidoTabla += '<td class="reservaPendiente">PENDIENTE</td></tr>'
                }
                contenidoFinal += contenidoTabla;
            }
        })
        contenidoTablaReservas.innerHTML = contenidoFinal;
    }
    catch(error){
        console.log(error);
    }
}

function mostrarReservas(){
    const tablaMisReservas = document.getElementById("cuadroMisReservasId");
    armarMisReservas();
    tablaMisReservas.showModal();
}

function cerrarReservas(){
    const tablaMisReservas = document.getElementById("cuadroMisReservasId");
    tablaMisReservas.close();
}

function mostrarFiltro(){
    const filtroEspacio = document.getElementById("filtroEspaciosId");
    filtroEspacio.showModal();
}

function cerrarFiltro(){
    const filtroEspacio = document.getElementById("filtroEspaciosId");
    filtroEspacio.close();
}

function aplicarFiltroEspacios(event){
    event.preventDefault();
    try{
        const ubicacion = document.getElementById('ubicacion').value;
        const precioPorHora = document.getElementById('precioPorHora').value;
        const horaElegida = document.getElementById('horaAbierto').value;
        const espaciosFavoritos = document.getElementById('soloEspaciosFavoritos').checked;
        let url = `http://localhost:3000/espacios/filtros?ubicacion=${ubicacion}&precioPorHora=${precioPorHora}&hora=${horaElegida}&idUsuario=${idUsuario}&espaciosFavoritos=${espaciosFavoritos}`;
    
        crearCartasEspacios(url);
    }
    catch (error){
        console.log(error);
    }
    event.target.reset();
    cerrarFiltro();
}
