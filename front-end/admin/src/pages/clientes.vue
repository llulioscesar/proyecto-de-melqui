<template>
  <q-page padding>
    <p>ingresar, actualizar, consultar, deshabilitar cliente</p>
    <q-table :data="objs" :columns="columnas" :loading="cargandoT">

    </q-table>
  </q-page>
</template>

<script>
import http from 'src/funciones/http'
export default {
  data (){
    return{
      cargandoT: true,
      objs:[],
      columnas:[
        {
          name: 'cedula',
          field: 'cedula',
          label: 'Cedula',
          align: 'left',
          shortable: true
        },
        {
          name: 'nombre',
          field: 'nombre',
          label: 'Nombre',
          align: 'left',
          shortable: true
        },
        {
          name: 'correo',
          field: 'correo',
          label: 'Correo',
          align: 'left'
        },
        {
          name: 'direccion',
          field: 'direccion',
          label: 'Direccion',
          align: 'left'
        },
        {
          name: 'celular',
          field: 'celular',
          label: 'Celular',
          align: 'left'
        }
      ]
    }
  },
  beforeMount(){
    this.$nextTick(() => {
      this.cargar()
    })
  },
  methods:{
    cargar(){
      http(null, result => {
        this.objs = JSON.parse(JSON.stringify(result.datos))
        this.cargandoT = false
      }, e => {
        this.$q.notify(e)
      }, 'usuario/clientes')
    }
  }
}
</script>

<style>
</style>
