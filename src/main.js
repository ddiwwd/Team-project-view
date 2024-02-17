/* eslint-disable import/order */
import '@/@fake-db/db'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import friend from '@/views/pages/user-profile/friend/index.vue'
import '@core/scss/template/index.scss'

import 'bootstrap'
import { createApp } from 'vue'
import store from './store'



// import 'bootstrap/dist/css/bootstrap.min.css'
//import { createPinia } from 'pinia'

//알람용 firebase import
import firebase from 'firebase/app'
import 'firebase/messaging'

//알람용 firebase import end


// Create vue app
const app = createApp(App)


app.component('Friend', friend)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.use(store)

//app.use(xroute)
// Mount vue app
app.mount('#app')

//웹, 앱 알람 (서비스 워커 안에 파이어베이스 SDK 삽입)
const firebaseConfig = {
  apiKey: "AIzaSyDaoRQlGo6oghhkTmRIqrqEPWofr1BSm9E",
  authDomain: "webpushtest-c99b3.firebaseapp.com",
  projectId: "webpushtest-c99b3",
  storageBucket: "webpushtest-c99b3.appspot.com",
  messagingSenderId: "992191789757",
  appId: "1:992191789757:web:5c7cbed7fbfccf2355d5d4",
  measurementId: "G-N7SX341HTV",
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

var messaging = firebase.messaging()
console.log('일반 messaging:', messaging)

Notification.requestPermission().then(permission=>{
  if (permission=='granted') {
    console.log('have permission')
    
  } else{
    console.log('FCM rejected by user')
  }
})
 
messaging = firebase.messaging(firebaseApp)
console.log('firebase.messaging(firebaseApp):', messaging)

if('serviceWorker' in navigator) {
  window.addEventListener('load', ()=>{
    return navigator.serviceWorker.register('sw.js') //포그라운드에서 실행될 파일
      .then(registration=>{
        console.log('등록 완료', registration)
        
        return messaging.getToken(messaging, { vapidKey: "BIa23R2xZe0qRZYDcY5aXlxcBOFiujw7Vs-RLTPwEjQqmXAFgXNjRfWjBrjN_E0WWg6yUMmXncdutQN8zG6x2wY" })
      })
      .then(token=>{console.log(token)})
      .catch(err=>console.error(err))
  })
  
}

messaging.onMessage(payload => {
  console.log("Message received. ", payload)
  if (Notification.permission === "granted") {
    navigator.serviceWorker.ready
      .then(registration => {
        registration
          .showNotification("알림", {
            body: "블라블라",
            icon: "favicon.ico",
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: "vibration-sample",
          })
          .finally(arg => console.log(arg))
      })
      .catch(err => {
        console.log(err)
      })
  }
})

//#4. 브라우저 백그라운드 진입시 사용할 파일 적용
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("ServiceWorker registration successful with scope: ")
    })
}
