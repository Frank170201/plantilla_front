/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { es } from "vuetify/locale";
import { COLORES_DEL_SITIO } from '@/config/app.colors';
// composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const light = {
  dark: false,
  colors: {
    ...COLORES_DEL_SITIO,
    background: '#F4F7FD',
    primary: '#3d1957',
    secondary: '#111C4E',
    accent: '#FF4081', // Color de acento para resaltar elementos adicionales si es necesario
    // Otros colores secundarios para títulos, botones, subtitulos, etc.
    title: '#333333',
    button: '#009688',
    subtitle: '#757575',
    paragraph: '#666666',
    blueDinac: '#252B58',
    blueLigthDinac: '#00B6F5',
    redDinac: '#bf0000',
    redInactive: '#FFB2B2',
    greenInactive: '#B2FFB2',
    greenDinac: '#009f00',
    warningDinac: '#FFB200',
    cyan: '#00A9D5',
    gray: '#E8EAEF',
    lightGray: '#9CA4AE',
    greenTheme: '#003734',
    grayBackground: '#F4F5F7',
    turquoise: '#00D6BD',
  },
}

const dark = {
  dark: true,
  colors: {
    ...COLORES_DEL_SITIO,
    primary: '#3d1957',
    //creame paleta de colores estilo dark para el color de fondo
    background: '#333333',
    secondary: '#111C4E',
    accent: '#FF4081', // Color de acento para resaltar elementos adicionales si es necesario
    // Otros colores secundarios para títulos, botones, subtitulos, etc.
    title: '#FFFFFF',
    colorButton: '#009688',
    subtitle: '#757575',
    paragraph: '#666666',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
      dark,
    },
  },
  locale: {
    locale: "es",
    messages: { es },
  },
})
