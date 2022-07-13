<template>
  <div class="mt-1 mr-2">
    <base-toolbar-filter-menu
      :value="dateBy"
      :items="dateByColumns"
      small
      @change="$emit('update:filter-date-by', $event)"
    />

    <div class="d-flex">
      <base-toolbar-filter-date-by-picker
        :date-time="dateTimeFromValue"
        @update:date-time="updateDateFrom"
      />

      <base-toolbar-filter-date-by-picker
        :date-time="dateTimeToValue"
        @update:date-time="updateDateTo"
      />
    </div>
  </div>
</template>

<script>
import BaseToolbarFilterMenu from './BaseToolbarFilterMenu.vue'
import BaseToolbarFilterDateByPicker from './BaseToolbarFilterDateByPicker.vue'

export default {
  components: {
    BaseToolbarFilterMenu,
    BaseToolbarFilterDateByPicker
  },

  props: {
    value: Object,
    items: Array,
    dateTimeFrom: Object,
    dateTimeTo: Object
  },

  data() {
    return {
      dateBy: this.value,
      dateByColumns: this.items,
      dateTimeFromValue: this.dateTimeFrom,
      dateTimeToValue: this.dateTimeTo
    }
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
    }
  }
}
</script>