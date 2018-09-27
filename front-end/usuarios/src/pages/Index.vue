<template>
  <q-page padding>
    <div class="flex flex-center" v-if="pedidos == null">
      <p style="font-size:16px">Aqui se mostraran todos los pedidos realizados</p>
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
    }
  }
</script>
