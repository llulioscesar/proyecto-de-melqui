<template>
  <q-page padding>
     <div class="row q-pa-md fondo1">
       <img class="img-producto q-mr-md" :src="this.foto" height="100" style="border: 1px solid #027be3">
      <div class="col-xs-12 col-md-2">
        <input @change="loadFoto" type="file" id="files" name="files" accept="image/*" >
      </div>
    </div>
    <div class="row q-mt-md fondo1 q-pt-md">
      <div class="col-xs-12 col-md-3">
        <q-input class="q-mx-md" float-label="Nombre" v-model="nombre"></q-input>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-input class="q-mx-md" float-label="Referencia" v-model="ref"></q-input>
      </div>
      <div class="col-xs-12 col-md-6">
        <q-input class="q-mx-md" float-label="Descripcion" v-model="descripcion"></q-input>
      </div>
    </div>
    <div class="row fondo1 q-pb-md">
      <div class="col-xs-12 col-md-2">
        <q-input class="q-mx-md" type="number" float-label="Precio de compra" v-model="compra"></q-input>
      </div>
      <div class="col-xs-12 col-md-2 ">
        <q-input class="q-mx-md" type="number" float-label="Precio de venta" v-model="venta"></q-input>
      </div>
      <div class="col-xs-12 col-md-2 q-mt-md ">
        <q-select class="q-mx-md" v-model="categoria" :options="categorias" />
      </div>
      <div class="col-xs-12 col-md-3 q-mt-md  ">
        <q-checkbox class="q-mx-md" label="Deshabilitado" v-model="deshabilitado"/>
      </div>
      <div class="col-xs-12 col-md-3 q-mt-md">
        <q-btn-group>
          <q-btn :loading="cargando" :label="editar ? 'Actualizar' : 'Guardar'" color="primary" @click="ejecutar"/>
          <q-btn color="primary" outline label="Cancelar" @click="reset"/>
        </q-btn-group>
      </div>
    </div>
    <div class="row q-mt-md bg-primary q-pa-md round-borders text-white">
      
      <div class="col-md-12 col-xs-12">
        <p style="display: inline-block">carga masiva (CSV)</p> <q-btn @click="descargarF" class="q-ml-md text-black" color="white" label="Descargar formato"></q-btn>
      </div>
      <div class="col-md-12 col-xs-12">
        <input @change="loadCsv" type="file" id="csv" name="csv" accept=".csv" >
        <q-btn v-if="cargaM" class="no-shadow" :loading="cargaM"></q-btn>
      </div>
    </div>
    <br><br>
    <q-table class="fondo1" :data="objs" row-key="name" :columns="columnas" :filter="buscar" :loading="cargandoT" color="primary"> 
      <template slot="top-left" slot-scope="props">
        <q-search hide-underline placeholder="Buscar producto" v-model="buscar" />
      </template>
      <!--<template slot="top-selection" slot-scope="props">
        <q-btn color="secondary" t label="Editar" class="q-mr-sm" @click="editarDatos"/>
        <q-btn color="negative" round delete icon="delete" @click="eliminar" />
      </template>-->
      <q-tr slot="body" slot-scope="props" :props="props">
        <!--<q-td>
          <q-checkbox color="primary" v-model="props.selected" />
        </q-td>-->
        <q-td key="foto" :props="props" auto-width>
          <img class="img-producto" :src="props.row.foto" alt="" height="100">
        </q-td>
        <q-td key="nombre" :props="props">
          {{props.row.nombre}}
        </q-td>
        <q-td key="referencia" :props="props">
          {{props.row.referencia}}
        </q-td>
        <q-td key="descripcion" :props="props">
          {{props.row.descripcion}}
        </q-td>
        <q-td key="categoria" :props="props">
          {{props.row.categoria}}
        </q-td>
        <q-td key="precioCompra" :props="props">
          ${{(props.row.precioCompra).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}
        </q-td>
        <q-td key="precioVenta" :props="props">
          ${{ (props.row.precioVenta).replace(/\d(?=(\d{3})+\.)/g, '$&,') }}
        </q-td>
        <q-td key="estado" :props="props">
          <q-checkbox v-model="props.row.estado" readonly />
        </q-td>
        <q-td>
          <q-btn color="secondary" t label="Editar" class="q-mr-sm" @click="editarDatos(props.row)"/>
          <q-btn v-if="props.row.estado == false" color="negative" round delete icon="delete" @click="eliminar(props.row.id)" />
        </q-td>
      </q-tr>
    </q-table>
  </q-page>
</template>

<script>

function getBase64(file, calback) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
     calback(reader.result)
   };
   reader.onerror = function (error) {
     alert('Error: ', error);
   };
}
import Papa from 'papaparse'
import http from 'src/funciones/http'
export default {
  data(){
    return{
      cargando: false,
      cargandoT: true,
      editar: false,
      selected:[],
      buscar: '',
      id: 0,
      deshabilitado: false,
      nombre: '',
      ref: '',
      descripcion: '',
      compra: '',
      venta: '',
      foto: 'data:image/png;base64,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',
      categoria: 'Cerveza',
      objs:[],
      cargaM: false,
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
          Label: 'Imagen',
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
          name: 'descripcion',
          field: 'descripcion',
          label: 'Descripcion',
          align: 'left'
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
        },{
          name: 'estado',
          field: 'estado',
          label: 'Inhabilitado'
        },
        {
          name: 'aciones',
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
        this.objs = []
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
      this.foto =  'data:image/png;base64,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'
      this.categoria = 'Cerveza'
      this.selected = []
      this.cargando = false
    },
    ejecutar(){
      this.cargando = true
      this.cargandoT = true
      if(this.nombre == ''){
        this.$q.notify('Falta el nombre')
      } else if(this.ref == ''){
        this.$q.notify('Falta la referencia')
      }else if(this.compra == ''){
        this.$q.notify('Falta el precio de compra')
      }else if(this.venta == ''){
        this.$q.notify('Falta el precio de venta')
      }else{
        let datos = {
          id: this.id,
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
          http(datos, result => {
            this.reset()
            this.cargar()
          }, e => {
            this.$q.notify(e)
          }, 'producto/actualizar')
        }else{
          http(datos, result => {
            this.reset()
            this.cargar()
          }, e => {
            this.$q.notify(e)
          }, 'producto/insertar')
        }
      }
    },
    editarDatos(row) {
      this.editar = true
      let temp = JSON.parse(JSON.stringify(row))
      this.id = temp.id
      this.deshabilitado = temp.estado
      this.nombre = temp.nombre
      this.ref = temp.referencia
      this.descripcion = temp.descripcion
      this.compra = parseFloat(temp.precioCompra) 
      this.venta = parseFloat(temp.precioVenta)
      this.foto = temp.foto
      this.categoria = temp.categoria
      this.selected = []
      window.scrollTo(0, 0);
    },
    descargarF(){
      window.open('statics/formato.csv', '_blank')
    },
    eliminar(id){
      this.$q.dialog({
        title: 'Eliminar producto',
        message: '¿Desea eliminar el producto?',
        ok: 'Si',
        cancel: 'No'
      }).then(() => {
        this.cargandoT = true
        http({id: id, estado: true}, result => {
            this.reset()
            this.objs = this.objs.filter(element => element.id !== id)
          }, e => {
            this.$q.notify(e)
          }, 'producto/eliminar')
      }).catch(() => {
        this.cargandoT = false
      })
    },
    loadFoto(){
      var file = document.querySelector('input[type="file"]').files[0];
      getBase64(file, result => {
        this.foto = result
      });
    },
    loadCsv(){
      var file = document.getElementById("csv").files[0]
      this.cargaM = true
      let el = this
      let config = {
        delimiter: "",	// auto-detect
        newline: "",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        trimHeaders: false,
        dynamicTyping: false,
        preview: 0,
        encoding: "UTF-8",
        worker: false,
        comments: false,
        step: undefined,
        complete: function(results, file) {
          if(results.data.length > 0){
            let arr = results.data
            let docs = []
            arr.forEach(item => {
              docs.push({
                nombre: item[0],
                referencia: item[1],
                descripcion: item[2],
                categoria: item[3],
                precioCompra: item[4],
                precioVenta: item[5],
                estado: item[6]
              })
            })
            http({datos: JSON.parse(JSON.stringify(docs))}, results => {
              el.cargaM = false
              el.cargar()
              el.$q.dialog({
                title: 'Carga masiva',
                message: 'Se completo la carga masiva de productos'
              })
              document.getElementById("csv").value = ""
            }, e => {
              el.$q.notify(e)
            }, 'producto/cargar')
          }
          },
        error: undefined,
        download: false,
        skipEmptyLines: true,
        chunk: undefined,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        transform: undefined
      }
      if(file != undefined){
        Papa.parse(file, config)
      }
      
    }
  }
}
</script>

<style>
</style>
