// ---------------- Vue ------------------
let chamber = document.querySelector("#senate") ? "senate" : "house"
//data, created y method siempre
Vue.createApp({

    //todas nuestras propiedades van en el data
    data() {

        return {
            URLAPI: `https://api.propublica.org/congress/v1/113/${chamber}/members.json`,
            init: {
                method: "GET",
                headers: {
                    "X-API-Key": "3GjOOfNqEDk3cvccYbslK8csuFWvPiejbdXIebrK"
                }
            },
            members: [],        //array de data results
            seleccionDeEstados: "all", //valor de select
            valorCheckbox: [],          //donde se guarda el valor del checjbox seleccionado
            arrayData: [],             // array que voy a tener para no modificar mi array members
            auxiliarPartidos: [],
            democrats: 0,
            republicans: 0,
            independents: 0,
            sumaTotal: 0,
            pctDemocrats: 0,
            pctRepublicans: 0,
            pctIndependents: 0,
            sumaPctPorPartido: 0,
            divisionTotal: 0,
            divisorD: 0,
            divisorR: 0,
            divisorID: 0,
            leastEngaged: [],
            mostEngaged: [],
            leastLoyal: [],
            mostLoyal: [],




        }
    },
    //siempre se ejecuta primero todo lo que esta dentro de created. 
    created() {

        fetch(this.URLAPI, this.init)
            .then(response => response.json())
            .then(data => {
                this.members = data.results[0].members
                this.arrayData = data.results[0].members
                this.lista1 = data.results[0].members
                this.auxiliarPartidos = data.results[0].members
                this.democrats = this.membersForParty("D")
                this.republicans = this.membersForParty("R")
                this.independents = this.membersForParty("ID")
                this.sumaTotal = this.membersForParty("R") + this.membersForParty("D") + this.membersForParty("ID")
                this.pctDemocrats = this.pctParty("D")
                this.pctRepublicans = this.pctParty("R")
                this.pctIndependents = this.pctParty("ID")
                this.sumaPctPorPartido = this.pctParty("R") + this.pctParty("D") + this.pctParty("ID")
                this.divisionTotal = this.sumaPctPorPartido / this.sumaTotal
                this.divisorD = this.divisor(this.pctParty("D"), this.membersForParty("D"))
                this.divisorR = this.divisor(this.pctParty("R"), this.membersForParty("R"))
                this.divisorID = this.divisor(this.pctParty("ID"), this.membersForParty("ID"))
                this.leastEngaged = this.leastEngagedF()
                this.mostEngaged = this.mostEngagedF()
                this.leastLoyal = this.leastLoyalF()
                this.mostLoyal = this.mostLoyalF()


            })
    },



    // aca guardo mis funciones que esperan a ser llamadas con un click, change o submit (addEventListener)
    methods: {

        estadosOrdenados() {
            let estadoFiltro = [];
            this.members.forEach(miembro => {
                if (!estadoFiltro.includes(miembro.state)) {
                    estadoFiltro.push(miembro.state)
                }
            })
            return estadoFiltro.sort();
        },


        filtroGeneral() {
            console.log("filtroGeneral")
            if (this.valorCheckbox.length != 0) {
                console.log("pepito")
                if (this.valorCheckbox.length != 0 && this.seleccionDeEstados == "all") {
                    let auxiliar1 = []
                    this.members.forEach(miembro =>
                        this.valorCheckbox.forEach(check =>
                            miembro.party == check ? auxiliar1.push(miembro) : check == "all" ? auxiliar1 = this.members : ""))
                    this.auxiliarPartidos = auxiliar1
                } else if (this.valorCheckbox.length != 0 && this.seleccionDeEstados != "all") {
                    let auxiliarEstado = []
                    let auxiliar1 = []
                    this.members.forEach(miembro =>
                        this.valorCheckbox.forEach(check =>
                            miembro.party == check ? auxiliar1.push(miembro) : check == "all" ? auxiliar1 = this.members : ""))
                    auxiliarEstado = auxiliar1.filter(estado => estado.state == this.seleccionDeEstados)
                    this.auxiliarPartidos = auxiliarEstado
                }
            } else if (this.valorCheckbox.length == 0 && this.seleccionDeEstados != "all") {
                let auxiliarEstado = []
                auxiliarEstado = this.arrayData.filter(estado => estado.state == this.seleccionDeEstados)
                this.auxiliarPartidos = auxiliarEstado
            } else if (this.valorCheckbox.length == 0) {
                this.auxiliarPartidos = this.members
            }
        },

        membersForParty(partido) {
            let auxiliarF = []
            this.members.forEach(politico => politico.party == partido && !auxiliarF.includes(politico) ? auxiliarF.push(politico) : "")
            return auxiliarF.length
        },


        pctParty(partido) {
            let sumaPctParty = 0
            this.members.forEach(politico => { politico.party == partido ? sumaPctParty += politico.votes_with_party_pct : "" })
            return parseFloat(sumaPctParty)
        },

        divisor(sumaPct, cantidadMiembros) {
            let resultado = sumaPct / cantidadMiembros
            if (cantidadMiembros === 0) {
                return 0
            } else { return resultado }

        },

        leastEngagedF() {
            let mayorAMenorAttendance = this.members.map(member => member).sort((senador1, senador2) => {
                if (senador1.missed_votes_pct > senador2.missed_votes_pct) {
                    return -1
                } else if (senador1.missed_votes_pct < senador2.missed_votes_pct) {
                    return 1
                } else { return 0 }
            })
            /* 10% least engaged */
            let pctLeastEngaged = Math.round(mayorAMenorAttendance.length * 10 / 100)
            let leastEngaged = []
            for (i = 0; i < pctLeastEngaged; i++) {
                leastEngaged.push(mayorAMenorAttendance[i])
            }
            /* 10% least engaged incluido */
            let pct = leastEngaged.length
            while (mayorAMenorAttendance[leastEngaged.length - 1].missed_votes_pct == mayorAMenorAttendance[pct].missed_votes_pct) {
                leastEngaged.push(mayorAMenorAttendance[pct])
                pct++
            }
            console.log(leastEngaged)
            return leastEngaged 
        },

        mostEngagedF(){

        let menorAMayorAttendance = this.members.map(member => member ).sort((senador1, senador2) => {
        if (senador1.missed_votes_pct < senador2.missed_votes_pct){
            return -1
        }if(senador1.missed_votes_pct > senador2.missed_votes_pct){
        return 1
        }else{ return 0}
        })
     /* 10% most engaged */
        let pctMostEngaged = Math.round(menorAMayorAttendance.length * 10 / 100)
            let mostEngaged = []
        for ( i = 0; i < pctMostEngaged; i++ ){
            mostEngaged.push(menorAMayorAttendance[i])
        }
        /* 10% most engaged incluido */
        let pct1= mostEngaged.length
        while(menorAMayorAttendance[mostEngaged.length - 1].missed_votes_pct == menorAMayorAttendance[pct1].missed_votes_pct){
            mostEngaged.push(menorAMayorAttendance[pct1])
            pct1++
        }
        return mostEngaged
    },

    leastLoyalF(){

  mayorAMenorPartyLoyalty = this.members.sort((x,y)=> x.votes_with_party_pct - y.votes_with_party_pct)
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
  return leastLoyal
},

  mostLoyalF(){
const menorAMayorPartyLoyalty = this.members.sort((x,y)=> y.votes_with_party_pct - x.votes_with_party_pct)
/* 10% most engaged incluido */
const pctMostLoyal = Math.round(menorAMayorPartyLoyalty.length * 10 / 100)
let mostLoyal = []
for ( i = 0; i < pctMostLoyal; i++ ){
  !mostLoyal.includes(menorAMayorPartyLoyalty[i])? mostLoyal.push(menorAMayorPartyLoyalty[i]) : ""
  menorAMayorPartyLoyalty.forEach(member => {
  if(member.votes_with_party_pct === [i].votes_with_party_pct && !mostLoyal.includes(member)){
    mostLoyal.push(member)}
  })
}
return mostLoyal
}


    },

    // esta todo el tiempo escuchando
    computed: {



    }

}).mount("#app")


