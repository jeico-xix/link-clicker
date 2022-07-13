<template>
  <div 
    class="mt-1 mr-2"
  >
    <base-toolbar-filter-menu
      small
      :items="items"
      :value="filter"
      :default-value="{text: 'Filter By', value: ''}"
      @change="changeFilter"
    >
      <template #action>
        <v-btn
          v-if="total > 1"
          icon
          x-small
          class="ml-1 mb-1"
          color="error"
          @click="$emit('remove:filter')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-btn
          v-if="(index + 1) === total"
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
      v-if="filter.value !== 'status'"
      hide-details
      x-small
      outlined
      label="Search"
      dense
      single-line
      class="shrink"
      :value="filter.q"
      @input="changeValue($event, index)"
    />

    <base-toolbar-filter-menu
      v-else
      :items="statuses"
      :value="status"
      :default-value="{text: 'All', value: ''}"
      @change="changeStatus($event, index)"
    />
  </div>
</template>

<script>
import BaseToolbarFilterMenu from './BaseToolbarFilterMenu.vue'

export default {
  components: {
    BaseToolbarFilterMenu
  },
	
  props: {
    index: Number,
    value: Object,
    total: Number,
    items: Array
  },

  data() {
    return {
      filter: this.value,
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

  created() {
    if (!this.filter.filter_by) {
      this.filter = {
        text: 'Filter By',
        value: ''
      }

      return;
    }

    this.items.forEach(item => {
      if (this.filter.filter_by === item.value) {
        const q = this.filter.q
        this.filter = item
        this.filter.q = q

        if (this.filter.value === 'status') {
          this.status = this.$_.find(this.statuses, {value: this.filter.q});
          if (!this.status) {
            this.status = {
              text: 'All',
              value: ''
            }
          }
        }
      }
      return;
    });
  },

  methods: {
    changeFilter(item, index) {
      this.filter = item
      this.$emit('update:filter', this.filter.value, this.q, index)
    },

    changeValue(e, index) {
      this.$emit('update:filter', this.filter.value, e, index)
    },

    changeStatus(status, index) {
      this.$emit('update:filter', this.filter.value, status.value, index)
    }
  }
}
</script>