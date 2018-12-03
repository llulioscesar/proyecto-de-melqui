<template>
  <q-page padding>

    <div class="q-pa-md q-mb-lg fondo1">
      <q-field label="No. Pedido">{{pedido.id}}</q-field>
      <q-field label="Proveedor">{{pedido.proveedor.nombre}}</q-field>
      <q-field label="Nit">{{pedido.proveedor.nit}}</q-field>
      <q-field label="Fecha">{{$moment.unix(pedido.fecha).format('MMMM DD [de] YYYY')}}</q-field>      
    </div>

    <div class="fondo1 q-mb-lg q-pa-md">
      <q-radio color="yellow" v-model="estado" val="pendiente" label="Pendiente" @input="camEstado"/>
      <q-radio color="yellow" v-model="estado" val="recibido" label="Recibido" @input="camEstado"/>
      <q-radio color="yellow" v-model="estado" val="cancelado" label="Cancelado" @input="camEstado"/>
      <q-btn @click="eliminarP" class="q-ml-md" color="red" label="Eliminar"></q-btn>
    </div>

    <q-table class="fondo1" :data="pedido.detalle" :columns="columns">

      <template slot="body" slot-scope="props" :props="props">
        <q-tr :props="props">
          <q-td :props="props" key="referencia">
            {{props.row.producto.referencia}}
          </q-td>
          <q-td :props="props" key="producto">
            {{props.row.producto.nombre}}
          </q-td>
          <q-td :props="props" key="categoria">
            {{props.row.producto.categoria}}
          </q-td>
          <q-td :props="props" key="cantidad">
            {{props.row.cantidad1}}
          </q-td>
          <q-td :props="props" key="cargada">
            {{props.row.cantidad2}}
          </q-td>
          <q-td auto-width :props="props" key="acciones">
            <q-btn @click.native="cargar(props.row)" :disabled="props.row.cargado" round class="text-black" color="yellow" icon="expand_less"></q-btn>
          </q-td>
        </q-tr>
      </template>

    </q-table>

  </q-page>
</template>

<script>
import http from 'src/funciones/http'
export default {
  data(){
    return {
      estado:'pendiente',
      eliminar: false,
      pedido: {
        id: null,
        fecha: 0,
        proveedor:{
          nombre: null,
          nit: null
        },
        detalle:[]
      },
      columns: [
        {
          name: 'referencia',
          label: 'Referencia',
          align: 'left'
        },
        {
          name: 'producto',
          label: 'Producto',
          align: 'left'
        },
        {
          name: 'categoria',
          label: 'categoria',
          align: 'left'
        },
        {
          name: 'cantidad',
          label: 'Cantidad',
          align: 'right'
        },
        {
          name: 'cargada',
          label: 'Cargada',
          align: 'right'
        },
        {
          name: 'acciones',
          label: 'Acciones'
        }
      ]
    }
  },
  mounted(){
    this.pedido = JSON.parse(JSON.stringify(this.$q.localStorage.get.item('pedido2')))
    if(this.pedido.cancelado){
      this.estado = 'cancelado'
    } else {
      if(this.pedido.pendiente){
        this.estado = 'pendiente'
      } else {
        this.estado = 'recibido'
      }
    }
    console.log(this.pedido)
  },
  methods:{
    cargar(row){
      this.$q.dialog({
        title: 'Cargar stock',
        prompt: {
          model: row.cantidad2,
          type: 'number' // optional
        },
        ok: 'Subir stock',
        cancel: 'Cancelar'
      }).then(cantidad => {
        if(cantidad >= 1 && cantidad <= row.cantidad2){
          row.cantidad2 = cantidad
          http({cantidad: cantidad, productoId: row.productoId, fecha: this.$moment().startOf('day').unix()}, result => {
            row.cargado = true
            http({cargado: true, cantidad2: cantidad, id: row.id}, result => {}, e => {}, 'detallePedidoProveedor/editar')
          }, e => {
            this.$q.notify(e)
          }, 'entrada/insertar')
        } else {
          this.$q.notify('La cantidad no esta en rango')
        }
      })
    },
    camEstado(){
      switch(this.estado){
        case 'pendiente':
          this.pedido.pendiente = true
          this.pedido.cancelado = false
          break
        case 'recibido':
          this.pedido.pendiente = false
          this.pedido.cancelado = false
          break
        case 'cancelado':
          this.pedido.pendiente = false
          this.pedido.cancelado = true
          break
      }
      http({pendiente: this.pedido.pendiente, cancelado: this.pedido.cancelado, id: this.pedido.id}, result => {

      }, e => {
        this.$q.notify(e)
      }, 'pedidoProveedor/editar')
    },
    eliminarP(){
      this.$q.dialog({
        title: 'Eliminar Pedido',
        message: '¿Realmente desea eliminar el pedido?',
        ok: 'Si',
        cancel: 'No'
      }).then(() => {
        http({id: this.pedido.id}, result =>{
          this.$q.localStorage.remove('pedido2')
          this.$router.push('/app/pedidos2')
        }, e => {
          this.$q.notify(e)
        }, 'pedidoProveedor/eliminar')
      })
    }
  }
}
</script>

<style>
</style>
