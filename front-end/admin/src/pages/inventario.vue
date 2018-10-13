<template>
  <q-page padding>
    <p>Existencias</p>

    <q-table :data="objs" :columns="columnas" row-key="name">
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td>
          {{props.row.producto.referencia}}
        </q-td>
        <q-td :props="props" key="producto">
          {{props.row.producto.nombre}}
        </q-td>
        <q-td>
          {{props.row.producto.categoria}}
        </q-td>
        <q-td :props="props" key="entradas">
          {{ props.row.entradas }}
        </q-td>
        <q-td :props="props" key="salidas">
          {{props.row.salidas}}
        </q-td>
        <q-td :props="props" key="stock">
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
      objs: [],
      columnas: [
        {
          name: "referencia",
          label: "referencia",
          align: "left"
        },
        {
          name: "producto",
          field: "producto",
          label: "Producto",
          sortable: true,
          align: "left"
        },
        {
          name: "categoria",
          label: "Categoria",
          align: "left"
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
          align: "right"
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
  }
}
</script>

<style>
</style>
