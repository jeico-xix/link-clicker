<template>
  <v-container class="my-5">
    <v-divider />

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
      @search="fetchData"
      @clear="fetchData"
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
      <!-- <template #[`item.number`]="{ index }">
        {{ currentNumber + (index + 1) }}
      </template> -->
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
      <template #[`item.action`]="{ item }">
        <v-btn
          small
          elevation="0"
          class="primary"
          :to="{ name: 'summary', query: { site_tag_id: item.site_tag.id }}"
        >
          View Summary
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import {
  logs as LogsSocket
} from '@/config/manager'
import BaseToolbar from '../components/BaseToolbar'

export default {
  name: 'LogView',
  components: {
    BaseToolbar
  },
  data: () => ({
    isLoading: false,
    headers: [
      { text: '#', value: 'index' },
      { text: 'Site Name', value: 'sites.name' },
      { text: 'Tag', value: 'tags.name' },
      { text: 'Term', value: 'term' },
      { text: 'Status', value: 'status' },
      { text: 'Country', value: 'country.name' },
      { text: 'IP', value: 'ip' },
      { text: 'Page', value: 'page' },
      { text: 'Started At', value: 'started_at' },
      { text: 'Finished At', value: 'finished_at' },
      { text: 'Duration', value: 'duration' },
      { text: 'Created At', value: 'created_at' },
      { text: 'Action', value: 'action' }
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
        text: 'Term',
        value: 'log_term'
      },
      {
        text: 'Status',
        value: 'status',
        items: [
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
      this.filterBy = filter
    },

    updateFilterDateBy(dateBy) {
      this.dateBy = dateBy;
    },

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

    updateFilters(filters) {
      this.filters = filters
    },

    async fetchData() {
      try {
        this.isLoading = true;

        const response = await this.$http.get('/logs', {
          params: this.$route.query
        });

        this.isLoading = false;

        this.logs = response.data.list;

        let i = 0;
        this.logs.map(log => {
          i++
          return log.index = i
        })
      } catch (error) {
        this.isLoading = false;
        this.error = error.response.data
      }
    }
  }
}
</script>