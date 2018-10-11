<template>
  <q-page padding>
    <p class="q-mx-md">Gestion de clientes</p>

    <div class="row">
      <div class="col-xs-12 col-md-3">
        <q-input class="q-mx-md" float-label="Cedula" v-model="cedula"></q-input>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-input class="q-mx-md" float-label="Nombre" v-model="nombre"></q-input>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-input class="q-mx-md" float-label="Correo" v-model="correo"></q-input>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-input class="q-mx-md" float-label="Direccion" v-model="direccion"></q-input>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-md-3 ">
        <q-input class="q-mx-md" type="number" float-label="Celular" v-model="celular"></q-input>
      </div>
      <div class="col-xs-12 col-md-4 q-mt-md">
        <q-btn-group>
          <q-btn :loading="cargando" :label="editar ? 'Actualizar' : 'Guardar'" color="primary" @click="ejecutar"/>
          <q-btn color="primary" outline label="Cancelar" @click="reset"/>
        </q-btn-group>
      </div>
    </div>

    <br><br>
    <q-table :data="objs" :columns="columnas" :loading="cargandoT" row-key="name">
      <template slot="top-left" slot-scope="props">
        <q-search hide-underline placeholder="Buscar cliente" v-model="buscar" />
      </template>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="cedula" :props="props">
          {{props.row.cedula}}
        </q-td>
        <q-td key="nombre" :props="props">
          {{props.row.nombre}}
        </q-td>
        <q-td key="correo" :props="props">
          {{props.row.correo}}
        </q-td>
        <q-td key="direccion" :props="props">
          {{props.row.direccion}}
        </q-td>
        <q-td key="celular" :props="props">
          {{props.row.celular}}
        </q-td>
        <q-td key="deshabilitado" :props="props" auto-width>
          <q-checkbox v-model="props.row.deshabilitado" readonly />
        </q-td>
        <q-td auto-width>
          <q-btn color="secondary" t label="Editar" class="q-mr-sm" @click="editarDatos(props.row)"/>
          <q-btn v-if="props.row.deshabilitado == false" color="negative" round delete icon="delete" @click="eliminar(props.row.id)" />
        </q-td>
      </q-tr>
    </q-table>
  </q-page>
</template>

<script>
import http from 'src/funciones/http'
export default {
  data (){
    return{
      editar: false,
      cargando: false,
      cargandoT: true,
      buscar: '',
      id: 0,
      uid: 0,
      cedula: '',
      nombre: '',
      correo: '',
      direccion: '',
      celular: '',
      objs:[],
      columnas:[
        {
          name: 'cedula',
          field: 'cedula',
          label: 'Cedula',
          align: 'left',
          sortable: true
        },
        {
          name: 'nombre',
          field: 'nombre',
          label: 'Nombre',
          align: 'left',
          sortable: true
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
        },
        {
          name: 'deshabilitado',
          field: 'deshabilitado',
          label: 'Deshabilitado',
          align: 'center'
        },
        {
          name: 'acciones',
          label: 'Acciones',
          align: 'center'
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
    },
    reset(){
      this.cargando = false
      this.editar = false
      this.id = 0
      this.uid = 0
      this.cedula = ''
      this.nombre = ''
      this.correo = ''
      this.direccion = ''
      this.celular = ''
    },
    ejecutar(){
      this.cedula = this.cedula.trim()
      this.nombre = this.nombre.trim()
      this.celular = this.celular.trim()
      this.correo = this.correo.trim()
      this.direccion = this.direccion.trim()

      let ok = false

      this.objs.forEach(element => {
        if(element.cedula == this.cedula){
          ok = true
          return
        }
      });

      if(this.cedula == ''){
        this.$q.notify('Ingrese un numero de cedula')
      } else if(this.nombre == ''){
        this.$q.notify('Ingrese el nombre del cliente')
      }else if(this.correo == ''){
        this.$q.notify('Ingrese el correo del cliente')
      }else if(this.direccion == ''){
        this.$q.notify('Ingrese la direccion del cliente')
      } else if(this.isEmail(this.correo)){
        this.$q.notify('Ingrese una direccion de correo valida')
      } else if (ok){
        this.$q.notify('La cedula ya existe')
      } else{

      }
    },
    editarDatos(row){
      let temp = JSON.parse(JSON.stringify(row))
      this.editar = true
      this.id = temp.id
      this.uid = temp.uid
      this.nombre = temp.nombre
      this.correo = temp.correo
      this.cedula = temp.cedula
      this.celular = temp.celular
      this.direccion = temp.direccion
      window.scrollTo(0, 0);
    },
    eliminar(id){

    },
    isEmail(correo) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(correo);
    }
  }
}
</script>

<style>
</style>
