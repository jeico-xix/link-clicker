<template>
  <v-container class="my-5">
    <v-card
      class="mx-auto"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            {{ site_name }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ tag_name }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <!-- <v-card-actions>
        <v-btn
          small 
          class="primary"
        >
          Button
        </v-btn>
      </v-card-actions> -->
    </v-card>

    <v-card
      class="mt-4"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            Daily
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <base-line-chart
            :chart-data="dailyChartData"
          />
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card
      class="mt-2"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            Weekly
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <base-line-chart
            :chart-data="weeklyChartData"
          />
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-card
      class="mt-2"
      outlined
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            Monthly
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <base-line-chart
            label="Monthly"
            :chart-data="monthlyChartData"
          />
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
import BaseLineChart from '../components/BaseLineChart.vue'
export default {
  name: 'SummaryView',
  components: {
    BaseLineChart
  },

  data: () => ({
    site_name: '',
    tag_name: '',
    dailyChartData: {},
    weeklyChartData: {},
    monthlyChartData: {}
  }),

  async mounted() {
    await this.fetchData()
  },

  methods: {
    async fetchData() {
      try {
        const response = await this.$http.get('/logs/summary', {
          params: this.$route.query
        });

        const data = response.data;

        this.site_name = data.site_name
        this.tag_name = data.tag_name

        const daily = data.daily;
        if (daily.hasOwnProperty('labels') || daily.hasOwnProperty('data')) {
          this.dailyChartData = {
            labels: (!daily.labels) ? [] : daily.labels,
            datasets: [
              {
                label: 'Page',
                backgroundColor: '#ce9440',
                data: (!daily.data) ? [] : daily.data
              }
            ]
          }
        }

        const weekly = data.weekly;
        if (weekly.hasOwnProperty('labels') || daily.hasOwnProperty('data')) {
          this.weeklyChartData = {
            labels: weekly.labels,
            datasets: [
              {
                label: 'Page',
                backgroundColor: '#ce9440',
                data: weekly.data
              }
            ]
          }
        }

        const monthly = data.monthly;
        if (monthly.hasOwnProperty('labels') || monthly.hasOwnProperty('data')) {
          this.monthlyChartData = {
            labels: monthly.labels,
            datasets: [
              {
                label: 'Page',
                backgroundColor: '#ce9440',
                data: monthly.data
              }
            ]
          }
        }

      } catch (error) {
        this.isLoading = false;
        this.error = error.response.data
      }
    }
  }
}
</script>