<template>
  <div
    class="mr-2"
  >
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      offset-x
    >
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          small
          v-on="on"
        >
          {{ dateTime.text }}
          <v-icon
            x-small
            right
          >
            mdi-chevron-down
          </v-icon>
        </v-btn>
      </template>

      <div class="flex">
        <v-row justify="space-around">
          <v-row justify="center">
            <v-date-picker v-model="datePicker" />
          </v-row>
          <v-time-picker
            v-model="timePicker"
            class="mt-4"
            scrollable
          />
        </v-row>
        <v-btn
          color="primary"
          text
          @click="confirm"
        >
          Confirm
        </v-btn>
      </div>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    dateTime: Object
  },
	
  data() {
    return {
      menu: false,
      datePicker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      timePicker: '11:15'
    }
  },

  methods: {
    confirm() {
      this.menu = false

      this.$emit('update-date-time', this.datePicker, this.timePicker)
    }
  }
}
</script>