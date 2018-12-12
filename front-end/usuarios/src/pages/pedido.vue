<template>
  <q-layout style="background:url(statics/fondo2.jpg);background-size: cover;background-position: center;background-attachment: fixed;background-repeat:no-repeat">
    
      <q-layout-header class="no-shadow ">
      <q-toolbar  color="yellow" class="q-py-none no-shadow no-border text-black">
        <q-btn icon="keyboard_arrow_left" class="no-shadow" @click="$router.push('/app')"/>
        <q-toolbar-title>
          Mr Tata
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <q-tabs align="justify" color="yellow" text-color="black" class="no-shadow" style="border-radius: 0px">
        <q-tab default label="Productos" name="tab1" slot="title" />
        <q-tab label="Pedido" name="tab2" slot="title" />
        <q-tab-pane name="tab1">

          <q-search class="fondo1 q-pa-md" dark color="yellow" v-model="buscar" placeholder="Buscar" @input="buscarInventario"></q-search>

          <div v-if="productos.length != 0" class="row wrap justify-center">
            <div style="margin:5px 2px" :class="(producto.stock == 0 ? 'bg-red-3': 'bg-white') + (producto.seleccionado != undefined ? (producto.seleccionado == true ? ' bg-yellow-3' : ' bg-white') : ' bg-white') + ' col-xs-5 card shadow-2 q-pa-md'" v-for="(producto, i) in productos" :key="i" @click="seleccionar(producto)">
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
          <div class="row items-center q-pa-md fondo1">
            <div class="col-xs-9">
              Total: ${{(parseFloat(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }}
            </div>
            <div class="col-xs-3">
              <q-btn color="primary" @click.native="enviarPedido">Enviar</q-btn>
              <q-btn outline round class="no-border" color="negative" icon="delete" @click.native="eliminarPedido"/>
            </div>
          </div>
          <div class="row q-my-md q-pa-md dir">
            <q-field class="text-black" label="Direccion">
              <q-input v-model="direccion"></q-input>
            </q-field>
          </div>
          <q-list class="fondo1" no-border link inset-separator>
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
      buscar: '',
      boton: false
    }
  },
  beforeDestroy(){
    this.$mqtt.unsubscribe('app/pedido')
    if(this.total == 0){
       http('pedido/eliminar', {id: this.id}, result => {
          this.$mqtt.publish('app/pedido/cancelado', '1')
          this.$q.localStorage.remove('pedido')
        }, e => {
          this.$q.notify(e)
        })
    } else {
      if(this.boton == false){
        this.$mqtt.publish('app/pedido/cancelado', '1')
        this.detalle.forEach(item => {
          http('detalle/eliminar', JSON.parse(JSON.stringify(item)), result => {
            this.realTime(item.productoId, item.cantidad)
          },e=>{})
        })
        this.eliminar()
      }
    }
    this.$q.localStorage.remove('pedido')
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
          cliente: true,
          direccion: this.$q.localStorage.get.item('usuario').direccion
        }
        http('pedido/insertar', doc, result => {
          this.$mqtt.publish('app/pedido/refresh', '1')
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
      this.$mqtt.publish('app/pedido/nuevo', 'cargar')
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
      console.log(producto)
      if(producto.stock > 0){
        let ok = false
        this.detalle.forEach(item => { 
          if(item.productoId == producto.productoId){
            ok = true
          }
        })
        if(ok == false){
          let el = this
          this.$q.dialog({
            title: 'Agregar Producto',
            message: '¿Desea agregar ' + producto.producto.nombre + '?',
            ok: 'Si',
            cancel: 'No'
          }).then(() => {
            producto.seleccionado = true
            producto.stock = producto.stock - 1
            let doc = {
              pedidoId: el.id,
              productoId: producto.productoId,
              fecha: el.fecha,
              precio: producto.producto.precioVenta,
              cantidad: 1,
              total: producto.producto.precioVenta
            }
            http('detalle/insertar', doc, result => {
              el.realTime(producto.productoId, -1)
              let item = JSON.parse(JSON.stringify(result.datos))
              item.producto = JSON.parse(JSON.stringify(producto.producto))
              el.detalle.push(item)
              el.total = parseFloat(el.total) + parseFloat(producto.producto.precioVenta)
              el.guardarTem()
              el.actualizarPedido()
            }, e => {
              el.$q.notify(e)
              producto.seleccionado = false
            })
          }).catch(()=>{})
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
        direccion: this.direccion,
        cancelado: false,
        listarPendiente: false
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
      console.log(item)
      
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
          this.productos.forEach(element => { 
          if(element.productoId == item.producto.id){
            element.seleccionado = false
          }
        })
        }, e => {
          this.$q.notify(e)
        })
      })
    },
    enviarPedido(){
      if(this.total > 0){
        this.$q.dialog({
          title: 'Enviar Pedido',
          message: 'Esta es la direccion de envio del pedido?',
          prompt: {
            model: this.direccion,
            type: 'text'
          },
          ok: 'Si',
          cancel: 'No'
        }).then((data) => {
          this.direccion = data
          this.boton = true
          let doc = {
            id: this.id,
            total: this.total,
            pendiente: true,
            cancelado: false,
            direccion: this.direccion
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
        this.boton = true
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
.q-item:hover{
  background: none!important;
}
.dir{
  background: linear-gradient(270deg, #246655, #511adb, #db1a6e, #1adb54, #cedb1a, #db1c1a)!important;
  background-size: 1200% 1200%!important;
  animation: AnimationName 30s ease infinite!important;
  border-radius: 5px;
  color:black;
}

@keyframes AnimationName { 
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}

.q-field-label{
  color:black;
}
</style>
