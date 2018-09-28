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
      <div class="col-xs-12 col-md-2 q-mt-md ">
        <q-select v-model="categoria" :options="categorias" />
      </div>
      <div class="col-xs-12 col-md-2 q-mt-md  ">
        <q-checkbox label="eliminado" v-model="deshabilitado"/>
      </div>
      <div class="col-xs-12 col-md-4 q-mt-md">
        <q-btn label="guardar" @click="ejecutar"/>
        <q-btn label="retablecer"/>
      </div>
    </div>
    <br><br>
    <q-table :data="objs" :columns="columnas" :filter="buscar">
      <template slot="top-left" slot-scope="props">
        <q-search hide-underline v-model="buscar" />
      </template>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="foto" :props="props" >
          <img :src="'data:image/jpeg;base64,' + props.row.foto" alt="" width="100px" height="100px">
        </q-td>
        <q-td key="nombre" :props="props">
          {{props.row.nombre}}
        </q-td>
        <q-td key="referencia" :props="props">
          {{props.row.referencia}}
        </q-td>
        <q-td key="categoria" :props="props">
          {{props.row.categoria}}
        </q-td>
        <q-td key="precioCompra" :props="props">
          {{(props.row.precioCompra)}}
        </q-td>
        <q-td key="precioVenta" :props="props">
          {{ (props.row.precioVenta) }}
        </q-td>
      </q-tr>
    </q-table>
  </q-page>
</template>

<script>
import http from 'src/funciones/http'
export default {
  data(){
    return{
      editar: false,
      buscar: '',
      id: 0,
      deshabilitado: false,
      nombre: '',
      ref: '',
      descripcion: '',
      compra: '',
      venta: '',
      foto: null,
      categoria: 'Cerveza',
      objs:[],
      categorias: [
        {
          label:'Aguardiente',
          value: 'Aguardiente' 
        },{
          label: 'Brandy',
          value: 'Brandy'
        },{
          label: 'Cerveza',
          value: 'Cerveza'
        },{
          label: 'Champaña',
          value: 'Champaña'
        },{
          label: 'Especiales',
          value: 'Especiales'
        },{
           label: 'Ginebra',
           value: 'Ginebra'
        },{
          label: 'Ron',
          value: 'Ron'
        },{
          label: 'Tequila',
          value: 'Tequila'
        },{
          label:  'Vino',
          value: 'Vina'
        },{
          label:  'Vodka',
          value: 'Vodka'
        },{
          label:  'Whisky',
          value: 'Whisky'
        }
      ],
      columnas:[
        {
          name: 'foto',
          field: 'foto',
          align: 'center'
        },
        {
          name: 'nombre',
          field: 'nombre',
          label: 'Nombre',
          shortable: true,
          align: 'left'
        },
        {
          name: 'referencia',
          field: 'referencia',
          label: 'Referencia',
          align: 'right'
        },
        {
          name: 'categoria',
          field: 'categoria',
          label: 'Categoria'
        },
        {
          name: 'precioCompra',
          field: 'precioCompra',
          label: 'Precio  de compra'
        },
        {
          name: 'precioVenta',
          field: 'precioVenta',
          label: 'Precio  de venta'
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
        this.objs = result.datos
      }, e => {
        this.$q.notify('No se pudo obtener los productos')
      }, 'producto/listar')
    },
    reset(){
      this.id = 0
      this.nombre = ''
      this.ref = ''
      this.editar = false
      this.id= 0
      this.deshabilitado = false
      this.descripcion = ''
      this.compra = ''
      this.venta = ''
      this.foto =  null
      this.categoria = 'Cerveza'
    },
    ejecutar(){
      if(this.nombre == ''){
        this.$q.notify('falta el nombre')
      } else if(this.ref == ''){
        this.$q.notify('falta la referencia')
      }else if(this.compra == ''){
        this.$q.notify('falta el precio de compra')
      }else if(this.venta == ''){
        this.$q.notify('falta el precio de venta')
      }else{
        let datos = {
          nombre: this.nombre,
          referencia: this.ref,
          foto: this.foto,
          descripcion: this.descripcion,
          categoria: this.categoria,
          precioCompra: this.compra,
          precioVenta: this.venta,
          estado: this.deshabilitado
        }
        if(datos.foto == null){
          delete datos.foto
        }
        if(this.editar){

        }else{
          console.log(datos)
          http(datos, result => {
            this.objs.push(JSON.parse(JSON.stringify(result.datos)))
            this.reset()
          }, e => {
            this.$q.notify('Ocurrio un problema. Intente mas tarde')
          }, 'producto/insertar')
        }
      }
    }
  }
}
</script>

<style>
</style>
