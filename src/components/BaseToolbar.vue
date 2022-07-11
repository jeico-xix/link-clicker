<template>
  <div
    class="ma-2 d-flex align-center"
  >
    <div
      v-for="filter in filters"
      :key="filter.index"
    >
      <div 
        class="mr-2" 
      >
        <v-menu
          offset-y
        >
          <template #activator="{ attrs, on }">
            <v-btn
              class="mb-1"
              v-bind="attrs"
              small
              v-on="on"
            >
              {{ filterBy.text }}
              <v-icon
                x-small
                right
              >
                mdi-chevron-down
              </v-icon>
            </v-btn>

            <v-btn
              v-if="filter.index != 1"
              icon
              x-small
              class="ml-1"
              color="error"
              @click="removeFilter(filter.index)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="item in filterByColumns"
              :key="item.value"
              link
              :value="item"
              @click="$emit('update:filter-by', item)"
            >
              <v-list-item-title v-text="item.text" />
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div
        class="mr-2" 
      >
        <slot name="search"></slot>
      </div>
    </div>
    
    <v-btn
      icon
      class="mr-2"
      color="success"
      x-small
      @click="addNewFilter"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <v-divider
      vertical
      class="mr-2"
    />
    
    <div 
      class="mr-2" 
    >
      <v-menu
        offset-y
      >
        <template #activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            small
            v-on="on"
          >
            {{ dateBy.text }}
            <v-icon
              right
              x-small
            >
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="item in dateByColumns"
            :key="item.value"
            link
            :value="item"
            @click="$emit('update:date-by', item)"
          >
            <v-list-item-title v-text="item.text" />
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <base-date-time-picker
      :date-time="dateTimeFromValue"
      @update-date-time="updateDateFrom"
    />

    <base-date-time-picker
      :date-time="dateTimeToValue"
      @update-date-time="updateDateTo"
    />

    <v-btn
      icon
      class="mr-2" 
      color="success"
      x-small
      @click="$emit('search')"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn
      icon
      class="mr-2"
      color="error"
      x-small
      @click="$emit('clear')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <div 
      class="mr-2"
    >
      <v-btn
        icon
        x-small
        @click="$emit('refresh')"
      >
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import BaseDateTimePicker from './BaseDateTimePicker.vue'
export default {
  components: {
    BaseDateTimePicker
  },
  props: {
    filterBy: Object,
    dateBy: Object,
    filterByColumns: Array,
    dateByColumns: Array,
    dateTimeFrom: Object,
    dateTimeTo: Object
  },
  emits: [
    'update:filter-by', 
    'update:status', 
    'update:date-by',
    'update:date-from',
    'update:date-to'
  ],

  data() {
    return {
      filters: [{
        index: 1
      }],
      dateTimeFromValue: this.dateTimeFrom,
      dateTimeToValue: this.dateTimeTo
    }
  },
  
  watch: {
    // dateFromDatePicker(val) {
    //   // this.selectedFilterBy = val
    // }
  },

  methods: {
    addNewFilter() {
      this.filters.push({
        index: this.filters.length + 1
      })
    },

    removeFilter(index) {
      this.filters.forEach((filter, i) => {
        if (index === filter.index) {
          this.filters.splice(i, 1)
        }
      });
    },

    updateDateFrom(date, time) {
      const dateTime = `${date} ${time}`
      this.dateTimeFromValue = {
        text: dateTime,
        value: `${dateTime}:00`
      }

      this.$emit('update:date-time-from', date, time)
    },

    updateDateTo(date, time) {
      const dateTime = `${date} ${time}`
      this.dateTimeToValue = {
        text: dateTime,
        value: `${dateTime}:00`
      }

      this.$emit('update:date-time-to', date, time)
    }
  }
}
</script>

<style scoped>
.v-text-field .v-input__control .v-input__slot {
    min-height: 10px !important;
    display: flex !important;
    align-items: center !important;
  }
</style>
