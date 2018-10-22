<template>
  <q-page padding>
    <p class="q-mx-md">Control de existencias de productos</p>

    <q-table :data="objs" :columns="columnas" row-key="name" :filter="search" :filter-method="myFilter">
      <template slot="top-left" slot-scope="props">
        <q-search hide-underline placeholder="Buscar" v-model="search" />
      </template>
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td>
          {{props.row.producto.referencia}}
        </q-td>
        <q-td :props="props" key="producto">
          {{props.row.producto.nombre}}
        </q-td>
        <q-td :props="props" key="categoria">
          {{props.row.producto.categoria}}
        </q-td>
        <q-td :props="props" key="fecha">
          {{ $moment.unix(props.row.fecha).format('MMMM DD [de] YYYY') }}
        </q-td>
        <q-td :props="props" key="cantidad">
          {{props.row.cantidad}}
        </q-td>
        <q-td auto-width>
          <q-btn color="secondary" label="editar" class="q-mr-xs" @click="cambiar(props.row)"/>
          <q-btn icon="delete" color="negative" round @click="eliminar(props.row)"/>
        </q-td>
      </q-tr>
    </q-table>

    <q-modal v-model="dialogBuscar" no-esc-dismiss no-backdrop-dismiss>
      <div class="q-pa-md">
        <q-field label="Producto">
          <q-search v-model="buscar" placeholder="Buscar producto">
            <q-autocomplete :max-results="100" @search="buscarProducto" @selected="selectProducto"/>
          </q-search>
        </q-field>
        <q-field label="Cantidad">
          <q-input type="number" v-model="obj.cantidad" />
        </q-field>
        <div class="row justify-center q-mt-lg">
          <q-btn-group>
            <q-btn color="primary" label="guardar" @click="ejecutar"></q-btn>
            <q-btn color="primary" label="cerrar" @click="reset"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>

    <q-modal v-model="dialogEditar" no-esc-dismiss no-backdrop-dismiss>
      <div class="q-pa-md">
        <q-field label="Producto">
          {{obj.nombre}}
        </q-field>
        <q-field label="Cantidad">
          <q-input type="number" v-model="obj.cantidad" />
        </q-field>
        <div class="row justify-center q-mt-lg">
          <q-btn-group>
            <q-btn color="primary" label="guardar" @click="ejecutar"></q-btn>
            <q-btn color="primary" label="cerrar" @click="reset"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn size="lg" round color="primary" icon="add" @click="dialogBuscar=true"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import {filter} from 'quasar'
import http from "src/funciones/http";
import moment from "moment"
export default {
  data() {
    return {
      editar: false,
      dialogBuscar: false,
      dialogEditar: false,
      obj:{
        productoId: 0,
        cantidad: 0
      },
      search:"",
      buscar: "",
      objs: [],
      columnas: [
        {
          name: "referencia",
          label: "Referencia",
          field: row => row.producto.referencia,
          align: "left"
        },
        {
          name: "producto",
          field: row => row.producto.nombre,
          label: "Producto",
          sortable: true,
          align: "left"
        },
        {
          name: "categoria",
          label: "Categoria",
          align: "left",
          field: row => row.producto.categoria,
        },
        {
          name: "fecha",
          field: 'fecha',
          label: "Fecha",
          sortable: true,
          align: "left"
        },
        {
          name: "cantidad",
          field: "cantidad",
          label: "Cantidad",
          sortable: true,
          align: "right"
        },
        {
          label: 'Acciones',
          align: 'center'
        }
      ]
    };
  },
  beforeMount() {
    this.$nextTick(() => {
      this.cargar();
    });
  },
  methods: {
    cargar() {
      http(null, result => {
        this.objs = JSON.parse(JSON.stringify(result.datos))
      }, e => {
        this.$q.notify(e)
      }, 'entrada/listar')
    },
    buscarProducto(query, done) {
      http(
        { buscar: query },
        result => {
          let lista = result.datos.map(item => {
            return {
              label: item.nombre,
              sublabel: item.categoria,
              avatar: item.foto,
              value: item.id,
              referencia: item.referencia,
              stamp: 'ref: ' + item.referencia
            }
          });

          let nombre = filter(query, {field: 'label', list: lista})
          let categoria = filter(query, {field: 'sublabel', list: lista})
          let referencia = filter(query, {field: 'referencia', list: lista})

          if(nombre.length > 0){
            done(nombre)
          } else if(categoria.length > 0){
            done(categoria)
          }else if(referencia.length > 0){
            done(referencia)
          } else {
            done();
          }
        },
        e => {
          done();
          this.$q.notify(e);
        },
        "producto/buscar"
      );
    },
    selectProducto(item) {
      this.buscar = item.label
      this.obj.productoId = item.value
    },
    ejecutar(){
      if(this.obj.productoId == 0){
        this.$q.notify('Selecciona un producto')
      }else{
        if(this.editar) {
          http(this.obj, result => {
            console.log(result)
            this.reset()
            this.cargar()
          }, e => {
            this.$q.notify(e)
          }, 'entrada/actualizar')
        } else{
          http(this.obj, result => {
            this.reset()
            this.cargar()
          }, e => {
            this.$q.notify(e)
          }, 'entrada/insertar')
        }
      }
    },
    reset(){
      this.editar = false
      this.dialogBuscar = false
      this.dialogEditar = false
      this.buscar = '',
      this.obj = {
        productoId: 0,
        cantidad: 0
      }
    },
    cambiar(row){
      let temp = JSON.parse(JSON.stringify(row))
      this.editar = true
      this.dialogEditar = true
      this.obj = {
        nombre: temp.producto.nombre,
        productoId: temp.producto.id,
        id: temp.id,
        cantidad: temp.cantidad,
        cantidadOld: temp.cantidad
      }
    },
    eliminar(row){
      this.$q.dialog({
        title: 'Eliminar',
        message: '¿Desea eliminar esta entrada?',
        ok: 'Si',
        cancel: 'No'
      }).then(() => {
        http({id: row.id, productoId: row.productoId, cantidad: row.cantidad}, result => {
          this.reset()
          this.cargar()
          }, e => {
            this.$q.notify(e)
          }, 'entrada/eliminar')
      })
    },
    myFilter (rows, terms, cols, cellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : ''
      return rows.filter(row => {
        return cols.some(col => {
          let temp 
          switch(col.label){
            case 'Referencia':
              return (cellValue(col, row) + '').toLowerCase().indexOf(lowerTerms) !== -1
            case 'Producto': 
              return (cellValue(col, row) + '').toLowerCase().indexOf(lowerTerms) !== -1
            case 'Categoria':
              return (cellValue(col, row) + '').toLowerCase().indexOf(lowerTerms) !== -1
            case 'Fecha':
              let fecha = this.$moment.unix(row.fecha).format('MMMM DD [de] YYYY')
              return fecha.toLowerCase().indexOf(lowerTerms) !== -1
            case 'Cantidad':
              return (cellValue(col, row) + '').toLowerCase().indexOf(lowerTerms) !== -1
          }
        })
      })
    }
  }
};
</script>

<style>
</style>
