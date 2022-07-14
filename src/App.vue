<template>
  <v-app
    class="red lighten-4"
  >
    <the-navbar
      v-if="is_logged_in"
      @logout="logout"
    />
    <v-main class="mx-4 mb-4">
      <router-view
        :error="error"
        :is-loading="is_loading"
        @login="login"
        @logout="is_logged_in = false"
      />
    </v-main>
  </v-app>
</template>

<script>
import TheNavbar from './components/TheNavbar.vue';

export default {
  name: 'App',
  components: {
    TheNavbar
  },
  data() {
    return {
      is_loading: false,
      is_logged_in: false,
      error: ''
    }
  },

  mounted() {
    this.is_logged_in = Boolean(localStorage.getItem('is_logged_in'));
  },
  
  methods: {
    async login(data) {
      try {
        this.is_loading = true
        const response = await this.$http.post('/admins/login', data);
        const token = response.data.token;
        localStorage.setItem('token', token)

        this.is_logged_in = true;
        localStorage.setItem('is_logged_in', this.is_logged_in)
        
        this.$http.defaults.headers.common = { 'Authorization': `bearer ${token}` }
        
        this.$store.commit('setAuthentication', true)
        this.$router.replace('/sites');

        this.is_loading = false
      } catch (error) {
        this.is_loading = false
        this.error = error.response.data
      }
    },
    
    logout() {
      this.is_logged_in = false;
      const key = 'is_dark_mode'
      const isDarkMode = localStorage.getItem(key);
      localStorage.clear();
      localStorage.setItem(key, isDarkMode);
      this.$http.defaults.headers.common = { 'Authorization': '' }
      this.$router.push('/login');
    }
  }
};
</script>