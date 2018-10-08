<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <q-card class="card-login bg-white no-shadow">
          <q-card-title>
            Mr Tata
            <span slot="subtitle">Inicio de sesion</span>
          </q-card-title>
          <q-card-main class="q-px-xl">
            <br>
            <q-input v-model="correo" type="email" placeholder="Correo" clearable/>
            <br>
            <q-input v-model="clave" type="password" placeholder="Contraseña" clearable />
            <br>
            <q-btn class="no-shadow" label="Recuperar contraseña" style="padding:0"/>
          </q-card-main>
          <q-card-actions class="q-px-md q-pb-md q-pt-md row justify-center">
            <q-btn-group class="no-shadow ">
              <q-btn label="Iniciar sesion" :loading="loading" color="primary" @click.native="login" :disable="!isEmail(correo) || !(clave != null ? (clave.length > 0 ? true : false) : false)" />
              <q-btn label="Crear cuenta" class="no-margin" color="primary" @click.native="$router.push('/registro')"/>
            </q-btn-group>
          </q-card-actions>
        </q-card>
        <h4 class="text-center">Entrar con</h4>
        <div class="row justify-center">
          <q-btn-group class="no-shadow">
              <q-btn label="Facebook" style="background:#3b5998;color:white" @click.native="facebook"/>
              <q-btn label="Google" style="background:#dd4b39;color:white" @click.native="google"/>
            </q-btn-group>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  data() {
    return {
      correo: "",
      clave: "",
      loading: false
    };
  },
  beforeMount() {
    this.$nextTick(() => {
      let usuario = this.$q.localStorage.get.item("usuario");
      if (usuario) {
        this.$router.push("/app");
      }
    });
  },
  methods: {
    login() {
      let el = this;
      this.loading = true;
      this.$auth
        .signInWithEmailAndPassword(this.correo, this.clave)
        .then(result => {
          let user = result.user;
          let datos = {
            nombre: user.displayName,
            correo: user.email,
            celular: user.phoneNumber,
            fotoURL: user.photoURL,
            uid: user.uid,
            rol: "cliente"
          };
          el.registroSocial(datos);
        })
        .catch(function(error) {
          el.loading = false;
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
    facebook() {
      var provider = new firebase.auth.FacebookAuthProvider();
      this.prepararRegistroSocial(provider);
    },
    google() {
      var provider = new firebase.auth.GoogleAuthProvider();
      this.prepararRegistroSocial(provider);
    },
    prepararRegistroSocial(provider) {
      let el = this;

      if (this.$q.platform.is.cordova) {
        this.$auth.signInWithRedirect(provider).then(result => {
          //var token = result.credential.accessToken;
          setTimeout(() => {
            return el.$auth
              .getRedirectResult()
              .then(result => {
                var user = result.user;
                let datos = {
                  nombre: user.displayName,
                  correo: user.email,
                  celular: user.phoneNumber,
                  fotoURL: user.photoURL,
                  uid: user.uid,
                  rol: "cliente"
                };
                el.registroSocial(datos);
              })
              .catch(error => {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
                el.$q.notify(errorMessage);
              });
          }, 2000);
        });
      } else {
        this.$auth
          .signInWithPopup(provider)
          .then(result => {
            //var token = result.credential.accessToken;
            var user = result.user;
            let datos = {
              nombre: user.displayName,
              correo: user.email,
              celular: user.phoneNumber,
              fotoURL: user.photoURL,
              uid: user.uid,
              rol: "cliente"
            };
            el.registroSocial(datos);
          })
          .catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            el.$q.notify(errorMessage);
          });
      }
    },
    registroSocial(datos) {
      this.$axios
        .post("http://142.44.242.71/usuario/social", datos)
        .then(result => {
          if (result.data.error == false) {
            let user = result.data.datos;
            if(user.rol == 'cliente'){
              this.$q.localStorage.set("usuario", user);
              this.$router.push("/app");
            }else{
              this.$q.notify('No eres cliente')
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
.card-login {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}
</style>
