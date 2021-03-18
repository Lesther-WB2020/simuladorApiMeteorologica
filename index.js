document.getElementById('dataSolicitud').addEventListener('submit', async (event)=>{
    event.preventDefault(); //para evitar 'enviar' el formulario al momento de precionar button submit.
    
    //obtengo la fecha seleccionada por el usuasrio
    var fechaSeleccionada = new Date(document.getElementById('datePicker').value); 
    var fsDia = fechaSeleccionada.getDate();
        if(fsDia!=31){
            fsDia+=1;
        }
    var fsMes = fechaSeleccionada.getMonth()+1;
    var fsAnio = fechaSeleccionada.getFullYear();
    var fs = fsDia+ '-'+fsMes+'-'+fsAnio;
    console.log(fs);
        //obtengo la fecha de hoy para validar si debo mostrar temperatura de la mañana o de la mañana,tarde,noche
        var fechaOrdenador = new Date();
        var myDia = fechaOrdenador.getDate();    
        var myMes = fechaOrdenador.getMonth()+1;
        var myAnio = fechaOrdenador.getFullYear();
        console.log(myDia + '-'+myMes+'-'+myAnio)
            var esHoy = false;
                if((fsDia == myDia)&&(fsMes==myMes)&&(fsAnio==myAnio)){
                    esHoy=true;
                }
                    //limpio los posibles datos anteriores.
                    titulo = document.getElementById('headerUno');
                    data = document.getElementById('dataTiempo');
                    titulo.innerHTML = '';
                    data.innerHTML = '';

                    //variables que mostraran la informacion
                    var infoClimaManiana;
                    var infoTemperaturaManiana;
                    var infoClimaTarde;
                    var infoTemperaturaTarde;
                    var infoClimaNoche;
                    var infoTemperaturaNoche;

                        //MUESTRO ESTE SMS EN LO QUE 'OBTENO LA INFORMACION'
                        titulo.innerHTML = 'OBTENIENDO INFORMACIÓN...';
                           
                            //TAMBIÉN OBTENGO LA TEMPERATURA DE LA MAÑANA
                            await getTemperatura().then(resultado => infoTemperaturaManiana = resultado)
                            .catch(err => infoTemperaturaManiana = err);
                            //CON BASE A LA TEMPERATURA, OBTENGO EL CLIMA, ESPERO UN MILISEGUNDO
                            //DE MODO QUE SE PUEDA OBTENER LA TEMPERATURA ANTES DE ENVIARLA
                                getClima(infoTemperaturaManiana).then(resultado => infoClimaManiana = resultado)
                                .catch(err =>infoClimaManiana = err);
                            
                            if(esHoy==true){ //si es = true
                                //obtengo datos de tarde y noche también
                                await getTemperatura().then(resultado => infoTemperaturaTarde = resultado)
                                .catch(err => infoTemperaturaTarde = err);
                                await getTemperatura().then(resultado => infoTemperaturaNoche = resultado)
                                .catch(err => infoTemperaturaNoche = err);
                                    
                                    getClima(infoTemperaturaTarde).then(resultado => infoClimaTarde = resultado)
                                    .catch(err =>infoClimaTarde = err);
                                    getClima(infoTemperaturaNoche).then(resultado => infoClimaNoche = resultado)
                                    .catch(err =>infoClimaNoche = err);
                            }
                                // ahora simulo la espera de la consulta
                                var unidad = 'TEMPERATURA DE ';
                                setTimeout(() => {
                                titulo.innerHTML = 'PRONÓSTICO DEL TIEMPO PARA EL ' + fs;
                                if(esHoy==true){
                                    data.innerHTML = 
                                    '<strong>DURANTE LA MAÑANA: </strong>' + infoClimaManiana +unidad+ infoTemperaturaManiana +' °C'+'<br>'+
                                    '<strong>DURANTE LA TARDE: </strong> ' + infoClimaTarde   +unidad+ infoTemperaturaTarde   +' °C'+'<br>'+
                                    '<strong>DURANTE LA NOCHE: </strong> ' + infoClimaNoche   +unidad+ infoTemperaturaNoche   +' °C'+'<br>';
                                }else{
                                    data.innerHTML = 
                                    '<strong>DURANTE LA MAÑANA: </strong>' + infoClimaManiana + unidad + infoTemperaturaManiana +' °C'+'<br>';
                                }
                                }, 1500); 
})

function getClima(infoTemperatura){
    return new Promise((resolve,reject)=>{
            if(infoTemperatura>24){
                resolve('CLIMA DESPEJADO, ');
            }else if((infoTemperatura>18)&&(infoTemperatura<=24)){
                resolve('CLIMA NUBLADO, ');
            }else if(infoTemperatura<=18){
                resolve('CLIMA LLUVIOSO, ');
            }else{
                reject(Error('ERROR AL "OBTENER" EL CLIMA'));
            }           
    })
}
function getTemperatura(){
    return new Promise((resolve,reject)=>{
        let temperatura = randomConIntervalo(5,30);
            if(temperatura != 0){
                resolve(temperatura);
            }else{
                reject(Error('ERROR AL "OBTENER" LA TEMPERATURA'));
            }
    })
}
function randomConIntervalo(minimo,maximo){
    return Math.floor(Math.random() * ((maximo+1) - minimo) + minimo);
}