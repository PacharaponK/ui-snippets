import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'primeicons/primeicons.css'
import './styles/main.css'
import App from './App.vue'
import router from './router'

const ReadyAura = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
      },
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            success: {
              background: '{green.700}',
              borderColor: '{green.700}',
              hoverBackground: '{green.800}',
              hoverBorderColor: '{green.800}',
              activeBackground: '{green.900}',
              activeBorderColor: '{green.900}',
            },
            danger: {
              background: '{red.700}',
              borderColor: '{red.700}',
              hoverBackground: '{red.800}',
              hoverBorderColor: '{red.800}',
              activeBackground: '{red.900}',
              activeBorderColor: '{red.900}',
            },
          },
        },
      },
    },
  },
})

createApp(App)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: ReadyAura,
      options: { darkModeSelector: false },
    },
  })
  .mount('#app')
