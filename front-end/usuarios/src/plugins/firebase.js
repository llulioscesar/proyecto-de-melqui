import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/firestore'

const config = {
    apiKey: "AIzaSyDC64xVJLZPTZ-XcQO8ePlpvSTLNX4gKaU",
    authDomain: "melqui-227ec.firebaseapp.com",
    databaseURL: "https://melqui-227ec.firebaseio.com",
    projectId: "melqui-227ec",
    storageBucket: "melqui-227ec.appspot.com",
    messagingSenderId: "832016256201"
}

export const  fireApp = firebase.initializeApp(config)

export const AUTH = fireApp.auth()

export const FIRESTORE = fireApp.firestore()

export default ({ Vue }) => {
    FIRESTORE.settings({ timestampsInSnapshots: true })

    AUTH.languageCode = 'es_ES';

    Vue.prototype.$auth = AUTH
    Vue.prototype.$firestore = FIRESTORE
}