<template>
  <div
    class="ma-2 d-flex align-center"
  >
    <base-toolbar-filter
      v-for="filter in filters" 
      :key="filter.index"
      :items="filterByColumns"
      :index="filter.index"
      :total="filters.length"
      @add:filter="filters.push({index: filters.length + 1})"
      @remove:filter="filters.pop(filter.index)"
      @update:filter="updateFilter"
    />

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
import BaseToolbarFilter from './BaseToolbarFilter.vue'
import BaseDateTimePicker from './BaseDateTimePicker.vue'

export default {
  components: {
    BaseToolbarFilter,
    BaseDateTimePicker
  },
  props: {
    // filterBy: Object,
    dateBy: Object,
    filterByColumns: Array,
    dateByColumns: Array,
    dateTimeFrom: Object,
    dateTimeTo: Object,
    items: Array
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

  mounted() {
    const f = this.items
    console.log(f)
  },

  methods: {
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
    },

    // updateFilterBy(item) {
    //   console.log(item)
    // }

    // change (item) {
    //   console.log(item)
    // }

    updateFilter(filterBy, val, index) {
      this.filters.forEach(filter => {
        if (filter.index === index) {
          filter.filter_by = filterBy;
          filter.q = val;
        }
      });

      this.$emit('update:filters', this.filters)
    }
  }
}
</script>