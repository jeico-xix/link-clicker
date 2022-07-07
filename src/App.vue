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
        :errors="errors"
        :loading="loading"
        @login="login"
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
      loading: false,
      is_logged_in: false,
      errors: []
    }
  },

  mounted() {
    console.log(this.$store.state)
    this.is_logged_in = Boolean(localStorage.getItem('is_logged_in'));
  },
  
  methods: {
    login(data) {
      this.loading = true;
      this.errors = []
      this.$http.post('/admins/login', data).then(response => {
        this.loading = false;

        const token = response.data.token;
        localStorage.setItem('token', token)

        this.is_logged_in = true;
        localStorage.setItem('is_logged_in', this.is_logged_in)
        
        this.$http.defaults.headers.common = { 'Authorization': `bearer ${token}` }

        this.$store.commit('setAuthentication', true)
        this.$router.replace('/sites');
      }).catch(error => {
        this.loading = false;
        if (error.code === 'ERR_NETWORK') {
          this.errors.push({
            'message': 'Something went wrong'
          })
        } else if (error.response) {
          this.errors.push({
            'message': error.response.data
          })
        }
      });
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
