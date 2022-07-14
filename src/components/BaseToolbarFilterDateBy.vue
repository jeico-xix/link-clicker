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
        @update:date-time="updateDateTime('date-time-from', $event)"
      />

      <base-toolbar-filter-date-by-picker
        :date-time="dateTimeToValue"
        @update:date-time="updateDateTime('date-time-to', $event)"
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
    updateDateTime(eventName, e) {
      const dateTime = `${e.date} ${e.time}`
      const objDateTime = {
        text: dateTime,
        value: dateTime
      }

      if (eventName === 'date-time-from') {
        this.dateTimeFromValue = objDateTime
      } else {
        this.dateTimeToValue = objDateTime
      }

      this.$emit(`update:${eventName}`, objDateTime)
    }
  }
}
</script>