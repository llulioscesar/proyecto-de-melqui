<template>
  <q-page padding>
    <div class="fondo1 q-mb-md q-pa-md">Existencias
      <q-checkbox class="q-ml-xl" color="yellow-7" v-model="pedido" label="Para pedido" @input="cambiar"></q-checkbox>
      <q-btn @click="guardar" class="text-black q-ml-lg" v-if="pedido==true" :disabled="proveedor == null" color="yellow" label="guardar pedido"></q-btn>
      <q-search v-if="pedido == true" class="q-mx-md" v-model="buscarP" float-label="Proveedor" placeholder="Buscar Proveedor">
          <q-autocomplete @search="filtrarProveedor" @selected="selectedProveedor"/>
        </q-search>
    </div>

    <q-table class="fondo1" :data="objs" :columns="mmm" :selection="seleccion" :selected.sync="selected" row-key="name" :filter="search">
      <template slot="top-left" slot-scope="props">
        <q-search hide-underline placeholder="Buscar" color="yellow-7" v-model="search" />
      </template>

      <template slot="body" slot-scope="props" :props="props">
        <q-tr style="border-color:rgba(0,0,0,0.12)!important" :props="props" :class="(props.row.stock <= 10 ? 'bg-red-1' : (props.row.stock > 10 && props.row.stock <= 100 ? 'bg-yellow-1' : ''))">
          <q-td auto-width style="color:black!important;border-color:rgba(0,0,0,0.12)!important" v-if="pedido" key="selected" :props="props">
            <q-checkbox v-model="props.row.selected" @click.native="sss(props.row)" />
          </q-td>
          <q-td auto-width :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" key="cantidad" :props="props">
            {{props.row.cantidad}}
          </q-td>
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
          <q-td v-if="!pedido" :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" :props="props" key="entradas">
            {{ props.row.entradas }}
          </q-td>
          <q-td v-if="!pedido" :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" :props="props" key="salidas">
            {{props.row.salidas}}
          </q-td>
          <q-td :style="(props.row.stock <= 100 ? 'color:black!important;border-color:rgba(0,0,0,0.12)!important' : '')" :props="props" key="stock">
            {{props.row.stock}}
          </q-td>
        
        </q-tr>
      </template>
      
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
      buscarP: '',
      proveedor: null,
      seleccion: 'none',
      selected:[],
      mmm: [],
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
      ],
      colmns : [
        {
          name: 'selected',
          field: 'selected',
          label: '#'
        },
        {
          name: "cantidad",
          field: "cantidad",
          label: "Cantidad"
        },
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
        this.mmm = this.columnas
      }, e => {
        this.$q.notify(e)
      }, 'inventario/')
    },
    cambiar(){
      if(this.pedido){
        http(null, result => {
          let tt = JSON.parse(JSON.stringify(result.datos))
          tt.forEach(item => {
            item.selected = false
            item.cantidad = 0
          })
          this.objs = tt
          this.mmm = this.colmns
        }, e => {
          this.$q.notify(e)
        }, 'inventario/pedido')
      } else{
        this.cargar()
      }
    },
    filtrarProveedor(term, done){
      http({buscar: term}, result => {
        console.log(result)
        let lista = result.map(cliente => {
          return {
            label: cliente.nombre,
            sublabel: cliente.nit,
            value: cliente.id,
            direccion: cliente.direccion,
            celular: cliente.celular
          }
        })
        done(lista)
      }, e => {
        this.$q.notify(e)
      }, 'proveedor/buscar')
    },
    selectedProveedor(proveedor){
      this.proveedor = {
        id: proveedor.value,
        nombre: proveedor.label,
        direccion:proveedor.direccion,
        celular:proveedor.celular,
        nit:proveedor.nit
      }
      this.buscarP = proveedor.label
    },
    sss(row){
      if(this.proveedor != null){
        //row.selected = !row.selected
        if(row.selected){
          this.$q.dialog({
            title: row.producto.nombre,
            message: 'Cantidad pedida',
            prompt: {
              model: 0,
              type: 'number' // optional
            },
            ok: 'Pedir',
            cancel: 'Cancelar'
          }).then(cantidad => {
            row.cantidad = cantidad
            if(cantidad > 0){
              this.selected.push({
                productoId: row.producto.id,
                cantidad1: cantidad,
                cantidad2: cantidad,
                pedidoProveedorId: 0
              })
            } else {
              row.selected = !row.selected
            }
          })
        } else {
          row.cantidad = 0
          this.selected = this.selected.filter(element => element.productoId != row.producto.id)
        }
      }else {
        row.selected = row.selected == true ? false : true
        alert('Selecciona primero el proveedor')
      }
      
    },
    guardar(){
      if(this.selected.length > 0){
        let id = 0
        this.$q.dialog({
          title: 'Guardar pedido',
          message: '¿Esta seguro de que desea guardar este pedido?',
          ok: 'Si',
          cancel: 'No'
        }).then(() => {
          http({
            fecha: this.$moment().startOf('day').unix(),
            proveedorId: this.proveedor.id,
            cancelado: false
          }, result => {
            id = result.id
            this.selected.forEach(item => {
              item.pedidoProveedorId = result.id
            })
            http({e:JSON.parse(JSON.stringify(this.selected))}, result => {
              this.proveedor = null
              this.selected = []
              this.pedido = false
              this.cargar()
            }, e => {
              http({id:id}, result => {}, e => {}, 'pedidoProveedor/eliminar')
              this.$q.notify(e)
            }, 'detallePedidoProveedor/insertar')
          }, e => {
            this.$q.notify(e)
          }, 'pedidoProveedor/insertar')
        })
      } else {
        this.$q.notify('selecciona un producto')
      }      
    }
  }
}
</script>

<style>
</style>
