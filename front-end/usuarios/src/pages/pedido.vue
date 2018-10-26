<template>
  <q-layout>
    
      <q-layout-header class="no-shadow ">
      <q-toolbar  color="primary" class="q-py-none no-shadow no-border">
        <q-btn icon="keyboard_arrow_left" class="no-shadow" @click="$router.push('/app')"/>
        <q-toolbar-title>
          Mr Tata
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <q-tabs align="justify" class="no-shadow" style="border-radius: 0px">
        <q-tab default label="Productos" name="tab1" slot="title" />
        <q-tab label="Pedido" name="tab2" slot="title" />
        <q-tab-pane name="tab1">

          <q-search v-model="buscar" placeholder="Buscar" @input="buscarInventario"></q-search>

          <div v-if="productos.length != 0" class="row no-wrap justify-center">
            <div style="margin:5px 5px" :class="(producto.stock == 0 ? 'bg-red-3': 'bg-white') + (producto.seleccionado != undefined ? (producto.seleccionado == true ? ' bg-yellow-3' : ' bg-white') : ' bg-white') + ' col-xs-6 card shadow-2 q-pa-md'" v-for="(producto, i) in productos" :key="i" @click="seleccionar(producto)">
              <div class="row justify-center">
                <img :src="producto.producto.foto" style="height:100px; max-width:90%">
              </div>
              <p class="q-mt-md">{{producto.producto.nombre}} {{producto.producto.descripcion}}</p>
              <p>${{(parseFloat(producto.producto.precioVenta)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}</p>
            </div>
          </div>

          <p class="q-mt-md" v-else>Busqueda sin resultados</p>

        </q-tab-pane>
        <q-tab-pane name="tab2">
          <div class="row items-center">
            <div class="col-xs-8">
              Total: ${{(parseFloat(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }}
            </div>
            <div class="col-xs-4">
              <q-btn outline round class="no-border" color="primary" icon="save" @click.native="enviarPedido"/>
              <q-btn outline round class="no-border" color="negative" icon="delete" @click.native="eliminarPedido"/>
            </div>
          </div>
          <div class="row">
            <q-field label="Direccion">
              <q-input v-model="direccion"></q-input>
            </q-field>
          </div>
          <q-list no-border link inset-separator>
            <q-item v-for="(item, i) in detalle" :key="i">
              <q-item-side>
                <q-item-tile avatar>
                  <img :src="item.producto.foto" alt="">
                </q-item-tile>
              </q-item-side>
              <q-item-main>
                <q-item-tile label>{{item.producto.nombre}} {{item.producto.descripcion}}</q-item-tile>
                <q-item-tile sublabel>Precio: ${{(parseFloat(item.producto.precioVenta)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}</q-item-tile>
                <q-item-tile sublabel>cant {{item.cantidad}}. ${{(parseFloat(item.total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}</q-item-tile>
                <q-btn round outline class="no-border" icon="add" @click.native="add(item)"/>
                <q-btn round outline class="no-border" icon="remove" @click.native="remove(item)"/>
                <q-btn round outline class="no-border" color="negative" icon="delete" @click.native="eliminarItem(item)"/>
              </q-item-main>
            </q-item>
          </q-list>
        </q-tab-pane>
      </q-tabs>
    </q-page-container>

  </q-layout>
</template>

<script>
import http from 'src/funciones/http'
export default {
  data(){
    return {
      productos: [],
      detalle: [],
      id: 0,
      total: 0,
      pendiente: true,
      fecha: 0,
      direccion: '',
      buscar: ''
    }
  },
  beforeDestroy(){
    this.$mqtt.unsubscribe('app/pedido')
    if(this.total == 0){
       http('pedido/eliminar', {id: this.id}, result => {
          this.$q.localStorage.remove('pedido')
        }, e => {
          this.$q.notify(e)
        })
    }
  },
  mqtt:{
    'app/pedido' (data, tema){
      let msj = String.fromCharCode.apply(null, data)
      let inv = JSON.parse(msj)
      console.log(inv)
      if(inv.id != this.id){
        this.productos.forEach(item => {
          if(item.productoId == inv.productoId){
            item.stock = parseFloat(item.stock) + parseFloat(inv.cantidad)
            return
          }
        })
      }
      
    }
  },
  mounted(){
    this.$mqtt.subscribe('app/pedido', {qos: 1})
    this.fecha = this.$moment().startOf('day').unix()

    let pedido = this.$q.localStorage.get.item('pedido')
    if(pedido != null){
      this.id = pedido.id
      this.fecha = pedido.fecha
      this.total = pedido.total
      this.detalle = JSON.parse(JSON.stringify(pedido.detalle))
      this.direccion = pedido.direccion
    }

    if(this.id == 0){
      this.direccion = this.$q.localStorage.get.item('usuario').direccion
        let doc = {
          usuarioId: this.$q.localStorage.get.item('usuario').id,
          total: 0,
          fecha: this.fecha,
          pendiente: true,
          direccion: this.$q.localStorage.get.item('usuario').direccion
        }
        http('pedido/insertar', doc, result => {
          this.id = result.datos.id
          this.guardarTem()
        }, e => {
          this.$q.notify(e)
        })
      }
    
    this.cargarProductos()
  },
  methods:{
    realTime(id, cantidad){
      let doc = {
        id: this.id,
        productoId: id,
        cantidad: cantidad
      }
      console.log(doc)
      this.$mqtt.publish('app/pedido', JSON.stringify(doc))
    },
    sendAlert(){
      this.$mqtt.publish('app/nuevo/pedido', 'cargar')
    },
    cargarProductos(){
      http('inventario/listacliente', null, result => {
        this.productos = JSON.parse(JSON.stringify(result.datos))
        this.detalle.forEach(detalle => {
          this.productos.forEach(producto => {
            if(detalle.productoId == producto.productoId){
              producto.seleccionado = true
              return
            }
          })
        })
        this.guardarTem()
      }, e => {
        this.$q.notify(e)
      })
    },
    seleccionar(producto){
      if(producto.stock > 0){
        let ok = false
        this.detalle.forEach(item => {
          if(item.productoId == producto.productoId){
            ok = true
          }
        })
        if(ok == false){
          producto.seleccionado = true
          producto.stock = producto.stock - 1
          let doc = {
            pedidoId: this.id,
            productoId: producto.productoId,
            fecha: this.fecha,
            precio: producto.producto.precioVenta,
            cantidad: 1,
            total: producto.producto.precioVenta
          }
          http('detalle/insertar', doc, result => {
            this.realTime(producto.productoId, -1)
            let item = JSON.parse(JSON.stringify(result.datos))
            item.producto = JSON.parse(JSON.stringify(producto.producto))
            this.detalle.push(item)
            this.total = parseFloat(this.total) + parseFloat(producto.producto.precioVenta)
            this.guardarTem()
            this.actualizarPedido()
          }, e => {
            this.$q.notify(e)
            producto.seleccionado = false
          })
        }
      }
      
    },
    guardarTem(){
      this.$q.localStorage.set('productos', JSON.parse(JSON.stringify(this.productos)))
      let pedido = {
        id: this.id,
        fecha: this.fecha,
        total: this.total,
        usuarioId: this.$q.localStorage.get.item('usuario').id,
        pendiente: true,
        detalle: JSON.parse(JSON.stringify(this.detalle)),
        direccion: this.direccion
      }
      if(this.id != 0){
        pedido.pendiente = this.pendiente
      }
      this.$q.localStorage.set('pedido', pedido)
    },
    actualizarPedido(){
      let doc = {
        id: this.id,
        total: this.total,
        direccion: this.direccion
      }
      http('pedido/actualizar', doc, result => {
        this.guardarTem()
      }, e => {
        this.$q.notify(e)
      })
    },
    add(item){
      let stock = 0
      let old = 0
      this.productos.forEach(p => {
        if(p.productoId == item.productoId){
          stock = p.stock
        }
      })
      old = item.cantidad
      item.cantidad = item.cantidad + 1
      if(item.cantidad > stock){
        item.cantidad = stock
      }
      this.total = this.total - item.total
      item.total = item.cantidad * item.precio
      this.total = this.total + item.total
      this.actualizarItem(JSON.parse(JSON.stringify(item)), old, -1)
    }, 
    remove(item){
      let old = item.cantidad
      item.cantidad = item.cantidad - 1
      if(item.cantidad < 0){
        item.cantidad = 0
      }
      this.total = this.total - item.total
      item.total = item.cantidad * item.precio
      this.total = this.total + item.total
      this.actualizarItem(JSON.parse(JSON.stringify(item)), old, 1)
    },
    actualizarItem(item, old, cant){
      item.oldCantidad = old
      http('detalle/actualizar', item, result => {
        this.realTime(item.productoId, cant)
        this.actualizarPedido()
      }, e => {
        this.$q.notify(e)
      })
    },
    eliminarItem(item){
      this.$q.dialog({
        title: 'Producto',
        message: 'Desea eliminar el item?',
        ok: 'Si',
        cancel: 'No'
      }).then(() => {
        http('detalle/eliminar', JSON.parse(JSON.stringify(item)), result => {
          this.total = parseFloat(this.total) - parseFloat(item.total)
          this.detalle = this.detalle.filter(element => element.id != item.id)
          this.realTime(item.productoId, item.cantidad)
          this.guardarTem()
          this.actualizarPedido()
        }, e => {
          this.$q.notify(e)
        })
      })
    },
    enviarPedido(){
      if(this.total > 0){
        this.$q.dialog({
          title: 'Enviar Pedido',
          message: 'Desea enviar el pedido?. Una vez enviado no podras editarlo',
          ok: 'Si',
          cancel: 'No'
        }).then(() => {
          let doc = {
            id: this.id,
            total: this.total,
            listarPendiente: true
          }
          http('pedido/actualizar', doc, result => {
            this.sendAlert()
            this.$q.localStorage.remove('pedido')
            this.$router.push('/app')
          }, e => {
            this.$q.notify(e)
          })
        })
      } else{
        this.$q.notify('Selecciona un producto primero')
      }
    },
    eliminarPedido(){
      let ok = false
      if(this.total == 0){
        ok = true 
      }
      this.$q.dialog({
        title: 'Pedido',
        message: '¿Desea descartar el pedido?',
        ok: 'Si',
        cancel: 'No'
      }).then(() => {
        if(ok == false){
          this.detalle.forEach(item => {
             http('detalle/eliminar', JSON.parse(JSON.stringify(item)), result => {
               this.realTime(item.productoId, item.cantidad)
             },e=>{})
          })
          this.eliminar()
        }else {
          this.eliminar()
        }
      })
    },
    eliminar(){
      http('pedido/eliminar', {id: this.id}, result => {
        this.$q.localStorage.remove('pedido')
        this.$router.push('/app')
      }, e => {})
    },
    buscarInventario(){
      http('inventario/buscar', {buscar: this.buscar}, result => {
        this.productos = JSON.parse(JSON.stringify(result.datos))
        this.detalle.forEach(detalle => {
          this.productos.forEach(producto => {
            if(detalle.productoId == producto.productoId){
              producto.seleccionado = true
              return
            }
          })
        })
      }, e => {
        this.$q.notify(e)
      })
    }
  }
}
</script>

<style>
.card{
  width: 48%!important
}
</style>
