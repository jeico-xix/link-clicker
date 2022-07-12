<template>
  <div 
    class="mt-1 mr-2"
  >
    <base-toolbar-filter-menu
      small
      :items="items"
      :value="{text: 'Filter By', value: ''}"
      @change="changeFilter"
    >
      <template #action>
        <v-btn
          v-if="index != 1"
          icon
          x-small
          class="ml-1 mb-1"
          color="error"
          @click="$emit('remove:filter')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-btn
          v-if="index === total"
          icon
          class="ml-1 mb-1"
          color="success"
          x-small
          @click="$emit('add:filter')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </base-toolbar-filter-menu>

    <v-text-field
      v-if="filterBy.value !== 'status'"
      hide-details
      x-small
      outlined
      label="Search"
      dense
      single-line
      class="shrink"
      @input="changeValue($event, index)"
    />

    <base-toolbar-filter-menu
      v-else
      :items="statuses"
      :value="status"
      @change="changeStatus($event, index)"
    />
  </div>
</template>

<script>
// import _ from 'lodash'
import BaseToolbarFilterMenu from './BaseToolbarFilterMenu.vue'

export default {
  components: {
    BaseToolbarFilterMenu
  },
	
  props: {
    index: Number,
    total: Number,
    items: Array
  },

  data() {
    return {
      filterBy: {},
      status: {
        text: 'All',
        value: ''
      },
      q: '',
      statuses: [
        {
          text: 'All',
          value: ''
        },
        {
          text: 'On-Going',
          value: 'on-going'
        },
        {
          text: 'Success',
          value: 'success'
        },
        {
          text: 'Failed',
          value: 'failed'
        }
      ]
    }
  },

  methods: {
    changeFilter(item, index) {
      this.filterBy = item
      this.$emit('update:filter', this.filterBy.value, this.q, index)
    },

    changeValue(e, index) {
      this.$emit('update:filter', this.filterBy.value, e, index)
    },

    changeStatus(status, index) {
      this.$emit('update:filter', this.filterBy.value, status.value, index)
    }
  }
}
</script>