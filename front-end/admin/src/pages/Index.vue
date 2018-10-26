<template>
  <q-page padding>
    
  </q-page>
</template>

<style>
</style>

<script>
import http from 'src/funciones/http'
export default {
  name: 'PageIndex',
  data(){
    return{

    }
  },
  mounted(){
    this.masVendido()
  },
  methods:{
    masVendido(){
      http(null, result => {
        console.log(result)
      }, e => {
        this.$q.notify(e)
      }, 'detalle/masVendido')
    }
  }
}
</script>
