<template>
  <div
    class="ma-2 d-flex align-center"
  >
    <base-toolbar-filter
      v-for="(filter, i) in filters"
      :key="i"
      :value="filter"
      :items="filterByColumns"
      :index="i"
      :total="filters.length"
      @add:filter="addFilter"
      @remove:filter="removeFilter(i)"
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
      @update:date-time-from="updateDateTime('date-time-from', $event)"
      @update:date-time-to="updateDateTime('date-time-to', $event)"
    />

    <v-btn
      icon
      class="mr-2" 
      color="success"
      x-small
      @click="search"
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
import _ from 'lodash'
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
      filters: [{
        filter_by: '',
        q: ''
      }],
      currentDateBy: this.dateBy
    }
  },

  created() {
    const query = this.$route.query;

    const filterBy = query.filter_by;
    if (!filterBy || filterBy.length === 0) {
      console.log(this.filters)

      // if (this.filters.push({

      // }));

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
    updateFilter(item, index) {
      const filter = this.filters[index];
      if (filter) {
        filter.filter_by = item.value;
        filter.q = item.q;
      }

      this.$emit('update:filters', this.filters)
    },

    addFilter() {
      this.filters.push({
        filter_by: '',
        q: ''
      })
    },

    removeFilter(index) {
      this.filters.splice(index, 1);
      this.$emit('update:filters', this.filters)
    },

    search() {
      const query = this.getParams()

      if (!_.isEqual(this.$route.query, query)) {
        this.$router.push({ query: query })
      }

      this.$emit('search')
    },

    getParams() {
      const filterBy = [];
      const q = [];

      this.filters.forEach(filter => {
        if (filter.filter_by) {
          filterBy.push(filter.filter_by);
          q.push(filter.q);
        }
      });

      const query = {}
      if (filterBy.length === 1) {
        console.log(filterBy)

        query.filter_by = filterBy[0];
        query.q = q[0];
      } else {
        // filterBy.forEach(filter => {
        //   if (filter.filter_by) {
        //     filterBy.push(filter.filter_by);
        //     q.push(filter.q);
        //   }
        // });
      }

      if (filterBy.length > 0) {
        query.filter_by = filterBy;
        query.q = q;
      }

      if (this.dateBy.value !== '') {
        query.date_by = this.dateBy.value
      }

      if (this.dateTimeFrom.value !== '') {
        query.date_from = this.dateTimeFrom.value
      }

      if (this.dateTimeTo.value !== '') {
        query.date_to = this.dateTimeTo.value
      }

      return query
    },

    clear() {
      this.filters = [{}]

      // this.filters.forEach((filter, index) => {
      //   const a = Object.assign({}, filter)
      //   console.log(a)
      //   this.filters.splice(index, this.filters.length)
      // });

      // this.filters.push(this.defaultFilter);
      // this.$emit('clear');
    },

    updateDateTime(eventName, e) {
      this.$emit(`update:${eventName}`, e)
    }
  }
}
</script>