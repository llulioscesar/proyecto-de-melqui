<template>
<q-layout>
  <q-page-container class="q-py-md" style="font-size:12px;max-width:80mm;width:100%;margin:auto">
    <p class="no-margin" style="max-width:80mm;text-overflow: clip;white-space: nowrap;overflow: hidden;">=======================================================================</p>
    <p class="text-center no-margin">Bar Mister Tata</p>
    <p class="text-center no-margin">Calle 5 No. 19-49 - Aguachica Cesar</p>
    <p class="text-center no-margin">Nit. 49665153-0</p>
    <p class="no-margin" style="max-width:80mm;text-overflow: clip;white-space: nowrap;overflow: hidden;">=======================================================================</p>
    <br>
    <p class="text-center no-margin">Fecha de expedicion: {{$moment.unix(fecha).format('MMMM DD [de] YYYY')}}</p>
    <br>
    <div class="row items-center justify-center">
      <table style="border-spacing: 5px;border-collapse: separate;">
      <tr>
          <th style="border-bottom:1pt dashed black;" align="left">Descripcion</th>
          <th style="border-bottom:1pt dashed black;" align="right">Vlr Unt.</th>
          <th style="border-bottom:1pt dashed black" align="center">Cnt</th>
          <th style="border-bottom:1pt dashed black;" align="right">Valor</th>
      </tr>
      <tr v-for="(item, i) in detalle" :key="i">
        <td align="left">{{(item.producto.nombre + ' ' + item.producto.descripcion)}}</td>
        <td align="right">{{(parseFloat(item.precio)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}</td>
        <td align="center">{{item.cantidad}}</td>
        <td align="right">{{(parseFloat(item.total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}</td>
      </tr>
      <tr>
          <th style="border-top:1pt dashed black;">&nbsp;&nbsp;&nbsp;</th>
          <th style="border-top:1pt dashed black;" align="left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
          <th style="border-top:1pt dashed black" align="center">&nbsp;&nbsp;&nbsp;</th>
          <th style="border-top:1pt dashed black;" align="right">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
      </tr>
    </table>
    </div>
    <p class="text-center no-margin" style="font-size:14px"><strong>Total: {{(parseFloat(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}}</strong></p>
    <br>
    <p class="text-center no-margin">Cliente: {{cliente.nombre}}</p>
    <p class="text-center no-margin">Cedula/Nit: {{cliente.cedula}}</p>
    <br>
    <p class="no-margin" style="max-width:80mm;text-overflow: clip;white-space: nowrap;overflow: hidden;">=======================================================================</p>
    <p class="text-center no-margin" style="font-size:10px">PROHIBIDA LA VENTA DE LICOR A MENORES DE EDAD</p>
    <p class="no-margin" style="max-width:80mm;text-overflow: clip;white-space: nowrap;overflow: hidden;">=======================================================================</p>
  </q-page-container>
</q-layout>
  
</template>

<script>
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}
import {LocalStorage} from 'quasar'
export default {
  data(){
    return {
      fecha: 0,
      detalle: [],
      cliente: {
        label: '',
        sublabel: ''
      },
      total: 0
    }
  },
  beforeMount(){
    this.$nextTick(() => {
      if(LocalStorage.get.item('pedido') == null){
        this.$router.push('/app/pedido')
      }
    })
  },
  mounted(){
    let tem = LocalStorage.get.item('pedido')
    this.fecha = tem.fecha
    this.detalle = tem.detalle
    this.cliente = tem.cliente
    this.total = tem.total
    setTimeout(()=> {
      if(LocalStorage.get.item('pedido') != null){
        window.print()
      }
    },500)
  }
}
</script>

<style>
@page 
    {
        size: auto;   /* auto is the initial value */
        margin: 0mm;  /* this affects the margin in the printer settings */
    }
</style>
