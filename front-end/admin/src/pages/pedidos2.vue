<template>
  <q-page padding>


    <div class="row q-mb-lg q-pa-md items-center fondo1" >
      <div class="col-xs-12 col-md-3">
        <q-datetime color="yellow" class="q-mx-md" stack-label="fecha inicial" v-model="f1" type="date" @change="cambiarF1"/>
      </div>
      <div class="col-xs-12 col-md-3">
        <q-datetime color="yellow" class="q-mx-md" stack-label="fecha final" v-model="f2" type="date" @change="cambiarF2"/>
      </div> 
    </div>

    <q-table class="fondo1" :data="objs" :columns="columns" :filter="search">

      <template slot="top-left" slot-scope="props">
        <q-search hide-underline placeholder="Buscar" color="yellow-7" v-model="search" />
      </template>

      <template slot="body" slot-scope="props" :props="props">
         <q-tr @click.native="verPedido(props.row)" :props="props" :class="(props.row.stock <= 10 ? 'bg-red-1' : (props.row.stock > 10 && props.row.stock <= 100 ? 'bg-yellow-1' : ''))">
          <q-td :props="props" key="id">
            {{props.row.id}}
          </q-td>
          <q-td :props="props" key="fecha">
            {{$moment.unix(props.row.fecha).format('DD [de] MMMM [de] YYYY')}}
          </q-td>
          <q-td :props="props" key="proveedor">
            {{props.row.proveedor.nombre}}
          </q-td>
          <q-td :props="props" key="nit">
            {{props.row.proveedor.nit}}
          </q-td>
          <q-td :props="props" key="estado">
            {{props.row.cancelado ? 'Cancelado' : props.row.pendiente ? 'Pendiente': 'Recibido'}}
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
      objs: [],
      search: '',
      f1:0,
      f2:0,
      fecha1:0,
      fecha2:0,
      columns:[
        {
          name:'id',
          field: 'id',
          label: 'Id',
          sortable: true,
          align: 'left'
        },
        {
          name:'fecha',
          field: 'fecha',
          label: 'fecha',
          sortable: false,
          align: 'left'
        },
        {
          name: 'proveedor',
          label: 'Proveedor',
          field: row => row.proveedor.nombre,
          align: 'left',
          sortable: true
        },
        {
          name: 'nit',
          label: 'nit',
          field: row => row.proveedor.nit,
          align: 'left',
          sortable: true
        },
        {
          name: 'estado',
          label: 'estado',
          align: 'left',
          sortable: true
        }
      ]
    }
  },
  beforeMount(){
    this.$nextTick(() => {
      let f1 = this.$moment().startOf('day')
      let f2 = this.$moment(f1).subtract(30, 'days')
      this.f2 = f1.toDate()
      this.f1 = f2.toDate()
      this.fecha1 = f2.unix()
      this.fecha2 = f1.unix()
      this.cargar()
    })
  },
  methods: {
    cargar(){
      http({fecha1:this.fecha1, fecha2:this.fecha2}, result => {
        this.objs = JSON.parse(JSON.stringify(result))
      }, e => {
        this.$q.notify(e)
      }, 'pedidoProveedor/listar')
    },
    cambiarF1(date){
      this.fecha1 = this.$moment(date).startOf('day').unix()
      this.cargar()
    },
    cambiarF2(date){
      this.fecha2 = this.$moment(date).startOf('day').unix()
      this.cargar()
    },
    verPedido(row){
      this.$q.localStorage.remove('pedido2')
      let doc = JSON.parse(JSON.stringify(row))
      http({id: doc.id}, result => {
        doc.detalle = JSON.parse(JSON.stringify(result))
        this.$q.localStorage.set('pedido2', doc)
        this.$router.push('/app/pedido2')
      }, e => {
        this.$.notify(e)
      }, 'detallePedidoProveedor/listar')
    }
  },
}
</script>

<style>
</style>
