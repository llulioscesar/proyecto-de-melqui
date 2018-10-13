<template>
<q-layout>
  <q-page-container>
    <img class="login-background" src="statics/entrar.jpg"/>
    <q-page padding class="flex flex-center">
      <q-card class="card-login bg-white shadow-4" >
        <q-card-title>
          Bar Mister Tata
          <span slot="subtitle">Inicio de sesion</span>
        </q-card-title>
        <q-card-main class="q-px-xl">
          <br>
          <q-input v-model="correo" type="email" placeholder="Correo" clearable/>
          <br>
          <q-input v-model="clave" @keyup.enter="login" type="password" placeholder="Contraseña" clearable />
          <br>
        </q-card-main>
        <q-card-actions class="q-px-md q-pb-md q-pt-md bg-grey-3">
          <q-btn-group class="no-shadow">
            <q-btn label="Iniciar sesion" :loading="loading" color="primary" @click="login" :disable="!isEmail(correo) || !(clave != null ? (clave.length > 0 ? true : false) : false)"/>
            <q-btn label="Recuperar contraseña"/>
          </q-btn-group>
        </q-card-actions>
      </q-card>
    </q-page>
  </q-page-container>
</q-layout>
</template>

<script>
import { setInterval } from 'timers';
export default {
  data() {
    return {
      correo: "",
      clave: "",
      loading: false,
    }
  },
  methods: {
    login() {
      let el = this
      this.loading = true
      this.$auth
        .signInWithEmailAndPassword(this.correo, this.clave)
        .then(result => {
          let user = result.user
          let datos = {
              nombre: user.displayName,
              correo: user.email,
              celular: user.phoneNumber,
              fotoURL: user.photoURL,
              uid: user.uid,
              rol: "admin"
            };
          this.registroSocial(datos)
        })
        .catch(function(error) {
          el.loading = false
          var errorCode = error.code;
          let msj = "";
          switch (errorCode) {
            case "auth/user-not-found":
              msj =
                "No existe ningún registro de usuario que corresponda al identificador proporcionado.";
              break;
            case "auth/invalid-email":
              msj =
                "El correo que se proporcionó debe ser una dirección de correo electrónico";
              break;
            case "auth/wrong-password":
              msj =
                "La contraseña no es válida o el usuario no tiene una contraseña.";
              break;
            default:
              msj = error.message;
              break;
          }
          el.$q.notify({
            message: msj,
            type: "negative",
            timeout: 6000
          });
        }); 
    },
    isEmail(correo) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(correo);
    },
    registroSocial(datos) {
      this.$axios
        .post("http://142.44.242.71/usuario/social", datos)
        .then(result => {
          if (result.data.error == false) {
            let user = result.data.datos;
            if(user.rol == 'admin'){
              this.$q.localStorage.set("usuario", user);
              this.$router.push("/app");
            }else{
              this.$q.notify('No eres admin')
            }
          } else {
            this.$q.notify(result.data.mensaje);
          }
        })
        .catch(e => {
          console.log(e);
          this.$q.notify("No se pudo establecer conexion");
        });
    }
  }
};
</script>
<style>
.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
   object-fit: cover;
      object-position: center center;
}
.card-login {
  max-width: 500px;
  width: 100%;
}
</style>