<template>
  <q-page padding>
    <p class="q-mx-md"><strong>Nuevo pedido:</strong> #{{id}} </p>
    <div class="row items-center">
      <div class="col-xs-12 col-md-3">
        <div class="q-ma-md">
          <strong>Fecha:</strong> <br>
          <span>{{$moment.unix(fecha).format('MMMM DD [de] YYYY')}}</span>
        </div>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-search  class="q-mx-md" v-model="buscarC" float-label="Cliente" placeholder="Buscar Cliente">
          <q-autocomplete @search="filtrarCliente" @selected="selectedCliente"/>
        </q-search>
      </div>
      <div class="col-xs-12 col-md-3">
        <div class="q-ma-md">
          <strong>Cedula:</strong> <br>
          <span v-if="cliente!=null">{{cliente.sublabel}}</span>
          <span v-else>########</span>
        </div>
      </div>
    </div>
    <div class="row q-mt-md">
      <q-btn-group>
        <q-btn :disabled="cliente==null || id!=0" color="primary" label="Guardar" @click="guardarPedido"/>
        <q-btn :disabled="id==0" color="primary" label="Eliminar" @click="eliminarPedido"/>
      </q-btn-group>
    </div>
    
  </q-page>
</template>

<script>
import http from 'src/funciones/http'
import {LocalStorage} from 'quasar'
export default {
  data(){
    return{
      buscarC: '',
      cliente: null,
      id: 0,
      fecha: 0,
      total: 0,
      detalle: []
    }
  },
  mounted(){
    let pedido = LocalStorage.get.item('pedido')
    if(pedido != null){
      pedido = JSON.parse(JSON.stringify(pedido))
      this.id = pedido.id
      this.fecha = pedido.fecha
      this.total = pedido.total
      this.cliente = pedido.cliente
      this.detalle = pedido.detalle
      this.buscarC = this.cliente.label
    } else{
      this.fecha = this.$moment().startOf('day').unix()
    }
  },
  methods:{
    filtrarCliente(term, done){
      http({buscar: term}, result => {
        let lista = result.datos.map(cliente => {
          return {
            label: cliente.nombre,
            sublabel: cliente.cedula,
            value: cliente.id
          }
        })
        done(lista)
      }, e => {
        this.$q.notify(e)
      }, 'usuario/buscar')
    },
    selectedCliente(cliente){
      this.cliente = cliente
      this.buscarC = cliente.label
    },
    guardarPedido(){
      if(this.cliente != null){
        let doc = {
          usuarioId: this.cliente.value,
          fecha: this.fecha,
          total: 0,
          pendiente: true
        }
        http(doc, result => {
          console.log(result)
          this.id = result.datos.id
          LocalStorage.set('pedido',{
            id: this.id,
            fecha: this.fecha,
            total: this.total,
            cliente: this.cliente,
            detalle: this.detalle
          })
        }, e => {
          this.$q.notify(e)
        }, 'pedido/insertar')
      }
    },
    eliminarPedido(){
      this.$q.dialog({
        title: 'Eliminar pedido',
        message: '¿Desea eliminar el pedido?',
        ok: 'Si',
        cancel: 'No'
      }).then(() => {
        http({id: this.id}, result => {
          this.reset()
          LocalStorage.remove('pedido')
        }, e => {
          this.$q.notify(e)
        }, 'pedido/eliminar')
      })
    },
    reset(){
      this.id = 0
      this.cliente = null
      this.fecha = this.$moment().startOf('day').unix()
      this.total = 0
      this.buscarC = ''
      this.detalle = []
    }
  }
}
</script>

<style>
</style>
