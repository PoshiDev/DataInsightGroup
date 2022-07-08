// ---------------- Vue ------------------
let chamber = document.querySelector("#senate") ? "senate" : "house"
//data, created y method siempre
Vue.createApp({

  //todas nuestras propiedades van en el data
  data(){
    return {
      URLAPI : `https://api.propublica.org/congress/v1/113/${chamber}/members.json`,
      init : {
        method: "GET",          // es el metodo que trae mi api key, en este caso usamos metodologia GET
        headers: {                                  // headers es otro objeto, puede ser muchas cosas
            "X-API-Key": "3GjOOfNqEDk3cvccYbslK8csuFWvPiejbdXIebrK"     // el valor de mi headers es el api que que nos pasaron por mail
        }
        },
        members: []
    }
  },
  //siempre se ejecuta primero todo lo que esta dentro de created. 
  created(){
    fetch(this.URLAPI, this.init)
    .then(response => response.json())
    .then(data => {
      this.members = data.results[0].members
 } ) 
    },

  methods: {

  },




}).mount("#app")




// ----------- FETCH --------------------
/* API KEY = las empresas o paginas proporcionan sus datos a traves de las api key */
/* Feth = es quien fetch hace la peticion al api key */
/* Init = Es un objeto que tiene ciertas caracteristicas.Una de esas caracteristicas es el method (get, update, delete por ejemplo) Es  el inicializador, lo que necesita para poder resolver la respuesta*/

/* let URLAPI = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`
 */

/* let init = {
    method: "GET",          // es el metodo que trae mi api key, en este caso usamos metodologia GET
    headers: {                                  // headers es otro objeto, puede ser muchas cosas
        "X-API-Key": "3GjOOfNqEDk3cvccYbslK8csuFWvPiejbdXIebrK"     // el valor de mi headers es el api que que nos pasaron por mail
    }
} */

