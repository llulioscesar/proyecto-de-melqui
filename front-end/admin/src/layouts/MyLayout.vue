<template>
  <q-layout view="lHh Lpr lFf" style="background:url(statics/fondo1.jpg);background-size: cover;background-position: center;background-attachment: fixed;background-repeat:no-repeat">
    <q-layout-header>
      <q-toolbar color="yellow" class="text-black">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Mr Tata
          <div slot="subtitle">Admin</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer v-model="leftDrawerOpen" class="fondo1">
      <q-list no-border link inset-delimiter class="bg-transparent">
        <q-list-header>Menu</q-list-header>
        <q-item class="menuapp" to="/app/pedidos" exact>
          <q-item-main label="Pedidos"/>
          <q-item-side right>
            <q-chip id="globo" square color="red" class="text-white shadow-2">{{pendientes}}</q-chip>
          </q-item-side>
        </q-item>
        <q-item class="menuapp" to="/app/clientes" exact>
          <q-item-main label="Clientes"/>
        </q-item>
        
        <q-collapsible id="menu-inventario" class="menuapp" label="Inventario">
          <q-item class="menuapp" to="/app/entradas" exact>
            <q-item-main label="Entradas"/>
          </q-item>
          <q-item class="menuapp" to="/app/inventario" exact>
            <q-item-main label="Existencias"/>
          </q-item>
          <!----><q-item class="menuapp" to="/app/pedidos2" exact>
            <q-item-main label="Pedidos"/>
          </q-item>
        </q-collapsible>

        <!----><q-item class="menuapp" to="/app/proveedores" exact>
          <q-item-main label="Proveedores"/>
        </q-item>
        <q-item class="menuapp" to="/app/productos" exact>
          <q-item-main label="Productos"/>
        </q-item>
        <q-item class="menuapp" to="/app" exact>
          <q-item-main label="Reportes"/>
        </q-item>
        <q-item class="menuapp" to="/app/cuenta" exact>
          <q-item-main label="Cuenta"/>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <!--
    <div v-if="f1 >= f2" style="position:absolute;bottom:16px;left:16px;z-index: 100000;border-radius:5px;" class="q-pa-md text-black bg-red">
      Proyecto sin pagar
      <p style="font-size:9px;margin:0">Julio Cesar Caicedo Santos</p>
    </div>
    -->

  </q-layout>
</template>

<script>
import { openURL } from "quasar";
import http from 'src/funciones/http';
export default {
  name: "MyLayout",
  watch:{
    $route (to, from){
        this.cargar()
    }
  }, 
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      pendientes: 0,
      f1:0,
      f2:1544287200
    };
  },
  mqtt:{
    'app/pedido/cancelado' (data){
      http(null, result => {
        this.pendientes = result.datos
          this.$q.notify({
          message: 'Se ha cancelado un pedido',
          color: 'yellow-9'
        })
        var audio = new Audio('statics/noti.mp3');
        audio.play();
      }, e => {

      }, 'pedido/pendientes')
      
      
    },
    'app/pedido/nuevo' (data){
      http(null, result => {
        this.pendientes = result.datos
        this.$q.notify({
          message: 'Un nuevo pedido',
          color: 'primary'
        })
        var audio = new Audio('statics/noti.mp3');
        audio.play();
      }, e => {

      }, 'pedido/pendientes')
      
    },
    'app/pedido/despachado' (data, tema) {
      var str = String.fromCharCode.apply(null, data);
      switch(str){
        case 'true':
          if(this.pendientes > 0){
            this.pendientes = this.pendientes - 1
          }
          break
        case 'false':
          this.pendientes = this.pendientes + 1
          break
      }
    },
  },
  beforeDestroy(){
    this.$mqtt.unsubscribe('app/pedido/cancelado')
    this.$mqtt.unsubscribe('app/pedido/nuevo')
    this.$mqtt.unsubscribe('app/pedido/despachado')
  },
  mounted(){
    this.$mqtt.subscribe('app/pedido/cancelado', {qos:1})
    this.$mqtt.subscribe('app/pedido/nuevo', {qos:1})
    this.$mqtt.subscribe('app/pedido/despachado', {qos:1})

    this.f1 = this.$moment().unix()

    this.cargar()
  },
  beforeMount() {
      this.$nextTick(() => {
        let usuario = this.$q.localStorage.get.item("usuario");
        if (!usuario) {
          this.salir()
        }
      });
    },
  methods:{
    cargar(){
      http(null, result => {
        this.pendientes = result.datos
      }, e => {

      }, 'pedido/pendientes')
    },
    salir(){
        let el = this
        this.$auth.signOut().then(function() {
          el.$q.localStorage.clear()
          el.$router.push('/')
        }).catch(function(error) {
          el.$q.notify(error)
          el.$q.localStorage.clear()
          el.$router.push('/')
        });
      }
  }
};
</script>

<style>
.img-producto {
  object-fit: cover;
  object-position: center;
}
.fondo1{
  background: rgba(28,28,28,0.9);
  border-radius: 5px;
  color:white!important
}
.fondo1 input, .fondo1 th, .fondo1 td{
  color:white!important
}
.fondo1 tr, .fondo1 td, .fondo1 thead{
  border-color: rgba(255,255,255,0.12)!important
}
.fondo1 button{
  /*color:black!important*/
}
.fondo1 canvas, .fondo1 .q-if, .fondo1 .q-input-target, .fondo1 .q-table-bottom{
  color: white!important;
}
.q-layout-drawer{
  background: rgba(0,0,0,0.95)!important
}
.menuapp.router-link-active{
  background: #ffeb3b!important;
  color:black!important;
}
.menuapp:hover:not(.router-link-active){
  background: rgba(255, 235, 59,0.5)!important;
}
#menu-inventario.q-collapsible-opened:hover{
  background: none!important;
}
@media(max-width: 992px){
  .q-layout-drawer{
    color: black!important;
    background: rgba(240,240,240,1)!important;
  }
}
</style>
