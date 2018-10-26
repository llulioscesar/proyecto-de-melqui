<template>
  <q-page padding>
    <div class="flex flex-center" v-if="pedidos.length == 0">
      <div>
        <img src="statics/vacio.PNG" width="200px">
        <br>
        <br>
        <p class="text-center no-margin">Aún no ha realizado pedidos</p>
        <p class="text-center no-margin">Cuando lo hagas acá se mostrarán</p>
      </div>
    </div>
    <div v-else>
      <q-list no-border link inset-separator>
        <q-item v-for="(pedido, i) in pedidos" :key="i" @click.native="$router.push('/pedido')">
          <q-item-main>
            <q-item-tile label>{{$moment.unix(pedido.fecha).format('MMMM DD [de] YYYY')}}</q-item-tile>
            <q-item-tile sublabel>${{(parseFloat(pedido.total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile :color="pedido.pendiente ? 'yellow-9' : 'primary'" :icon="pedido.pendiente ? 'access_time': 'done_all'"></q-item-tile>
          </q-item-side>
        </q-item>
      </q-list>
    </div>
  
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn class="shadow-8" size="lg" round color="primary" icon="add" @click.native="$router.push('/pedido')"/>
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
        isdatos: false
      }
    },
    mounted(){
      
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

      this.$mqtt.subscribe('app/+', {qos: 1})
      this.cargar()
    },
    beforeMount(){
      this.$mqtt.unsubscribe('app/+')
    },
    mqtt:{
      'app/+' (data, tema){
        let msj = String.fromCharCode.apply(null, data)
        if(tema == 'app/' + this.$auth.currentUser.uid){
          this.salir()
        }
        if(tema == 'app/pedido/' + this.$q.localStorage.get.item('usuario').id){
          this.cargar()
        }
      }
    },
    methods:{
      cargar(){
        http('pedido/cliente', {id: this.$q.localStorage.get.item('usuario').id}, result => {
          this.pedidos = JSON.parse(JSON.stringify(result.datos))
          console.log(result.datos)
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
      }
    }
  }
</script>
