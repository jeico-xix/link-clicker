<template>
  <div
    class="ma-2 d-flex align-center"
  >
    <div 
      class="mr-2"
    >
      <v-btn
        @click="refresh"
      >
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </div>
    <div 
      class="mr-2" 
    >
      <v-menu
        offset-y
      >
        <template #activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            v-on="on"
          >
            {{ filterBy.text }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="item in filterByColumns"
            :key="item.value"
            link
            @click="selectFilterBy(item)"
          >
            <v-list-item-title v-text="item.text" />
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div
      class="mr-2" 
    >
      <v-text-field
        v-model="query"
        hide-details
        x-small
        outlined
        label="Search"
        dense
        single-line 
        class="shrink"
      />
    </div>
    <div 
      class="mr-2" 
    >
      <v-menu
        offset-y
      >
        <template #activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            v-on="on"
          >
            {{ dateBy.text }}
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="item in dateByColumns"
            :key="item.value"
            link
            @click="selectDateBy(item)"
          >
            <v-list-item-title v-text="item.text" />
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div
      class="mr-2"
    >
      <v-menu
        :close-on-content-click="false"
        offset-x
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
          >
            Date From
          </v-btn>
        </template>

        <div class="flex">
          <v-row justify="space-around">
            <v-row justify="center">
              <v-date-picker v-model="dateFromDatePicker" />
            </v-row>
            <v-time-picker
              v-model="dateFromTimePicker"
              class="mt-4"
              format="24hr"
              scrollable
              min="9:30"
              max="22:15"
            />
          </v-row>
          <v-btn
            color="primary"
            text
          >
            Confirm
          </v-btn>
        </div>
      </v-menu>
    </div>
    <div
      class="mr-2"
    >
      <v-menu
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
          >
            Date To
          </v-btn>
        </template>

        <v-card>
          <div>
            <v-row justify="center">
              <v-date-picker v-model="dateFromDatePicker" />
            </v-row>
          </div>

          <v-divider />

          <div>
            <p>Time</p>
          </div>

          <v-card-actions>
            <v-spacer />

            <v-btn
              text
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              text
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
    <v-btn
      icon
      class="mr-2" 
      color="success"
      @click="search"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn
      icon
      class="mr-2"
      color="error"
      @click="reset"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    filterByColumns: Array,
    dateByColumns: Array
  },

  data() {
    return {
      dateFromDatePicker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateFromTimePicker: '11:15',
      filterBy: {
        text: 'Filter By',
        value: ''
      },
      dateBy: {
        text: 'Date By',
        value: ''
      },
      query: ''
    }
  },
  
  watch: {
    dateFromDatePicker(val) {
      console.log(val)
    }
  },

  methods: {
    refresh() {
      this.$emit('refresh')
    },

    selectFilterBy(item) {
      this.filter = item
    },

    selectDateBy(item) {
      console.log(item)
    },

    search() {
      this.$emit('search', {
        filterBy: this.filterBy.value,
        query: this.query
      })
    },

    reset() {
      this.query = ''
      this.filter = {
        text: 'Filter By',
        value: ''
      }
      this.$emit('reset')
    }
  }
}
</script>