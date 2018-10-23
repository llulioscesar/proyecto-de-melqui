<template>
  <q-page padding>
    <p>mostrar, modificar, consultar, rechazar, ingresar pedidos y mostrar factura</p>
    <q-radio v-model="filtrar" val="1"  label="Pendientes" @input="cargarFiltro"/>
    <q-radio v-model="filtrar" val="2"  label="Entregados" style="margin-left: 10px" @input="cargarFiltro"/>
    <q-radio v-model="filtrar" val="3"  label="Todos" style="margin-left: 10px" @input="cargarFiltro"/>
    <q-datetime v-model="f1" type="date" />
    <q-datetime v-model="f2" type="date" />
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      filtrar: '1',
      fecha1:0,
      fecha2:0,
      f1:0,
      f2:0
    }
  },
  mounted(){
    let f1 = this.$moment().startOf('day')
    let f2 = this.$moment(f1).subtract(7, 'days')
    this.f2 = f1.toDate()
    this.f1 = f2.toDate()
    this.fecha1 = f2.unix()
    this.fecha2 = f1.unix()
  },
  methods:{
    cargarFiltro(){
      
    }
  }
}
</script>

<style>
</style>
