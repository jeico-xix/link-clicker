<template>
  <div
    class="ma-2 d-flex align-center"
  >
    <base-toolbar-filter
      v-for="(filter, i) in filters"
      :key="filter.index"
      :value="filter"
      :items="filterByColumns"
      :index="i"
      :total="filters.length"
      @add:filter="addFilter"
      @remove:filter="removeFilter(filter)"
      @update:filter="updateFilter"
    />

    <v-divider
      vertical
      class="mr-2"
    />

    <base-toolbar-filter-date-by
      :value="currentDateBy"
      :items="dateByColumns"
      :date-time-from="dateTimeFrom"
      :date-time-to="dateTimeTo"
      @update:filter-date-by="$emit('update:filter-date-by', $event)"
      @update:date-time-from="$emit('update:date-time-from', $event)"
      @update:date-time-to="$emit('update:date-time-to', $event)"
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
      @click="clear"
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
import BaseToolbarFilterDateBy from './BaseToolbarFilterDateBy.vue'

export default {
  components: {
    BaseToolbarFilter,
    BaseToolbarFilterDateBy
  },
  props: {
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
      filters: [],
      defaultFilter: {
        index: 1,
        filter_by: '',
        q: ''
      },
      currentDateBy: this.dateBy
    }
  },

  created() {
    const query = this.$route.query;

    const filterBy = query.filter_by;
    if (!filterBy || filterBy.length === 0) {
      if (this.filters.push(this.defaultFilter));

      return;
    }

    const q = query.q;

    if (Array.isArray(filterBy)) {
      const arrFilterBy = filterBy; 
      const queryValues = q;

      arrFilterBy.forEach(filter_by => {   
        this.filters.push({
          index: this.filters.length + 1,
          filter_by: filter_by,
          q: queryValues[this.filters.length]
        })
      });
    } else {
      this.filters.push({
        index: this.filters.length + 1,
        filter_by: filterBy,
        q: q
      });
    }

    this.$emit('update:filters', this.filters)
  },

  methods: {
    updateFilter(filterBy, val, index) {
      const filter = this.filters[index]
      if (filter) {
        filter.filter_by = filterBy;
        filter.q = val;
      }

      this.$emit('update:filters', this.filters)
    },

    addFilter() {
      this.filters.push({
        index: this.filters.length + 1
      })
    },

    removeFilter(filter) {
      const index = this.filters.indexOf(filter);
      this.filters.splice(index, 1);
    },

    clear() {
      this.filters.forEach((filter, index) => {
        Object.assign({}, filter)
        this.filters.splice(index, 1)
      });

      this.filters.push(this.defaultFilter);
      this.$emit('clear');
    }
  }
}
</script>