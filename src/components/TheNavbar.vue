<template>
  <nav>
    <v-app-bar app>
      <v-app-bar-nav-icon
        class="grey--text"
        @click="toggle = !toggle"
      />
      <v-toolbar-title class="text-uppercase grey--text">
        <span
          class="font-weight-light"
          mr-20
        >Link</span>
        <span>Clicker</span>
      </v-toolbar-title>
      <v-spacer />
      <v-sheet class="pt-6 pr-6 transparent">
        <v-switch
          v-model="isDarkMode"
          inset
          :label="`${(isDarkMode) ? 'Dark Mode' : 'Light Mode'}`"
          @change="toggleTheme"
        />
      </v-sheet>
      <v-btn
        color="grey--text"
        @click="logout"
      >
        <span>Logout</span>
        <v-icon right>
          mdi-logout
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="toggle"
      app
      class="grey darken-4"
    >
      <v-list>
        <v-list-item>
          <v-list-item-content class="flex justify-center">
            <v-img
              lazy-src="http://wing-game.com/img/wing.3972f9d7.png"
              max-height="150"
              max-width="150"
              src="http://wing-game.com/img/wing.3972f9d7.png"
            />
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          style="border-top: 1px solid #424242; border-bottom: 1px solid #424242;"
        >
          <v-list-item-content class="flex item-center white--text">
            Admin
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list nav>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          link
          router
          :to="link.route"
        >
          <v-list-item-action>
            <v-icon class="white--text">
              {{ link.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">
              {{ link.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isDarkMode: true,
      toggle: true,
      links: [
        { icon: 'mdi-sitemap', text: 'Sites', route: 'sites' },
        { icon: 'mdi-note-multiple', text: 'Logs', route: 'logs' }
      ]
    }
  },

  mounted() {
    this.isDarkMode = (localStorage.getItem('is_dark_mode') === 'true');
    this.$vuetify.theme.dark = this.isDarkMode;
  },

  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem('is_dark_mode', this.$vuetify.theme.dark.toString())
    },

    logout() {
      this.$emit('logout')
    }
  }
}
</script>