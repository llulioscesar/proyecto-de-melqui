<template>
  <q-layout>
    <q-layout-header>
      <q-toolbar color="primary" class="q-py-none">
        <q-toolbar-title>
          Mr Tata
        </q-toolbar-title>
      </q-toolbar>
  
      <q-tabs align="justify">
        <q-route-tab label="Mis pedidos" to="/app" exact slot="title" />
        <q-route-tab label="Cuenta" to="/app/cuenta" exact slot="title" />
      </q-tabs>
    </q-layout-header>
  
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
  export default {
    name: "MyLayout",
    data() {
      return {
        url: null
      };
    },
    beforeMount() {
      this.$nextTick(() => {
        let usuario = this.$q.localStorage.get.item("usuario");
        if (!usuario) {
          this.$router.push("/");
        }
      });
    },
  };
</script>

<style>
  
</style>
