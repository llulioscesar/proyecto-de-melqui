<template>
  <q-page padding>
    <q-pull-to-refresh :handler="refresher" refresh-message="Actualizando" pull-message="Tire hacia abajo para refrescar" release-message="Suéltelo para actualizar">
      <div class="flex flex-center fondo1 q-py-md" v-if="pedidos.length == 0">
        <div>
          <img src="statics/vacio.PNG" width="200px">
          <br>
          <br>
          <p class="text-center no-margin">Aún no ha realizado pedidos</p>
          <p class="text-center no-margin">Cuando lo hagas acá se mostrarán</p>
        </div>
      </div>
      <div v-else>
        <q-list no-border link inset-separator class="fondo1">
          <q-item v-for="(pedido, i) in pedidos" :key="i" @click.native="ver(pedido)">
            <q-item-main>
              <q-item-tile label>{{$moment.unix(pedido.fecha).format('MMMM DD [de] YYYY')}}</q-item-tile>
              <q-item-tile class="text-white" sublabel><strong>Total</strong> ${{(parseFloat(pedido.total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}</q-item-tile>
              <q-item-tile class="text-white" sublabel><strong>Direccion:</strong> {{pedido.direccion}}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-item-tile v-if="!pedido.cancelado" :color="pedido.pendiente ? 'yellow-9' : 'primary'" :icon="pedido.pendiente ? 'access_time': 'done_all'"></q-item-tile>
              <q-item-tile v-if="pedido.cancelado" color="red" icon="close"></q-item-tile>
            </q-item-side>
          </q-item>
        </q-list>
      </div>
    </q-pull-to-refresh>
  
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn class="shadow-8 text-black" size="lg" round color="yellow" icon="add" @click.native="$router.push('/pedido')"/>
    </q-page-sticky>

    <q-modal minimized v-model="verificado" no-esc-dismiss no-backdrop-dismiss>
      <div class="q-pa-md">
        <p>Hola {{$q.localStorage.get.item('usuario').nombre}}, Para realizar un pedido, es necesario verificar la dirección de correo electrónico de tu cuenta. </p>
        <div class="row justify-center">
          <q-btn color="primary" label="Enviar mensaje de verificacion" @click="verificar"/>
          <q-btn class="q-mt-md" :disabled="!enviado" color="primary" label="Volver a iniciar sesion" @click="salir"/>
        </div>
      </div>
    </q-modal>

    <q-modal minimized v-model="isdatos" no-esc-dismiss no-backdrop-dismiss>
      <div class="q-pa-md">
        <p>Hola {{$q.localStorage.get.item('usuario').nombre}}, Completa algunos datos personales para realizar un pedido</p>
        <div class="row justify-center">
          <q-btn color="primary" label="Cuenta" @click="$router.push('/app/cuenta')"/>
        </div>
      </div>
    </q-modal>

    <q-modal minimized v-model="ispedido">
      <div class="q-pa-md" v-if="detalle != null">
        
        <q-list no-border link inset-separator>
          <q-item v-for="(item,i) in detalle" :key="i">
            <q-item-main>
              <q-item-tile label>{{item.producto.nombre}} {{item.producto.descripcion}}</q-item-tile>
              <q-item-tile sublabel>Precio: ${{(parseFloat(item.precio)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}</q-item-tile>
              <q-item-tile sublabel><strong>cant. {{item.cantidad}} Total: ${{(parseFloat(item.total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}</strong></q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
        <div class="row justify-center">
          <q-btn color="red" :label="pedido.pendiente ? 'cancelar pedido' : 'Elminar pedido'" @click.native="eliminar"></q-btn>
        </div>
      </div>
    </q-modal>
  
  </q-page>
</template>

<style>
  
</style>

<script>
  import http from 'src/funciones/http'
  export default {
    data() {
      return {
        pedidos: [],
        verificado: true,
        enviado: false,
        isdatos: false,
        detalle: null,
        ispedido: false,
        pedido: null
      }
    },
    mounted(){
      //this.$mqtt.subscribe('app/+', {qos: 1})
      this.$mqtt.subscribe('app/' + this.$q.localStorage.get.item('usuario').id, {qos: 1})
      this.$mqtt.subscribe('app/pedido/' + this.$q.localStorage.get.item('usuario').id, {qos: 1})
      
      let user = JSON.parse(JSON.stringify(this.$q.localStorage.get.item('usuario')))
      this.verificado = !user.correoVerificado

      if(user.cedula == null || user.cedula == undefined){
        this.isdatos = true
      }

      if(user.direccion == null || user.direccion == undefined){
        this.isdatos = true
      }

      if(this.isdatos == true){
        this.verificado = false
      }
      this.cargar()
    },
    beforeDestroy(){
      this.$mqtt.unsubscribe('app/' + this.$q.localStorage.get.item('usuario').id)
      this.$mqtt.unsubscribe('app/pedido/' + this.$q.localStorage.get.item('usuario').id)
    },
    mqtt:{
      'app/+/+' (data, tema){
        let msj = String.fromCharCode.apply(null, data)
        console.log(tema)
        if(tema == 'app/pedido/' + this.$q.localStorage.get.item('usuario').id){
          this.cargar()
        }
      },
      /*'app/+' (data, tema){
        let msj = String.fromCharCode.apply(null, data)
        console.log(tema)
        if(tema == 'app/' + this.$q.localStorage.get.item('usuario').id){
          this.salir()
        }
      }*/
    },
    methods:{
      refresher(done){
        this.cargar(done)
      },
      cargar(done){
        http('pedido/cliente', {id: this.$q.localStorage.get.item('usuario').id}, result => {
          this.pedidos = JSON.parse(JSON.stringify(result.datos))
          console.log(this.pedidos)
          console.log(result.datos)
          if(done != null || done != undefined){
            done()
          }
        }, e => {
          this.$q.notify(e)
        })
      },
      verificar(){
        let el = this
        let user = this.$auth.currentUser
        user.sendEmailVerification().then(function() {
          el.enviado = true
        }).catch(function(error) {
          el.$q.notify(error)
        });
      },
      salir(){
        let el = this
        this.$auth.signOut().then(function() {
          el.$q.localStorage.clear()
          el.$router.push('/')
        }).catch(function(error) {
          el.$q.notify(error)
        });
      },
      ver(pedido){
        http('detalle/pedido',{pedido:pedido.id},result =>{
          this.detalle = JSON.parse(JSON.stringify(result.datos))
          this.ispedido = true
          this.pedido = pedido
        }, e => {
          this.$q.notify(e)
        })
      },
      eliminar(){
        if(this.pedido.pendiente == true && this.pedido.cancelado == false){
          this.detalle.forEach(item => {
            this.removeItem(this.pedido.id, JSON.parse(JSON.stringify(item)))
          })
          let doc = JSON.parse(JSON.stringify(this.pedido))
          doc.cancelado = true
          doc.pendiente = false
          http('pedido/actualizar', doc, result => {
            this.$mqtt.publish('app/pedido/cancelado', 'cancelado')
            this.ispedido = false
            this.detalle = null
            this.pedido = null
            this.cargar()
          })
        } else {
          http('pedido/eliminar', {id: this.pedido.id}, result => {
            this.cargar()
            this.ispedido = false
            this.detalle = null
            this.pedido = null
          }, e => {
            this.$q.notify(e)
          })
        }
      },
      removeItem(id, item){
        http('inventario/actualizar', item, result => {
          this.$mqtt.publish('app/pedido', JSON.stringify({id:id,productoId: item.productoId, cantidad:item.cantidad}))
        }, e => {})
      }
    }
  }
</script>
