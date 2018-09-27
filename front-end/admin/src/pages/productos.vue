<template>
  <q-page padding>
    <div class="row">
      <div class="col-xs-12 col-md-3">
        <q-input float-label="Nombre" v-model="nombre"></q-input>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-input float-label="Referencia" v-model="ref"></q-input>
      </div>
      <div class="col-xs-12 col-md-6">
        <q-input float-label="Descripcion" v-model="descripcion"></q-input>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-md-2">
        <q-input type="number" float-label="Precio de compra" v-model="compra"></q-input>
      </div>
      <div class="col-xs-12 col-md-2 ">
        <q-input type="number" float-label="Precio de venta" v-model="venta"></q-input>
      </div>
      <div class="col-xs-12 col-md-2 q-mt-md  ">
        <q-checkbox label="eliminado" v-model="deshabilitado"/>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data(){
    return{
      deshabilitado: false,
      nombre: '',
      ref: '',
      descripcion: '',
      compra: '',
      venta: ''
    }
  },
  methods:{

  }
}
</script>

<style>
</style>
