import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: { 
    dark: true,
    themes: {
      light: {
        primary: '#CE9440',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#E53935'
      },
      dark: {
        primary: '#CE9440',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#E53935'
      }
    }
  }
});