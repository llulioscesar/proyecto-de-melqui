<template>
  <q-layout>
    <q-layout-header>
      <q-toolbar color="yellow" class="q-py-none text-black">
        <q-toolbar-title>
          Mr Tata
        </q-toolbar-title>
      </q-toolbar>
  
      <q-tabs align="justify" color="yellow" text-color="black">
        <q-route-tab label="Mis pedidos" to="/app" exact slot="title" />
        <q-route-tab label="Cuenta" to="/app/cuenta" exact slot="title" />
      </q-tabs>
    </q-layout-header>
  
    <q-page-container>
      <router-view style="background:url(statics/fondo2.jpg);background-size: cover;background-position: center;background-attachment: fixed;background-repeat:no-repeat"/>
    </q-page-container>
  </q-layout>
</template>

<script>
  export default {
    name: "MyLayout",
    data() {
      return {
        url: null,
      };
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
  .fondo1{
    background: rgba(0,0,0,0.9)!important;
    color:white!important;
    border-radius: 5px;
  }
</style>
