<template>
  <v-container class="my-5">
    <v-divider />
    <!-- <base-tab :tabs="tabs" /> -->

    <base-toolbar
      :filter-by-columns="filterByColumns"
      :date-by-columns="dateByColumns"
      @refresh="fetchData"
      @search="search"
      @reset="reset"
    />

    <v-data-table
      dense
      :headers="headers"
      :items="logs"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Logs</v-toolbar-title>
        </v-toolbar>
      </template>
      <template #[`item.number`]="{ index }">
        {{ index + 1 }}
      </template>
      <template #[`item.status`]="{ item }">
        <v-chip
          small
          class="ma-2"
          :class="[item.status === 'success' ? 'green' : 'red']"
          text-color="white"
        >
          {{ item.status.toUpperCase() }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
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
    headers: [
      { text: '#', value: 'number' },
      { text: 'Site Name', value: 'sites.name' },
      { text: 'Tag', value: 'tags.name' },
      { text: 'Status', value: 'status' },
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
        text: 'Page',
        value: 'page'
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
    query: {
      filter_by: '',
      q: ''
    }
  }),

  mounted() {
    const socket = this.$io.connect('http://10.0.10.11:4003/logs', { transports: ['websocket', 'polling'] })
    socket.on('insert', log => {
      this.logs.unshift(JSON.parse(log))
    })

    this.query.filterBy = this.$route.query.page;
    this.query.q = this.$route.query.page;
    this.fetchData()
  },

  methods: {
    fetchData(queryParams) {
      this.$http.get(`/logs?${queryParams}`)
        .then(response => {
          this.logs = response.data.list
        })
    },

    search(data) {
      this.$router.replace({ 
        query: {
          filter_by: data.filterBy,
          q: data.query
        }
      })

      const params = [
        `filter_by=${data.filterBy}`,
        `q=${data.query}`
      ]

      const queryParams = params.join('&')
      console.log(queryParams)
      this.fetchData(queryParams)
    },

    reset() {
      this.$router.replace({ 
        query: {}
      })
      
      this.fetchData()
    }
  }
}
</script>