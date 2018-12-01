<template>
  <q-page padding>
    <q-list link no-border inset-separator class="fondo1">
      <q-item @click.native="isDatos=true">
        <q-item-main>
          <q-item-tile label>Actualizar datos personales</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item @click.native="isCorreo=true">
        <q-item-main>
          <q-item-tile label>Cambiar correo</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main @click.native="isPass=true">
          <q-item-tile label>Cambiar contraseña</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item @click.native="salir">
        <q-item-main>
          <q-item-tile label>Cerrar sesion</q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>

    <q-modal v-model="isCorreo" minimized no-esc-dismiss no-backdrop-dismiss>
      <div class="q-pa-md">
        <q-field v-if="usuario!= null" label="Correo actual">
          {{usuario.correo}}
        </q-field>
        <br>
        <q-field label="Nuevo correo">
          <q-input color="yellow-7" type="email" v-model="temCorreo"/>
        </q-field>

        <div class="row justify-center q-mt-md">
          <q-btn-group>
            <q-btn :disabled="!isEmail(temCorreo)" color="yellow-7" class="text-black" label="actualizar" @click.native="actualizarCorreo"/>
            <q-btn color="yellow-7" class="text-black" label="cerrar" @click.native="isCorreo = false;temCorreo=''"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>

    <q-modal v-model="isPass" minimized no-esc-dismiss no-backdrop-dismiss>
      <div class="q-pa-md">
        <q-field v-if="usuario!= null" label="Contraseña actual">
          <q-input color="yellow.-7" type="password" v-model="temPass"/>
        </q-field>
        <br>
        <q-field label="Nuevo contraseña">
          <q-input color="yellow-7" type="password" v-model="pass1"/>
        </q-field>
        <br>
        <q-field label="Confirmar contraseña">
          <q-input color="yellow-7" type="password" v-model="pass2"/>
        </q-field>

        <div class="row justify-center q-mt-md">
          <q-btn-group>
            <q-btn color="yellow-7" class="text-black" label="actualizar" @click.native="actualizarPass"/>
            <q-btn color="yellow-7" class="text-black" label="cerrar" @click.native="isPass = false;temPass='';pass1='';pass2=''"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>

    <q-modal v-model="isDatos" minimized no-esc-dismiss no-backdrop-dismiss>
      <div class="q-pa-md" v-if="usuario!= null">
        <q-field  label="Cedula">
          <q-input color="yellow-7" v-model="usuario.cedula"/>
        </q-field>
        <br>
        <q-field label="Celular">
          <q-input color="yellow-7" v-model="usuario.celular"/>
        </q-field>
        <br>
        <q-field label="Nombre">
          <q-input color="yellow-7" v-model="usuario.nombre"/>
        </q-field>
        <q-field label="Direccion">
          <q-input color="yellow-7" v-model="usuario.direccion"/>
        </q-field>

        <div class="row justify-center q-mt-md">
          <q-btn-group>
            <q-btn color="yellow-7" class="text-black" label="actualizar" @click.native="actualizarDatos"/>
            <q-btn color="yellow-7" class="text-black" label="cerrar" @click.native="isDatos = false"/>
          </q-btn-group>
        </div>
      </div>
    </q-modal>

  </q-page>
</template>

<script>
import http from 'src/funciones/http'
export default {
  data(){
    return{
      isCorreo: false,
      usuario: null,
      temCorreo: '',
      isPass: false,
      temPass: '',
      pass1: '',
      pass2: '',
      isDatos: false
    }
  },
  beforeMount(){
    this.$mqtt.unsubscribe('app/+')
  },
  mounted(){
    this.usuario = JSON.parse(JSON.stringify(this.$q.localStorage.get.item('usuario')))
  },
  mqtt:{
      'app/+' (data, tema){
        let msj = String.fromCharCode.apply(null, data)
        
        if(tema == 'app/' + this.$auth.currentUser.uid){
          this.salir()
        }
      }
    },
  methods: {
    salir(){
      let el = this
      this.$auth.signOut().then(function() {
        el.$q.localStorage.clear()
        el.$router.push('/')
      }).catch(function(error) {
        el.$q.notify(error)
      });
    },
    isEmail(correo) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(correo);
    },
    actualizarCorreo(){
      let datos = {
        id: this.usuario.id,
        nombre: this.usuario.nombre,
        correo: this.temCorreo,
        deshabilitado: false,
        celular: '',
        contraseña: '',
        uid: this.usuario.uid
      }
      http('usuario/editar', datos, result => {
        this.usuario.correo = this.temCorreo
        this.usuario.correoVerificado = false
        this.$q.localStorage.set('usuario', JSON.parse(JSON.stringify(this.usuario)))
        this.temCorreo = ''
        this.isCorreo = false
      }, e => {
        this.$q.notify(e)
      })
    },
    actualizarPass(){
      let datos = {
        id: this.usuario.id,
        nombre: this.usuario.nombre,
        correo: this.usuario.correo,
        deshabilitado: false,
        celular: '',
        contraseña: this.pass1,
        uid: this.usuario.uid
      }

      if(this.temPass != this.usuario.contraseña){
        this.$q.notify('Contraseña incorrecta')
      } else if(this.pass1 != this.pass2){
        this.$q.notify('Las contraseña no coinciden')
      } else if(this.pass1.length < 6 || this.pass2.length < 6){
        this.$q.notify('La contraseña debe tener minimo 6 caracteres')
      } else {
          http('usuario/editar', datos, result => {
            this.usuario.contraseña = this.pass1
            this.$q.localStorage.set('usuario', JSON.parse(JSON.stringify(this.usuario)))
            this.temPass = ''
            this.pass1 = ''
            this.pass2 = ''
            this.isPass = false
          }, e => {
            this.$q.notify(e)
          })
      }
    },
    actualizarDatos(){

      let datos = {}

      if(this.usuario.cedula == undefined){
        datos.cedula = null
        this.usuario.cedula = null
      }
      if(this.usuario.direccion == undefined){
        datos.direccion = null
        this.usuario.direccion = null
      }

      datos = {
        id: this.usuario.id,
        nombre: this.usuario.nombre,
        correo: this.usuario.correo,
        deshabilitado: false,
        celular: this.usuario.celular,
        contraseña: '',
        uid: this.usuario.uid,
        cedula: this.usuario.cedula,
        direccion: this.usuario.direccion
      }
      if(datos.celular == null){
        datos.celular = ''
      }

      console.log(datos)

      if(this.usuario.cedula == '' || this.usuario.cedula == null || this.usuario.cedula == undefined){
        this.$q.notify('Proporciona tu documento de identificacion')
      } else if(this.usuario.nombre == '' || this.usuario.nombre == null || this.usuario.nombre == undefined){
        this.$q.notify('Proporciona un nombre')
      }else if(this.usuario.direccion == '' || this.usuario.direccion == null || this.usuario.direccion == undefined){
        this.$q.notify('Proporciona una direccion')
      }else if(this.usuario.celular != '' && this.usuario.celular != null){
        if(this.usuario.celular.length < 10){
          this.$q.notify('Numero de celular incompleto')
        }
      } else {
        http('usuario/editar', datos, result => {
            this.$q.localStorage.set('usuario', JSON.parse(JSON.stringify(this.usuario)))
            this.isDatos = false
          }, e => {
            this.$q.notify(e)
          })
      }

    }
  }
}
</script>

<style>
</style>
