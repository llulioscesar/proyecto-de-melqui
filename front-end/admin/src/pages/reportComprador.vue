<template>
  <q-layout view="hHh Lpr lFf" style="background:rgb(82,86,89)">
    <q-page-container>
      <q-layout-header>
        <q-toolbar color="yellow" class="text-black">
          <q-btn class="no-shadow" icon="arrow_back" @click="$router.push('/app')"></q-btn>
          <q-toolbar-title>
            Mr Tata
            <div slot="subtitle">Reporte Ventas</div>
          </q-toolbar-title>
        </q-toolbar>
      </q-layout-header>
      <q-page padding>
        <div id="pdf" ref="pdf" class="bg-white q-py-xs q-px-md" style="max-width:720px;width:100%;margin:auto;">
          <h5>Reporte Ventas</h5>
          <div v-for="(item,i) in info" :key="i" class="q-pa-md ritem q-mb-lg" style="border:1px solid black">
            <p><strong>Fecha:</strong> {{$moment.unix(item.fecha).format('DD [de] MMMM [de] YYYY')}} </p>
            <p class="q-mt-xs"><strong>Cliente:</strong> {{item.usuario.nombre}}</p>
            <table class="q-mt-md q-mb-xs" style="width:100%">
            <tr>
              <th class="text-left">Referencia</th>
              <th class="text-left">Producto</th>
              <th class="text-right">Precio</th>
              <th class="text-center">Cantidad</th>
              <th class="text-right">Subtotal</th>
            </tr>
            <tr v-for="(detalle, j) in item.detallePedidos" :key="j">
              <td class="text-left" style="border-bottom:1px dashed black;">{{detalle.producto.referencia}}</td>
              <td class="text-left" style="border-bottom:1px dashed black;">{{detalle.producto.nombre}}</td>
              <td class="text-right" style="border-bottom:1px dashed black;">{{$currency.format(detalle.precio)}}</td>
              <td class="text-center" style="border-bottom:1px dashed black;">{{detalle.cantidad}}</td>
              <td class="text-right" style="border-bottom:1px dashed black;">{{$currency.format(detalle.total)}}</td>
            </tr>
          </table>
          <p><strong>Total:</strong> {{ $currency.format(item.total)}}</p>

          </div>
          
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { setTimeout } from 'timers';
export default {
  data(){
    return{
      info:[]
    }
  },
  mounted(){
    this.info = JSON.parse(JSON.stringify(this.$q.localStorage.get.item('infoComprador')))
    console.log(this.info)

    let el = this

    setTimeout(() => {

      const filename  = 'Reporte-' + Date.now() + '.pdf';
      let quality = 1

      html2canvas(document.querySelector('#pdf'), {scale: quality}).then(canvas => {
        let origen = canvas
        
        console.log(origen.height)

        let pdf = new jsPDF('p', 'pt', 'a4');

        for(let i = 0; i < document.querySelector('#pdf').clientHeight/980; i++){
          var sX      = 0;
          var sY      = 1130*i; // start 980 pixels down for every new page
          var sWidth  = 778;
          var sHeight = 1130;
          var dX      = 0;
          var dY      = 0;
          var dWidth  = 778;
          var dHeight = 1130;

          window.onePageCanvas = document.createElement("canvas");
          onePageCanvas.style.margin = 0;
          onePageCanvas.style.display = 'block'
          onePageCanvas.style.border = 'none!important'
          onePageCanvas.setAttribute('width', 778);
          onePageCanvas.setAttribute('height', 1120);
          var ctx = onePageCanvas.getContext('2d');


          ctx.drawImage(origen,sX,sY,sWidth,sHeight,28,dY,dWidth,dHeight);

          var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

          var width         = onePageCanvas.width;
          var height        = onePageCanvas.clientHeight;
          
          if (i > 0) {
            pdf.addPage(595, 842);
          }

          pdf.setPage(i+1);
          pdf.addImage(canvasDataURL, 'PNG', 14, 14, (width*.72), (height*.71))
        }
        
        
        pdf.save(filename);
      });
      
    }, 1000)
  }
}
</script>

<style>
.ritem p{
  margin: 0;
}
</style>
