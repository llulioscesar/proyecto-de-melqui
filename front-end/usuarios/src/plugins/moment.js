import VueMoment from 'vue-moment'
import moment from 'moment'
import 'moment/locale/es'

export default ({ Vue }) => {
    moment.locale('es')
    Vue.use(VueMoment,{
        moment
    });
}