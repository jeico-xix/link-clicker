<template>
  <v-container class="my-5">
    <v-divider />
    <!-- <base-tab :tabs="tabs" /> -->

    <base-toolbar
      :filter-by-columns="filterByColumns"
      :date-by-columns="dateByColumns"
      :filter-by="filterBy"
      :date-by="dateBy"
      :date-time-from="dateTimeFrom"
      :date-time-to="dateTimeTo"
      :items="filters"
      @update:filters="updateFilters"
      @update:filter-by="updateFilterBy"
      @update:filter-date-by="updateFilterDateBy"
      @update:date-time-from="updateDateTimeFrom"
      @update:date-time-to="updateDateTimeTo"
      @refresh="fetchData"
      @search="search"
      @clear="clear"
    />

    <v-data-table
      dense
      :headers="headers"
      :items="logs"
      class="elevation-1"
      :items-per-page="itemsPerPage"
      :loading="isLoading"
      @update:page="updatePage"
      @update:items-per-page="updateItemsPerPage"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Logs</v-toolbar-title>
        </v-toolbar>
      </template>
      <template #[`item.number`]="{ index }">
        {{ currentNumber + (index + 1) }}
      </template>
      <template #[`item.status`]="{ item }">
        <v-chip
          small
          class="ma-2"
          :class="[getStatusClass(item.status)]"
          text-color="white"
        >
          {{ (item.status) ? item.status.toUpperCase() : item.status }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import {
  logs as LogsSocket
} from '@/config/manager'
// import _ from 'lodash'
// import BaseTab from '../components/BaseTab'
import BaseToolbar from '../components/BaseToolbar'

export default {
  name: 'LogView',
  components: {
    // BaseTab,
    BaseToolbar
  },
  data: () => ({
    // search: '',
    // tabs: [
    //   {
    //     'text': 'All',
    //     'is_active': true
    //   },
    //   {
    //     'is_active': false,
    //     'text': 'Deleted'
    //   }
    // ],
    isLoading: false,
    headers: [
      { text: '#', value: 'number' },
      { text: 'Site Name', value: 'sites.name' },
      { text: 'Tag', value: 'tags.name' },
      { text: 'Status', value: 'status' },
      { text: 'Country', value: 'country.name' },
      { text: 'IP', value: 'ip' },
      { text: 'Page', value: 'page' },
      { text: 'Started At', value: 'started_at' },
      { text: 'Finished At', value: 'finished_at' },
      { text: 'Duration', value: 'duration' },
      { text: 'Created At', value: 'created_at' }
    ],
    logs: [],
    filterByColumns: [
      {
        text: 'Site Name',
        value: 'site_name'
      },
      {
        text: 'Tag Name',
        value: 'tag_name'
      },
      {
        text: 'Status',
        value: 'status'
      },
      {
        text: 'IP',
        value: 'ip'
      }
    ],
    dateByColumns: [
      {
        text: 'Started At',
        value: 'started_at'
      },
      {
        text: 'Finished At',
        value: 'finished_at'
      },
      {
        text: 'Created At',
        value: 'created_at'
      }
    ],
    filterBy: {
      text: 'Filter By',
      value: ''
    },
    dateBy: {
      text: 'Date By',
      value: ''
    },
    dateTimeFrom: {
      text: 'Date From',
      value: ''
    },
    dateTimeTo: {
      text: 'Date To',
      value: ''
    },
    itemsPerPage: 15,
    currentPage: 1,
    currentNumber: 1,
    filters: []
  }),

  created() {
    // if (this.$route.query.q) {
    //   this.query = this.$route.query.q
    // }

    // this.filterByColumns.forEach(filterBy => {
    //   if (this.$route.query.filter_by && this.$route.query.filter_by === filterBy.value) {
    //     this.filterBy = filterBy

    //     if (this.filterBy.value === 'status') {
    //       this.statuses.forEach(status => {
    //         if (this.$route.query.q === status.value) {
    //           this.status = status
    //         }
    //       });
    //     }
    //   }
    // });

    // this.dateByColumns.forEach(dateBy => {
    //   if (this.$route.query.date_by && this.$route.query.date_by === dateBy.value) {
    //     this.dateBy = dateBy
    //   }
    // });

    // if (this.$route.query.date_from) {
    //   const dateTimeFrom = this.$route.query.date_from
    //   this.dateTimeFrom = {
    //     text: dateTimeFrom,
    //     value: dateTimeFrom
    //   }
    // }

    // if (this.$route.query.date_to) {
    //   const dateTimeTo = this.$route.query.date_to
    //   this.dateTimeTo = {
    //     text: dateTimeTo,
    //     value: dateTimeTo
    //   }
    // }
  },

  mounted() {
    this.currentNumber = this.itemsPerPage * (this.currentPage - 1)
    this.fetchData()

    LogsSocket.on('insert', ()  => {
      this.fetchData()
    })
  },

  methods: {
    getStatusClass(status) {
      if (status === 'on-going') {
        return 'warning'
      }

      if (status === 'success') {
        return 'green'
      }

      return 'red'
    },

    updateFilterBy(filter) {
      // this.status = {
      //   text:'All',
      //   value: ''
      // }
      // this.query = ''
      console.log(filter)

      // this.filterBy = filter
    },

    updateFilterDateBy(dateBy) {
      this.dateBy = dateBy;
    },

    // updateStatus(status) {
    //   this.status = status
    //   this.query = status.value
    // },

    updateDateTimeFrom(e) {
      this.dateTimeFrom = e
    },

    updateDateTimeTo(e) {
      this.dateTimeTo = e
    },

    updatePage(page) {
      this.currentPage = page
      this.currentNumber = this.itemsPerPage * (this.currentPage - 1)
    },

    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },

    clear() {
      this.fetchData()
    },

    updateFilters(filters) {
      this.filters = filters
    },

    search() {
      this.fetchData()
    },
    
    async fetchData() {
      try {
        this.isLoading = true;

        const response = await this.$http.get('/logs', {
          params: this.$route.query
        });

        this.isLoading = false;

        this.logs = response.data.list;
      } catch (error) {
        this.isLoading = false;
        this.error = error.response.data
      }
    }
  }
}
</script>