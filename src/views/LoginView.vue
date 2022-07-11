<template>
  <v-container
    fill-height
  >
    <v-layout
      justify-center
      align-center
    >
      <v-form
        ref="form"
        v-model="isValid"
        lazy-validation
        @submit.prevent="submit"
      >
        <v-card
          class="elevation-12"
          width="400px"
        >
          <v-card-text class="flex justify-center">
            <v-img
              class="mt-3"
              position="center center"
              lazy-src="http://wing-game.com/img/wing.3972f9d7.png"
              height="60"
              contain
              src="http://wing-game.com/img/wing.3972f9d7.png"
            />
          </v-card-text>
          <v-container>
            <v-card-text>
              <div
                v-for="error in errors"
                :key="error.message"
              >
                <v-alert
                  dense
                  outlined
                  type="error"
                >
                  {{ error.message }}
                </v-alert>
              </div>

              <v-text-field
                v-model="username"
                outlined
                prepend-inner-icon="mdi-account"
                name="username"
                label="Username"
                type="text"
                :rules="usernameRules"
                :counter="15"
                required
                autocomplete="off"
              />
              <v-text-field
                id="password"
                v-model="password"
                outlined
                prepend-inner-icon="mdi-lock"
                name="password"
                label="Password"
                :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="isShowPassword ? 'text' : 'password'"
                :rules="passwordRules"
                required
                @click:append="isShowPassword = !isShowPassword"
              />
              <v-btn
                block
                :disabled="!isValid"
                color="primary"
                type="submit"
                x-large
                :loading="loading"
              >
                Login
              </v-btn>
            </v-card-text>
          </v-container>
        </v-card>
      </v-form>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'LoginView',
  props: {
    errors: Array,
    loading: Boolean
  },
  data: () => ({
    isValid: false,
    isShowPassword: false,
    username: '',
    password: '',
    usernameRules: [
      v => !!v || 'Username is required',
      v => v.length <= 15 || 'Username must be less than 15 characters'
    ],
    passwordRules: [
      v => !!v || 'Password is required'
    ]
  }),

  mounted() {
    this.isValid = false
    const isLoggedIn = Boolean(localStorage.getItem('is_logged_in'));

    if (!isLoggedIn) {
      this.$emit('logout')
      return
    }

    this.$router.push('/sites');
  },

  methods: {
    submit() {
      if (!this.isValid) {
        return;
      }

      this.$emit('login', {username: this.username, password: this.password})
    }

    // clear() {
    // }
  }
}
</script>