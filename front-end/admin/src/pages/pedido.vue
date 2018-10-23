<template>
  <q-page padding>
    <p class="q-mx-md"><strong>Nuevo pedido:</strong> #{{id}} <strong>Total: </strong> ${{(parseFloat(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}} </p>
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
        <q-btn :disabled="total ==0" color="primary" label="Cerrar" @click="cerrar"/>
        <q-btn :disabled="total ==0" color="primary" label="Imprimir" @click="imprimir"/>
      </q-btn-group>
    </div>

    <q-table class="q-mt-md" :data="detalle" row-key="name" :columns="columnas">
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td :props="props" key="producto">
          {{props.row.producto.nombre}}
        </q-td>
        <q-td :props="props" key="descripcion">
          {{props.row.producto.descripcion}}
        </q-td>
        <q-td :props="props" key="precio">
          ${{(parseFloat(props.row.precio)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}
        </q-td>
        <q-td :props="props" key="cantidad">
          {{props.row.cantidad}}

          <q-popup-edit v-model="props.row.cantidad" title="Cantidad" buttons @save="(v1,v2) => {actualizarItemDetalle(props.row, v2)}">
            <q-input type="number" v-model="props.row.cantidad" />
          </q-popup-edit>
        </q-td>
        <q-td :props="props" key="total">
          ${{(parseFloat(props.row.total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}
        </q-td>
      </q-tr>
    </q-table>

    <q-page-sticky v-if="id!=0" position="bottom-right" :offset="[12, 12]">
      <q-btn size="md" round color="primary" icon="add" @click="mostrarP=true"/>
    </q-page-sticky>

    <q-modal v-model="mostrarP" no-route-dismiss no-esc-dismiss no-backdrop-dismiss	>
      <div class="q-pa-md">
        <q-field label="producto">
          <q-search v-model="buscarP">
            <q-autocomplete @search="filtrarProducto" @selected="selectedProducto"/>
          </q-search>
        </q-field>
        <q-field label="Precio">
          <span v-if="item != null">${{(item.precio)}}</span>
          <span v-else>$0</span>
        </q-field>
        <q-field  label="Cantidad">
          <q-input type="number" v-model="cantidad" @keyup="calcular"/>
        </q-field>
        <q-field label="Total">
          ${{subtotal}}
        </q-field>
        <div class="row q-mt-md justify-center">
          <q-btn-group>
            <q-btn :disabled="item == null || subtotal == 0 || cantidad == null" color="primary" label="Agregar" @click="agregarDetalle"/>
            <q-btn color="primary" outline label="Cancelar" @click="cerrarDialogo"></q-btn>
          </q-btn-group>
        </div>
      </div>
    </q-modal>
    
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
      detalle: [],
      item: null,
      buscarP:'',
      mostrarP: false,
      subtotal: 0,
      cantidad: 0,
      existencias: [],
      columnas:[
        {
          name: 'producto',
          label: 'Producto',
          field: row => row.producto.nombre,
          align: 'left',
          shortable: true,
        },
        {
          name: 'descripcion',
          label: 'Descripcion',
          field: row => row.producto.descripcion,
          align: 'left',
          shortable: true,
        },
        {
          name: 'precio',
          label: 'Precio',
          field: 'precio',
          align: 'right'
        },
        {
          name: 'cantidad',
          label: 'Cantidad',
          field: 'cantidad',
          align: 'right'
        },
        {
          name: 'total',
          label: 'Total',
          field: 'total',
          align: 'right'
        }
      ]
    }
  },
  beforeDestroy(){
    LocalStorage.remove('pedido')
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
    this.cargarExistencias()
  },
  methods:{
    cargarExistencias(){
      http(null, result => {
        this.existencias = JSON.parse(JSON.stringify(result.datos))
      }, e => {
        this.$q.notify(e)
      }, 'inventario/existencias')
    },
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
      this.cliente = {
        nombre: cliente.label,
        cedula: cliente.sublabel
      }
      this.buscarC = cliente.label
      if(this.id != 0){
        this.actualizarPedido()
      }
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
      this.buscarP = '',
      this.item = null,
      this.mostrarP = false
      this.cantidad = 0
      this.subtotal = 0
    },
    filtrarProducto(term, done){
      http({buscar: term}, result => {
        let lista = result.datos.map(producto => {
          return {
            label: producto.nombre,
            sublabel: producto.categoria,
            value: producto.id,
            precio: producto.precioVenta,
            descripcion: producto.descripcion,
            referencia: producto.referencia
          }
        })
        done(lista)
      }, e => {
        this.$q.notify(e)
      }, 'producto/buscar')
    },
    selectedProducto(producto){
      let tem = JSON.parse(JSON.stringify(producto))
      let ok = false
      let existencias = false
      this.detalle.forEach(item => {
        if(item.productoId == producto.value){
          ok = true
          return
        }
      })
      this.existencias.forEach(element => {
        if(element.productoId == producto.value){
          if(element.stock > 0){
            existencias = true
          }
          return
        }
      })
      if(ok == true){
        this.buscarP = ''
        this.$q.notify('Ya se encuentra el producto registrado')
      } else if(existencias == false){
        this.buscarP = ''
        this.$q.notify('El producto esta agotado')
      } else {
        this.item = {
          id: tem.value,
          nombre: tem.label,
          categoria: tem.sublabel,
          precio: tem.precio,
          descripcion: tem.descripcion,
          referencia: tem.referencia
        }
        this.buscarP = producto.label
      }
    },
    calcular(){
      this.existencias.forEach(item => {
        if(item.productoId == this.item.id){
          if(this.cantidad > item.stock || this.cantidad < 0 ){
            this.cantidad = item.stock
          }
          this.subtotal = this.cantidad * this.item.precio
        }
      })
    },
    cerrarDialogo(){
      this.buscarP = '',
      this.item = null,
      this.mostrarP = false
      this.cantidad = 0
      this.subtotal = 0
    },
    guardarTemp(){
      LocalStorage.set('pedido',{
        id: this.id,
        fecha: this.fecha,
        total: this.total,
        cliente: this.cliente,
        detalle: this.detalle
      })
      this.cargarExistencias()
    },
    agregarDetalle(){
      let doc = {
        pedidoId: this.id,
        productoId: this.item.id,
        precio: this.item.precio,
        cantidad: this.cantidad,
        total: this.subtotal,
        fecha: this.fecha
      }
      http(doc, result => {
        console.log(result)
        let tem = JSON.parse(JSON.stringify(result.datos))
        tem.producto = JSON.parse(JSON.stringify(this.item))
        this.detalle.push(tem)
        this.total = this.total + tem.total
        this.guardarTemp()
        this.cerrarDialogo()
        this.actualizarPedido()
      }, e => {
        this.$q.notify(e)
      }, 'detalle/insertar')
    },
    actualizarItemDetalle(row, oldValor){
      let stock = 0
      this.existencias.forEach(item => {
        if(item.productoId == row.producto.id){
          stock = item.stock
          return
        }
      })
      if(row.cantidad > stock || row.cantidad < 0){
        row.cantidad = stock
      }
      this.total = this.total - row.total
      row.total = row.precio * row.cantidad
      this.total = this.total + row.total
      let tem = JSON.parse(JSON.stringify(row))
      tem.oldCantidad = oldValor
      http(tem, result => {
        this.guardarTemp()
        this.actualizarPedido()
      }, e => {
        this.$q.notify(e)
      }, 'detalle/actualizar')
    },
    actualizarPedido(){
      if(this.cliente != null){
        let doc = {
          id: this.id,
          usuarioId: this.cliente.value,
          total: this.total
        }
        http(doc, result => {
          this.guardarTemp()
        }, e => {
          this.$q.notify(e)
        }, 'pedido/actualizar')
      }
    },
    imprimir(){
      this.$router.push('/app/recibo')
    },
    cerrar(){
      this.$router.push('/app/pedidos')
    }
  }
}
</script>

<style>
</style>
