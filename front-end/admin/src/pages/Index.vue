<template>
  <q-page padding>
    <div class="row fondo1">
      <div class="col-xs-12 col-md-3 q-mx-md">
        <q-datetime color="yellow-7" v-model="f2" type="date" @change="cambiarF1"/>
      </div>
      <div class="col-xs-12 col-md-3 q-mx-md">
        <q-datetime color="yellow-7" v-model="f1" type="date" @change="cambiarF2"/>
      </div>
    </div>
    
    
    <div class="row q-mt-lg fondo1 q-pa-md">
      <div class="col-xs-12 col-md-12">
        <p>Vendido</p>
        <linea :chart-data="totales" :options="scale"/>
      </div>
    </div>
    <div class="row q-mt-lg fondo1 q-pa-md">
      <div class="col-xs-12 col-md-7  round-borders">
        <p>Top 10 clientes</p>
        <bar :chart-data="compradores" :options="scaleCompradores"/>
      </div>
      <div class="col-xs-12 col-md-5  round-borders">
        <p>Top 10 de producto mas vendidos</p>
        <torta :chart-data="vendidos" :options="scaleProducto"/>
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
      infoCompradores: [],
      infoProductos: [],
      infoVenta:[],
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
        },
        onClick: event => {
          this.rVenta();
        }
      },
      scaleProducto: {
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
        },
        onClick: event => {
          this.rProductos()
        }
      },
      scaleCompradores: {
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
        },
        onClick: event => {
          this.rCompradores()
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
        this.infoProductos = JSON.parse(JSON.stringify(result.datos))
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

        let pedidos = []

        for (let i = 0; i < result.datos.length; i++) {
          for (let j = 0; j < result.datos.length; j++) {
            if(result.datos[i].usuario.id == result.datos[j].usuario.id && result.datos[i].id == result.datos[j].id){
              
              let ok = false
              pedidos.forEach(element => {
                if(element.usuario.id == result.datos[j].usuario.id){
                  element.pedidos.push(result.datos[j].id)
                  element.cantidad = parseInt(element.cantidad) + 1
                  ok = true
                }
              })
              if(ok == false){
                pedidos.push({
                  pedidos: [result.datos[j].id],
                  cantidad: 1,
                  usuario: result.datos[j].usuario
                })
              }
            }
          }
        }

        this.infoCompradores = pedidos

        pedidos.forEach(item => {
          doc.labels.push(item.usuario.nombre)
          doc.datasets[0].data.push(item.cantidad)
        })
        
        this.compradores = doc
        
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

       let tDoc = []

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
            tDoc.push({
              mes: mes,
              total: parseFloat(item.total)
            })
          } else{
            tDoc[pos].total = parseFloat(doc.datasets[0].data[pos]) + parseFloat(item.total)
            doc.datasets[0].data[pos] = parseFloat(doc.datasets[0].data[pos]) + parseFloat(item.total)
          }

         
        })
        this.infoVenta = tDoc
        this.totales = doc
      },e => {

      },'pedido/total')
    },
    rVenta(){
      this.$q.localStorage.set('infoVenta', JSON.parse(JSON.stringify(this.infoVenta)))
      this.$router.push('/app/reporte/venta')
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
    },
    rCompradores(){
      let ids = []
      this.infoCompradores.forEach(element => {
        let id = element.pedidos.map(num => {
          return num
        })
        ids = ids.concat(id)
      })
      http({ids: ids}, result => {
        this.$q.localStorage.set('infoComprador', result)
        this.$router.push('/app/reporte/comprador')
      }, e => {
        this.$q.notify(e)
      }, 'pedido/reporte/comprador')
    },
    rProductos(){
      this.$q.localStorage.set('infoProductos', JSON.parse(JSON.stringify(this.infoProductos)))
      this.$router.push('/app/reporte/producto')
    }
  }
}
</script>