/* fetch(URLAPI, init)
    .then(response => response.json())
    .then(data => {
        let members = data.results[0].members
        cargarTodo (members)
      })
.catch(error => console.log(error.message)) */
//
//
function cargarTodo (members) {
// -------------TABLA --------------
let bodyHtml = document.querySelector("body")

if(bodyHtml.classList.contains("bodyCongress")){

let infoTabla = document.querySelector("#bodyTable")

const tableData = (tablaConData) => {  
    infoTabla.innerHTML = ""
    tablaConData.forEach ((member) => {          
        let filaInfo = document.createElement("tr")           
            filaInfo.innerHTML = `                            
                <td> <a href="${member.url}">  ${member.first_name} ${
                    member.middle_name ? member.middle_name : ""} 
                    ${member.last_name}</td>
                <td>${member.party}</td>
                <td>${member.state}</td>
                <td>${member.seniority}</td>
                <td>${member.votes_with_party_pct} %</td>
            `
        infoTabla.appendChild(filaInfo)    
    })                                                                                                     
}
infoTabla ?  tableData(members) : ""


// ----------------- ESTADOS FILTRADOS ORDENADOS ALFABETICAMENTE --------------------
const estadosOrdenadosF = (datos) => {
    let estadoFiltro = [];     
    console.log(datos)     // variable que va a guardar mis estados sin repetir
    datos.forEach ( estado => { 

        if(!estadoFiltro.includes(estado.state)){       //SI estados filtro no se incluye el estado  (estado.state es cada estado)
            estadoFiltro.push(estado.state)         // lo va a pushear
        };
    });
    return estadoFiltro.sort();
};
/* estadosOrdenadosF(data); */


// ---------------------- OPTIONS DE ESTADOS ADENTRO DEL SELECT -----------------
const formulario = document.querySelector("form");
const select = document.querySelector("select");



function dibujarOpciones (estados2){
    estados2.forEach(estado2 => { 
        let nuevoOption = document.createElement("option")  // por cada vuelta del for each me genere un option
        nuevoOption.innerHTML = estado2     //le digo que por cada opcion que genere le digo que me ponga un estado
        nuevoOption.value = estado2
        select.appendChild(nuevoOption)
    })
}
dibujarOpciones(estadosOrdenadosF(members))

// -------------------- FILTRO CHECKBOXES POR PARTIDO -------------------

function estadosYPartidos () {

    let checkboxes = document.querySelectorAll("input[type='checkbox']") // X       // llamo a mi input checkboxes, 
    let check = Array.from(checkboxes) // X                                         //Array.from me hizo UN array de mis input ( para poder filtrarlo necesito que sea un array) antes era un nodeList
    let filtroCheck = check.filter(elemento => elemento.checked )   // X                    // filtro los que estan checkeados
    let partidos = filtroCheck.map(checkboxSeleccionados => checkboxSeleccionados.value )//X       // hice un nuevo array pero solo con la info de el valor de mi input, el resto de info no me sirve
    let arrayData = members //X

    let valoreSeleccionadosSelect = select.value;   // X                // una variable que solamente tiene los valores de mis option( el select adopta el valor de los hijos seleccionados)
    

    partidos.length == 0 ? partidos.push("") : ""                         // le digo que si mi array con valores tiene un largo igual a 0, le pushee la palabra all para que me traiga a todos
    
    const filtroEstado = () =>{
        let auxiliar = []
        let estados = estadosOrdenadosF(members)
        estados.forEach( estado =>{
            if (estado == valoreSeleccionadosSelect){
                auxiliar = arrayData.filter( elemento1 => elemento1.state == estado)
            } 
            else if(valoreSeleccionadosSelect == "all"){
                auxiliar = arrayData
            }
        }) 
        return auxiliar
    }
    
    let lista1 = filtroEstado() //X

    const filtroMiembros = (auxiliar) => {                    // filtro los miembros de los partidos
        let auxiliar2 = []
        auxiliar.forEach(miembro =>          // en esa localizacion, me busque a los miembros
            partidos.forEach(check =>                       // en mis miembros, le digo que me los busque por partido
                miembro.party == check ? auxiliar2.push(miembro) : check == "" ? auxiliar2 = auxiliar : "" )) // si los partido de los miembros es igual al partido, le digo que le pushee el el miembro a mi auxiliar, luego pregnto si mi miembro es igual a nada, imprima la tabla entera de miembros
        console.log(auxiliar2)
        return auxiliar2       
            }  
    let lista2 = filtroMiembros(lista1)                                      // llamo a mi funcion para que se ejecute el filtro
    tableData(lista2)

}

formulario.addEventListener("change", estadosYPartidos)
} else {
// --------------------------------------------------------------------------------------------------
// TABLA SENATE AT GLANCE | attendance 



/* Filtro de miembro por partido */
function membersForParty (partido){  
    let auxiliarF = []
    members.forEach(politico => politico.party == partido && !auxiliarF.includes(politico) ? auxiliarF.push(politico) : "" ) 
                return auxiliarF.length
}
let sumaTotal = membersForParty("R") + membersForParty("D") + membersForParty("ID")


/* Total de votos por partido */
function pctParty (partido){
    let sumaPctParty = 0
    members.forEach(politico => {politico.party == partido ? sumaPctParty += politico.votes_with_party_pct : ""})
    return parseFloat(sumaPctParty)
}
let sumaPctPorPartido = pctParty("R") + pctParty("D") + pctParty("ID")

const divisionTotal = sumaPctPorPartido / sumaTotal

/* let sumaPctPorPartido2 = sumaPctPorPartido */
function divisor (sumaPct, cantidadMiembros){
    let resultado = sumaPct / cantidadMiembros
    if(cantidadMiembros === 0){
        return 0
    }else{return resultado  }
    
}
divisor(pctParty("D"), membersForParty("D"))


/* dibujo de tabla */
const tablaHouseAtAGlance = (tbodyHAG) => {     
    let tBodyHAAG = document.querySelector(`#${tbodyHAG}`)                  
            tBodyHAAG.innerHTML = `                              
            <tr>
            <td>Democrats</td>
            <td>${membersForParty("D")}</td>
            <td>${divisor(pctParty("D"), membersForParty("D")).toFixed(2)}%</td>
          </tr>
        
          <tr>
            <td>Republicans</td>
            <td>${membersForParty("R")}</td>
            <td>${divisor(pctParty("R"), membersForParty("R")).toFixed(2)}%</td>
          </tr>
        
          <tr>
            <td>Independents</td>
            <td>${membersForParty("ID")}</td>
            <td>${divisor(pctParty("ID"), membersForParty("ID")).toFixed(2)}%</td>
          </tr>
        
          <tr>
            <td>Total</td>
            <td>${sumaTotal}</td>
            <td>${divisionTotal.toFixed(2)}%</td>
          </tr>
            `
    }                                                                                                   
tablaHouseAtAGlance("tbodyHouseAtAGlance");                                                                                  
// -----------------------------------------------------------------------------------
//-------------------------ATTENDANCE--------------------------------------------
/* -- Least engaged --*/
let mayorAMenorAttendance = members.map(member => member ).sort((senador1, senador2) => {
    if (senador1.missed_votes_pct > senador2.missed_votes_pct){
      return -1
    }else if (senador1.missed_votes_pct < senador2.missed_votes_pct){
      return 1
    }else{ return 0}
    })
  console.log(mayorAMenorAttendance)
  
  /* 10% least engaged */
  const pctLeastEngaged = Math.round(mayorAMenorAttendance.length * 10 / 100)
  let leastEngaged = []
  for ( i = 0; i < pctLeastEngaged; i++ ){
    leastEngaged.push(mayorAMenorAttendance[i])
  }
  console.log(leastEngaged)
  
  /* 10% least engaged incluido */
  
  let pct= leastEngaged.length
  while(mayorAMenorAttendance[leastEngaged.length - 1].missed_votes_pct == mayorAMenorAttendance[pct].missed_votes_pct){
    leastEngaged.push(mayorAMenorAttendance[pct])
    pct++
  }
  console.log(leastEngaged)
  
  /* Most engaged*/
  const menorAMayorAttendance = members.map(member => member ).sort((senador1, senador2) => {
    if (senador1.missed_votes_pct < senador2.missed_votes_pct){
      return -1
    }if(senador1.missed_votes_pct > senador2.missed_votes_pct){
      return 1
    }else{ return 0}
    })
  
  
  /* 10% most engaged */
  const pctMostEngaged = Math.round(menorAMayorAttendance.length * 10 / 100)
  let mostEngaged = []
  for ( i = 0; i < pctMostEngaged; i++ ){
    mostEngaged.push(menorAMayorAttendance[i])
  }
  
  /* 10% most engaged incluido */
  
  let pct1= mostEngaged.length
  while(menorAMayorAttendance[mostEngaged.length - 1].missed_votes_pct == menorAMayorAttendance[pct1].missed_votes_pct){
    leastEngaged.push(menorAMayorAttendance[pct1])
    pct1++
  }
  console.log(mostEngaged)
  

  // Dibujo tablas Attendance 
  const bodyTablaAME = (bTA, idTablaA) => {     
    bTA.forEach((miembro) => {
      const tablaAME = document.querySelector(`#${idTablaA}`)
        let filaTB = document.createElement("tr")           
            filaTB.innerHTML = `                            
                <td> <a href="${miembro.url}"> ${miembro.first_name} ${
                  miembro.middle_name ? miembro.middle_name : ""} 
                    ${miembro.last_name}</td>
                <td>${miembro.missed_votes}</td>
                <td>${miembro.missed_votes_pct}%</td>
            `
        tablaAME.appendChild(filaTB)
      } )  
      }   
                                                                     
  
  
  
  // ------------------ Party Loyalty ---------------------
  // Least Loyal

  let mayorAMenorPartyLoyalty = members
  
  mayorAMenorPartyLoyalty = members.sort((x,y)=> x.votes_with_party_pct - y.votes_with_party_pct)
  
  /* 10% least engaged */
  const pctLeastLoyal = Math.round(mayorAMenorPartyLoyalty.length * 10 / 100)
  let leastLoyal = []
  for ( i = 0; i < pctLeastLoyal; i++ ){
    leastLoyal.push(mayorAMenorPartyLoyalty[i])
  }
  /* 10% least engaged incluido */
  
  
  let pct2= leastLoyal.length
  while(mayorAMenorPartyLoyalty[leastLoyal.length - 1].votes_with_party_pct == mayorAMenorPartyLoyalty[pct2].votes_with_party_pct){
    leastLoyal.push(mayorAMenorPartyLoyalty[pct1])
    pct2++
  }
  console.log(leastLoyal)
  
  /* Most engaged*/
  
  const menorAMayorPartyLoyalty = members.sort((x,y)=> y.votes_with_party_pct - x.votes_with_party_pct)
  /* 10% most engaged */
  /* 10% most engaged incluido */
  const pctMostLoyal = Math.round(menorAMayorPartyLoyalty.length * 10 / 100)
  let mostLoyal = []
  
  
  for ( i = 0; i < pctMostEngaged; i++ ){
    !mostLoyal.includes(menorAMayorPartyLoyalty[i])? mostLoyal.push(menorAMayorPartyLoyalty[i]) : ""
  
    menorAMayorPartyLoyalty.forEach(member => {
    if(member.votes_with_party_pct === [i].votes_with_party_pct && !mostLoyal.includes(member)){
      mostLoyal.push(member)}
    })
  }
  
  
// Dibujar tablas Party Loyalty
  const bodyTablaPLML = (bTA,idTablaPL) => {     
    bTA.forEach((miembro) => {
        const tablaPLML = document.querySelector(`#${idTablaPL}`)
        let filaTB = document.createElement("tr")           
            filaTB.innerHTML = `                            
                <td> <a href="${miembro.url}"> ${miembro.first_name} ${
                  miembro.middle_name ? miembro.middle_name : ""} 
                    ${miembro.last_name}</td>
                <td>${Math.round(miembro.total_votes / 100 * miembro.votes_with_party_pct)}</td>
                <td>${miembro.votes_with_party_pct}%</td>
            `
            tablaPLML.appendChild(filaTB)
      } )  
      }                                                                        
  
   
    if(bodyHtml.classList.contains("attendance") ){
      bodyTablaAME(mostEngaged, "bodyTableAttendanceMostEngaged")
      bodyTablaAME(leastEngaged, "bodyTableAttendanceLeastEngaged")
         
      }else {
        bodyTablaPLML(mostLoyal,"bodyTablePartyLoyaltyMostLoyal")
        bodyTablaPLML(leastLoyal,"tableBody1")
    
      }
}

}

