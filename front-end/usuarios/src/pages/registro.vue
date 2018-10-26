<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <q-card class="card-login bg-white no-shadow">
          <q-card-title>
            Mr Tata
            <span slot="subtitle">Cuenta nueva</span>
          </q-card-title>
          <q-card-main class="q-px-xl">
            <form>
            <q-input v-model="nombre" type="text" placeholder="Nombre" clearable/>
            <br>
            <q-input v-model="cedula" type="number" placeholder="Cedula" clearable/>
            <br>
            <q-input v-model="direccion" type="text" placeholder="Direccion" clearable/>
            <br>
            <q-input v-model="celular" type="number" placeholder="Numero de Celular" clearable/>
            <br>
            <q-input v-model="correo" type="email" placeholder="Correo" clearable/>
            <br>
            <q-input v-model="clave" type="password" placeholder="Contraseña" clearable />
            <br>
            <q-input v-model="clave2" type="password" placeholder="Repita la contraseña" clearable />
            <br>
            <vue-recaptcha v-if="!$q.platform.is.cordova" ref="recaptcha" @verify="onVerify" @expired="onExpired" :sitekey="'6LcXo3EUAAAAAKcmGj4Vf1ftxoremGwlHS4xWkY_'"></vue-recaptcha>
            </form>
          </q-card-main>
          <q-card-actions class="q-px-md q-pb-md q-pt-md row justify-center">
            <q-btn-group class="no-shadow ">
              <q-btn label="Iniciar sesion" :loading="loading" color="primary" @click.native="$router.push('/')"/>
              <q-btn label="Crear cuenta" class="no-margin" color="primary" @click.native="registrar"/>
            </q-btn-group>
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import http from "src/funciones/http";
import VueRecaptcha from "vue-recaptcha";
export default {
  components: { "vue-recaptcha": VueRecaptcha },
  data() {
    return {
      loading: false,
      nombre: "",
      cedula: "",
      celular: "",
      direccion: "",
      correo: "",
      clave: "",
      clave2: "",
      captcha: null
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
    validar() {
      if(this.$q.platform.is.cordova){
        this.captcha = 'cordova'
      }
      let ok = false;
      if (this.nombre == "") {
        this.$q.notify("Ingresa tu nombre");
      } else if (this.cedula == "") {
        this.$q.notify("Ingresa tu cedula");
      } else if (this.direccion == "") {
        this.$q.notify("Ingresa tu direccion");
      } else if (this.celular == "") {
        this.$q.notify("Ingresa tu numero de celular");
      } else if (!this.isEmail(this.correo)) {
        this.$q.notify("Ingresa tu correo electronico");
      } else if (this.clave == "") {
        this.$q.notify("Ingresa una contraseña");
      } else if (this.clave2 == "") {
        this.$q.notify("Confirma tu contraseña");
      } else if (this.clave != this.clave2) {
        this.$q.notify("Las contraseña no son iguales");
      } else if (this.captcha == null) {
        this.$q.notify("Verifica que no eres un robot");
      } else {
        ok = true;
      }

      return ok;
    },
    isEmail(correo) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(correo);
    },
    isNullOrEmpty(string) {
      return string == null || string.length || string == 0;
    },
    registrar() {
      if (this.validar()) {
        http(
          "usuario/insertar",
          {
            correo: this.correo,
            nombre: this.nombre,
            direccion: this.direccion,
            celular: this.celular,
            cedula: this.cedula,
            contraseña: this.clave,
            rol: "cliente",
            uid: null
          },
          result => {
            if(result.datos != null){
              this.$router.push('/')
            }
          },
          e => {
            this.$q.notify(e)
          }
        );
      }
    },
    onVerify: function(response) {
      this.captcha = response;
    },
    onExpired: function() {
      this.captcha = null;
      this.resetRecaptcha();
    },
    resetRecaptcha() {
      this.$refs.recaptcha.reset(); // Direct call reset method
    }
  }
};
</script>

<style>
</style>
