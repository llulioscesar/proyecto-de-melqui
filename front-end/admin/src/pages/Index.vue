<template>
  <q-page padding>
    <div class="row">
      <div class="col-xs-12 col-md-3 q-mx-md">
        <q-datetime v-model="f2" type="date" @change="cambiarF1"/>
      </div>
      <div class="col-xs-12 col-md-3 q-mx-md">
        <q-datetime v-model="f1" type="date" @change="cambiarF2"/>
      </div>
    </div>
    
    
    <div class="row q-mt-lg">
      <div class="col-xs-12 col-md-12">
        <p>Vendido</p>
        <linea :chart-data="totales" :options="scale"/>
      </div>
    </div>
    <div class="row q-mt-lg">
      <div class="col-xs-12 col-md-7  round-borders">
        <p>Top 10 clientes</p>
        <bar :chart-data="compradores" :options="scale"/>
      </div>
      <div class="col-xs-12 col-md-5  round-borders">
        <p>Top 10 de producto mas vendidos</p>
        <torta :chart-data="vendidos" :options="{responsive: true, maintainAspectRatio: false}"/>
      </div>
    </div>
    
  </q-page>
</template>

<style>
</style>

<script>
import http from 'src/funciones/http'
import Bar from 'src/funciones/bar'
import Torta from 'src/funciones/torta'
import Linea from 'src/funciones/linea'
export default {
  name: 'PageIndex',
  components: {
    Linea,
    Bar,
    Torta
  },
  data(){
    return{
      f1:null,
      f2: null,
      fecha1: 0,
      fecha2: 0,
      vendidos: {
        labels: [],
        datasets: [
          {
            data: []
          }
        ]
      },
      compradores:{
        labels: [],
        datasets: [
          {
            data: []
          }
        ]
      },
      scale: {
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          yAxes: [
          {
            ticks: {
              suggestedMin: 0,
              beginAtZero: true
              }
            }
          ]
        }
      },
      colores: ['#e53935', '#3949ab','#00897b','#fdd835','#fb8c00','#039be5', '#8e24aa', '#d81b60', '#5e35b1'],
      totales:{
        labels: [],
        datasets: [
          {
            data: []
          }
        ]
      }
    }
  },
  mounted(){
    let fecha1 = this.$moment().startOf('day')
    let fecha2 = this.$moment(fecha1).subtract('day', 30)
    this.f2 = fecha2.toDate()
    this.f1 = fecha1.toDate()

    this.fecha2 = fecha2.unix()
    this.fecha1 = fecha1.unix()
    this.masVendido()
    this.masComprador()
    this.total()
  },
  methods:{
    masVendido(){
      http({fecha1: this.fecha2, fecha2: this.fecha1}, result => {
        let doc = {
          labels: [],
          datasets: [
            {
              backgroundColor: this.colores,
              data: []
            }
          ]
        }
        result.datos.forEach(item => {
          doc.labels.push(item.producto.nombre)
          doc.datasets[0].data.push(item.cantidad)
        })

        this.vendidos = doc
        
      }, e => {
        this.$q.notify(e)
      }, 'detalle/masVendido')
    },
    masComprador(){
      http({fecha1: this.fecha2, fecha2: this.fecha1}, result => {
        let doc = {
          labels: [],
          datasets: [
            {
              label: 'Clientes',
              backgroundColor: this.colores,
              data: []
            }
          ]
        }
        result.datos.forEach(item => {
          doc.labels.push(item.usuario.nombre)
          doc.datasets[0].data.push(item.cantidad)
        })
        this.compradores =doc
        
      }, e => {

      }, 'pedido/masComprador')
    },
    total(){
      http({fecha1: this.fecha2, fecha2: this.fecha1}, result => {
        let doc = {
          labels: [],
          datasets: [
            {
              label: 'MESES',
              backgroundColor: '#039be5',
              data: []
            }
          ]
        }
        result.datos.forEach(item => {
          let mes = this.$moment.unix(item.fecha).format('MMMM')
          let m = doc.labels
          let ok = false
          let pos = 0
          doc.labels.forEach(element => {
            if(element == mes){
              ok = true
              return
            }
            pos++
          })

          if(ok == false){
            doc.labels.push(mes)
            doc.datasets[0].data.push(parseFloat(item.total))
          } else{
            doc.datasets[0].data[pos] = parseFloat(doc.datasets[0].data[pos]) + parseFloat(item.total)
          }

         
        })
        console.log(result.datos)
        this.totales = doc
      },e => {

      },'pedido/total')
    },
    cambiarF1(date){
      this.fecha2 = this.$moment(date).startOf('day').unix()
      this.masVendido()
      this.masComprador()
      this.total()
    },
    cambiarF2(date){
      this.fecha1 = this.$moment(date).startOf('day').unix()
      this.masVendido()
      this.masComprador()
      this.total()
    }
  }
}
</script>
