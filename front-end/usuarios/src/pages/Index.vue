<template>
  <q-page padding>
    <div class="flex flex-center" v-if="pedidos == null">
      <p style="font-size:16px">Aqui se mostraran todos los pedidos realizados</p>
      <q-btn label="salir" color="primary" @click="salir"></q-btn>
    </div>
    <div v-else></div>
  
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary" icon="add" />
    </q-page-sticky>
  
  </q-page>
</template>

<style>
  
</style>

<script>
  export default {
    data() {
      return {
        pedidos: null
      }
    },
    methods:{
      salir(){
        let el = this
        this.$auth.signOut().then(function() {
          el.$q.localStorage.remove('usuario')
          el.$router.push('/')
        }).catch(function(error) {
          el.$q.notify(error)
        });
      }
    }
  }
</script>
