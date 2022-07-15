<template>
  <div
    class="mr-2"
  >
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          elevation="0"
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

      <v-card class="flex">
        <v-row
          justify="space-around"
          align="center"
        >
          <v-container class="d-flex">
            <v-date-picker
              v-model="datePicker"
              flat
              no-title
              elevation="15"
              color="primary"
            />

            <v-card
              class="ml-2 mr-1"
              tile
              max-height="290px"
              style="overflow: scroll; overflow-x: hidden;"
            >
              <v-list
                class="mr-2"
              >
                <v-list-item-group
                  v-model="selectedTimeIndex"
                  color="primary"
                >
                  <v-list-item
                    v-for="item in items"
                    :key="item"
                    dense
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-container>
        </v-row>

        <v-card-actions>
          <v-spacer />
          <v-btn
            class="mt-1"
            color="primary"
            @click="confirm"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
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
      selectedTimeIndex: {},
      items: [],
      datePicker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
    }
  },

  created() {
    this.generateTimes()
    this.selectedTimeIndex = 0
  },

  methods: {
    generateTimes() {
      for (let i = 1; i <= 24; i++) {
        this.items.push(`${i}:00`)
      }
    },

    confirm() {
      this.menu = false

      const time = this.items[this.selectedTimeIndex]

      this.$emit('update:date-time', {
        date: this.datePicker, time
      })
    }
  }
}
</script>