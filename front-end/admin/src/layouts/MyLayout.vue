<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Mr Tata
          <div slot="subtitle">Admin</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list no-border link inset-delimiter >
        <q-list-header>Menu</q-list-header>
        <q-item to="/app" exact>
          <q-item-main label="Ventas"/>
        </q-item>
        <q-item to="/app/pedidos" exact>
          <q-item-main label="Pedidos"/>
          <q-item-side right>
            <q-chip square color="primary" class="shadow-2">{{pendientes}}</q-chip>
          </q-item-side>
        </q-item>
        <q-item to="/app/clientes" exact>
          <q-item-main label="Clientes"/>
        </q-item>
        
        <q-collapsible label="Inventario">
          <q-item to="/app/entradas" exact>
            <q-item-main label="Entradas"/>
          </q-item>
          <q-item to="/app/inventario" exact>
            <q-item-main label="Existencias"/>
          </q-item>
        </q-collapsible>

        
        <q-item to="/app/productos" exact>
          <q-item-main label="Productos"/>
        </q-item>
        <q-item to="/app/cuenta" exact>
          <q-item-main label="Cuenta"/>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

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
    };
  },
  mqtt:{
    'app/pedido/cancelado' (data){
      this.pendientes = this.pendientes - 1
      this.$q.notify({
        message: 'Se ha cancelado un pedido',
        color: 'yellow-9'
      })
      var audio = new Audio('statics/noti.mp3');
      audio.play();
    },
    'app/pedido/nuevo' (data){
      this.pendientes = this.pendientes + 1
      this.$q.notify({
        message: 'Un nuevo pedido',
        color: 'primary'
      })
      var audio = new Audio('statics/noti.mp3');
      audio.play();
    }
  },
  beforeDestroy(){
    this.$mqtt.unsubscribe('app/pedido/cancelado')
    this.$mqtt.unsubscribe('app/pedido/nuevo')
  },
  mounted(){
    this.$mqtt.subscribe('app/pedido/cancelado', {qos:1})
    this.$mqtt.subscribe('app/pedido/nuevo', {qos:1})
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
</style>
