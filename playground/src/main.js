import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faChartLine, faShareFromSquare } from '@fortawesome/free-solid-svg-icons'
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faGithub)
library.add(faChartLine)
library.add(faShareFromSquare)
library.add(faCircleQuestion)
console.log(faShareFromSquare)

const app = createApp(App)
app.component('v-icon', FontAwesomeIcon)
app.mount('#app')
