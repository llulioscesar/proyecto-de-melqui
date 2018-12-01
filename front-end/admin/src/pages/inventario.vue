<template>
  <q-page padding>
    <div class="fondo1 q-mb-md q-pa-md">Existencias
      <q-checkbox class="q-ml-xl" color="yellow-7" v-model="pedido" label="Para pedido" @input="cambiar"></q-checkbox>
    </div>

    <q-table class="fondo1" :data="objs" :columns="columnas" row-key="name" :filter="search">
      <template slot="top-left" slot-scope="props">
        <q-search hide-underline placeholder="Buscar" color="yellow-7" v-model="search" />
      </template>
      <q-tr style="border-color:rgba(0,0,0,0.12)!important" slot="body" slot-scope="props" :props="props" :class="(props.row.stock <= 10 ? 'bg-red-1' : (props.row.stock > 10 && props.row.stock <= 100 ? 'bg-yellow-1' : ''))">
        <q-td :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" :props="props" key="referencia">
          {{props.row.producto.referencia}}
        </q-td>
        <q-td :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" :props="props" key="producto">
          {{props.row.producto.nombre}}
        </q-td>
        <q-td  :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" :props="props" key="categoria">
          {{props.row.producto.categoria}}
        </q-td>
        <q-td :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" :props="props" key="descripcion">
          {{props.row.producto.descripcion}}
        </q-td>
        <q-td :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" :props="props" key="entradas">
          {{ props.row.entradas }}
        </q-td>
        <q-td :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" :props="props" key="salidas">
          {{props.row.salidas}}
        </q-td>
        <q-td :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" :props="props" key="stock">
          {{props.row.stock}}
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
      pedido: false,
      objs: [],
      search: '',
      columnas: [
        {
          name: "referencia",
          label: "referencia",
          align: "left",
          field: row => row.producto.referencia,
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
          name: "descripcion",
          label: "Descripcion",
          align: "left",
          field: row => row.producto.descripcion,
        },
        {
          name: "entradas",
          field: "entradas",
          label: "Entradas",
          align: "right"
        },
        {
          name: "salidas",
          field: "salidas",
          label: "Salidas",
          align: "right"
        },
        {
          name: "stock",
          field: "stock",
          label: "Stock",
          align: "right",
          sortable: true,
        }
      ]
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.cargar();
    });
  },
  methods:{
    cargar() {
      http(null, result => {
        this.objs = JSON.parse(JSON.stringify(result.datos))
      }, e => {
        this.$q.notify(e)
      }, 'inventario/')
    },
    cambiar(){
      if(this.pedido){
        http(null, result => {
          this.objs = JSON.parse(JSON.stringify(result.datos))
        }, e => {
          this.$q.notify(e)
        }, 'inventario/pedido')
      } else{
        this.cargar()
      }
    }
  }
}
</script>

<style>
</style>
