import VueMqtt from 'vue-mqtt';
import {LocalStorage} from 'quasar'

var broken = 'clientWeb' + Math.random().toString(16).substr(2, 8);
const broken2 = LocalStorage.get.item('broken');

if (broken2 !== null) {
  broken = broken2;
}
else {
  LocalStorage.set('broken', broken)
}

export default ({ Vue }) => {

    let options = {
        clientId: broken,
        qos: 1,
        clean: false
    }

    Vue.use(VueMqtt, 'ws://142.44.242.71:1884', options);
}