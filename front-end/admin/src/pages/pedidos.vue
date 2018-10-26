<template>
  <q-page padding>
    <div class="row items-center">
      <div class="col-xs-12 col-md-2 col-lg-2">
        <q-radio class="q-mx-md" v-model="filtrar" val="0"  label="Pendientes" @input="cargarFiltro"/>
      </div>
      <div class="col-xs-12 col-md-2 col-lg-2">
        <q-radio class="q-mx-md" v-model="filtrar" val="1"  label="Entregados" style="margin-left: 10px" @input="cargarFiltro"/>
      </div>
      <div class="col-xs-12 col-md-2 col-lg-2">
        <q-radio class="q-mx-md" v-model="filtrar" val="2"  label="Todos" style="margin-left: 10px" @input="cargarFiltro"/>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-datetime class="q-mx-md" stack-label="fecha inicial" v-model="f1" type="date" @change="cambiarF1"/>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-datetime class="q-mx-md" stack-label="fecha final" v-model="f2" type="date" @change="cambiarF2"/>
      </div> 
    </div>
    <q-table class="q-mt-xl" :data="pedidos" :columns="columnas" row-key="name">
          <q-tr slot="body" slot-scope="props" :props="props" :class="props.row.cancelado ? 'bg-red-1' : (props.row.listarPendiente? 'bg-white' : 'bg-yellow-1')">
            <q-td :props="props" key="id">
              {{props.row.id}}
            </q-td>
            <q-td :props="props" key="cliente">
              <q-icon :color="props.row.listarPendiente ? 'primary' : 'black'" :name="props.row.listarPendiente ? 'smartphone' : 'person'" size="18px"></q-icon>
              {{props.row.usuario.nombre}}
            </q-td>
            <q-td :props="props" key="direccion">
              {{props.row.direccion}}
            </q-td>
            <q-td :props="props" key="fecha">
              {{$moment.unix(props.row.fecha).format('MMMM DD [de] YYYY')}}
            </q-td>
            <q-td :props="props" key="total">
              ${{parseFloat(props.row.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}
            </q-td>
            <q-td :props="props" key="acciones" auto-width>
              <q-btn round outline color="secondary" class="no-border" icon="visibility" @click="verPedido(props.row)"/>
              <q-btn v-if="!props.row.cancelado" round outline color="secondary" class="no-border" :icon="props.row.pendiente ? 'check_circle_outline' : 'check_circle'" @click="cambiarEstado(props.row)"/>
              <q-btn round outline color="red" class="no-border" icon="delete" @click="eliminarPedido(props.row)"></q-btn>
            </q-td>
          </q-tr>
        </q-table>  
      <q-page-sticky position="bottom-right" :offset="[12, 12]">
        <q-btn size="md" round color="primary" icon="add" @click="$router.push('/app/pedido')"/>
      </q-page-sticky>
  </q-page>
</template>

<script>
import http from 'src/funciones/http'
import {LocalStorage} from 'quasar'
export default {
  data () {
    return {
      filtrar: "0",
      fecha1:0,
      fecha2:0,
      f1:0,
      f2:0,
      pedidos:[],
      columnas:[
        {
          name: 'id',
          field: 'id',
          label: 'Id',
          align: 'center'
        },
        {
          name:'cliente',
          field: row => row.usuario.nombre,
          label: 'Cliente',
          align: 'left',
          sortable: true
        },
        {
          name: 'direccion',
          field: 'direccion',
          align: 'left',
          label: 'Direccion'
        },
        {
          name: 'fecha',
          field: 'fecha',
          align: 'left',
          sortable: true,
          label: 'Fecha'
        },
        {
          name: 'total',
          field: 'total',
          label: 'Total',
          sortable: true,
          align: 'right'
        },
        {
          name: 'acciones',
          label: 'Acciones',
          align: 'center'
        }
      ]
    }
  },
  beforeDestroy(){
    this.$mqtt.unsubscribe('app/pedido/cancelado')
    this.$mqtt.unsubscribe('app/pedido/nuevo')
  },
  mounted(){
    this.$mqtt.subscribe('app/pedido/cancelado', {qos:1})
    this.$mqtt.subscribe('app/pedido/nuevo', {qos:1})
    let f1 = this.$moment().startOf('day')
    let f2 = this.$moment(f1).subtract(7, 'days')
    this.f2 = f1.toDate()
    this.f1 = f2.toDate()
    this.fecha1 = f2.unix()
    this.fecha2 = f1.unix()
    this.cargarFiltro()
  },
  mqtt:{
    'app/pedido/cancelado'(data){
      let doc = {
        fecha1: this.fecha1,
        fecha2:this.fecha2,
        pendiente: this.filtrar == '0' ? true : this.filtrar == '1' ? false : null
      }

      http(doc, result => {
        this.pedidos = JSON.parse(JSON.stringify(result.datos))
      }, e => {
        this.$q.notify(e)
      }, 'pedido/listar')
    },
    'app/pedido/nuevo'(data){
      let doc = {
        fecha1: this.fecha1,
        fecha2:this.fecha2,
        pendiente: this.filtrar == '0' ? true : this.filtrar == '1' ? false : null
      }

      http(doc, result => {
        this.pedidos = JSON.parse(JSON.stringify(result.datos))
      }, e => {
        this.$q.notify(e)
      }, 'pedido/listar')
    },
  },
  methods:{
    realTime(id, producto, cantidad){
      let doc = {
        id: id,
        productoId: producto,
        cantidad
      }
      this.$mqtt.publish('app/pedido', JSON.stringify(doc))
    },
    cargarFiltro(){

      let doc = {
        fecha1: this.fecha1,
        fecha2:this.fecha2,
        pendiente: this.filtrar == '0' ? true : this.filtrar == '1' ? false : null
      }

      http(doc, result => {
        this.pedidos = JSON.parse(JSON.stringify(result.datos))
      }, e => {
        this.$q.notify(e)
      }, 'pedido/listar')
    },
    cambiarEstado(row){
      this.$q.dialog({
        title: 'Pedido',
        message: row.pendiente == true ? '¿Desea despachar el pedido?' : '¿Desea colocar el pedido en pendientes?',
        ok: 'Si',
        cancel: 'No'
      }).then(() => {
        let doc = {
          id: row.id,
          pendiente: !row.pendiente
        }
        http(doc, result => {
          this.$mqtt.publish('app/pedido/' + row.usuarioId, 'cargar')
          this.cargarFiltro()
        }, e => {
          this.$q.notify(e)
        }, 'pedido/actualizar')
      })
    },
    verPedido(row){
      let doc = JSON.parse(JSON.stringify(row))
      doc.cliente = doc.usuario
      delete doc.usuario
      http({pedido: row.id}, result => {
        doc.detalle = JSON.parse(JSON.stringify(result.datos))
        LocalStorage.set('pedido', doc)
        this.$router.push('/app/pedido')
      }, e => {
        this.$q.notify(e)
      }, 'detalle/pedido')
    },
    eliminarPedido(row){
      this.$q.dialog({
        title: 'Pedido',
        message:'¿Desea eliminar el pedido?',
        ok: 'Si',
        cancel: 'No'
      }).then(() => {
        http({pedido: row.id}, result => {
          if(row.pendiente == true && row.cancelado == false){
            let docs = JSON.parse(JSON.stringify(result.datos))
            docs.forEach(item => {
              this.eliminarItem(row.id, item)
            })
          }
          this.eliminarP(row.id, row.usuarioId)
        }, e => {
          this.$q.notify(e)
        }, 'detalle/pedido')
      })
    },
    eliminarItem(id,row){
      let doc = {
        id: row.id,
        productoId: row.productoId,
        cantidad: row.cantidad
      }
      http(doc, result => {
        this.realTime(id, row.productoId, row.cantidad)
      }, e => {
      }, 'detalle/eliminar')
    },
    eliminarP(id, user){
      http({id: id}, result => {
        this.$mqtt.publish('app/pedido/' + user, 'cargar')
        this.pedidos = this.pedidos.filter(element => element.id != id)
      }, e => {
        this.$q.notify(e)
      }, 'pedido/eliminar')
    },
    cambiarF1(date){
      this.fecha1 = this.$moment(date).startOf('day').unix()
      this.cargarFiltro()
    },
    cambiarF2(date){
      this.fecha2 = this.$moment(date).startOf('day').unix()
      this.cargarFiltro()
    }
  }
}
</script>

<style>
</style>
