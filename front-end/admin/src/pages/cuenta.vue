<template>
  <q-page padding>
    <div class="fondo1 q-pa-md">
      <q-input color="yellow-7" v-model="nombre"  float-label="nombre"></q-input>
      <q-input color="yellow-7" type="email" v-model="correo" float-label="correo"></q-input>
      <q-btn-group class="q-mt-lg">
        <q-btn color="yellow-7" class="text-black" label="actualizar"></q-btn>
        <q-btn color="yellow-7" class="text-black" @click.native="mostrar=true" label="cambiar contraseña"></q-btn>
        <q-btn color="yellow-7" class="text-black" label="salir" @click.native="salir"></q-btn>
      </q-btn-group>
    </div>

    <q-modal v-model="mostrar">
      <div class="q-ma-md">
        <p>Cambio de contraseña</p>
        <q-input color="yellow-7" type="password" v-model="pass" float-label="Ingrese su contraseña"></q-input>
        <q-input color="yellow-7" type="password" v-model="pass1" float-label="Nueva contraseña"></q-input>
        <q-input color="yellow-7" type="password" v-model="pass2" float-label="Confirme la contraseña"></q-input>
        <div class="row justify-center">
          <q-btn-group class="q-mt-md">
            <q-btn color="yellow-7" class="text-black" label="cambiar" @click.native="cambiarPass"></q-btn>
            <q-btn color="yellow-7" class="text-black" label="cancelar" @click.native="mostrar=false;pass='';pass1='';pass2=''"></q-btn>
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
      id: '',
      nombre: '',
      correo: '',
      clave: '',
      pass: '',
      pass1: '',
      pass2: '',
      user: null,
      mostrar: false
    }
  },
  mounted(){
    let user = this.$q.localStorage.get.item('usuario')
    this.user = JSON.parse(JSON.stringify(user))
    if(user != null){
      this.correo = user.correo
      this.nombre = user.nombre
      this.clave = user.contraseña
      this.id = user.id
    }
  },
  methods:{
    actualizar(){
      doc = {
        id: this.id,
        nombre: this.correo,
        celular: '',
        contraseña: '',
        deshabilitado: false,
        uid: this.user.uid
      }
      http(doc, result => {
        this.user.nombre = this.nombre
        this.user.correo = this.correo
        this.$q.localStorage.set('usuario', JSON.parse(JSON.stringify(this.user)))
      }, e => {
        this.$q.notify(e)
      }, 'usuario/editar')
    },
    cambiarPass(){
      if(this.pass == this.clave){
        if(this.pass1 == this.pass2){
          let doc = {
            id: this.id,
            nombre: this.correo,
            celular: '',
            contraseña: this.pass1,
            deshabilitado: false,
            uid: this.user.uid
          }
          http(doc, result => {
            this.user.contraseña = this.pass1
            this.$q.localStorage.set('usuario', JSON.parse(JSON.stringify(this.user)))
            this.mostrar = false
            this.clave = this.pass1
            this.pass = ''
            this.pass1 = ''
            this.pass2 = ''
          }, e => {
            this.$q.notify(e)
          }, 'usuario/editar')
        }else{
          this.$q.notify('Las contraseñas no coinciden')
        }
      } else{
        this.$q.notify('La contraseña es incorrecta')
      }
    },
    salir(){
        let el = this
        this.$auth.signOut().then(function() {
          el.$q.localStorage.clear()
          el.$router.push('/')
        }).catch(function(error) {
          el.$q.notify(error)
          el.$q.localStorage.clear()
          el.$router.push('/')
        });
      }
  }
}
</script>

<style>
</style>
