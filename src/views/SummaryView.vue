<template>
  <v-container class="my-5">
    <div
      class="mr-2 mb-2 d-flex align-center"
    >
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        offset-x
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            elevation="0"
            v-on="on"
          >
            {{ date.text }}
            <v-icon
              x-small
              right
            >
              mdi-chevron-down
            </v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-date-picker
            v-model="datePicker"
            no-title
            color="primary"
            type="month"
          />

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              @click="confirm"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>

      <div 
        class="ml-2"
      >
        <v-btn
          icon
          x-small
          @click="fetchData()"
        >
          <v-icon>mdi-cached</v-icon>
        </v-btn>
      </div>
    </div>
  
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
          <base-line-chart :chart-data="dailyChartData" />
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
          <base-line-chart :chart-data="weeklyChartData" />
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
import moment from 'moment';
import BaseLineChart from '../components/BaseLineChart.vue';
export default {
  name: 'SummaryView',
  components: {
    BaseLineChart
  },

  data: () => ({
    menu: false,
    datePicker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    date: {
      text: moment().format('MMMM YYYY'),
      value: moment().format('YYYYMM')
    },
    site_name: '',
    tag_name: '',
    dailyChartData: {},
    weeklyChartData: {},
    monthlyChartData: {}
  }),

  async mounted() {
    const year = this.$route.query.year
    const month = this.$route.query.month
    if (year && month) {
      const yearMonth = year + '-' + month
      this.date = {
        text: moment(yearMonth).format('MMMM YYYY'),
        value: moment(yearMonth).format('YYYYMM')
      }

      this.datePicker = yearMonth
    }

    await this.fetchData();
  },

  methods: {
    async fetchData() {
      try {
        const response = await this.$http.get('/logs/summary', {
          params: this.$route.query
        });

        const data = response.data;

        this.site_name = data.site_name;
        this.tag_name = data.tag_name;

        const daily = data.daily;
        if (daily.hasOwnProperty('labels') || daily.hasOwnProperty('data')) {
          this.dailyChartData = {
            labels: !daily.labels ? [] : daily.labels,
            datasets: [
              {
                label: 'Page',
                backgroundColor: '#ce9440',
                data: !daily.data ? [] : daily.data
              }
            ]
          };
        }

        const weekly = data.weekly;
        if (weekly.hasOwnProperty('labels') || daily.hasOwnProperty('data')) {
          this.weeklyChartData = {
            labels: !weekly.labels ? [] : weekly.labels,
            datasets: [
              {
                label: 'Page',
                backgroundColor: '#ce9440',
                data: weekly.data
              }
            ]
          };
        }

        const monthly = data.monthly;
        if (
          monthly.hasOwnProperty('labels') ||
          monthly.hasOwnProperty('data')
        ) {
          this.monthlyChartData = {
            labels: !monthly.labels ? [] : monthly.labels,
            datasets: [
              {
                label: 'Page',
                backgroundColor: '#ce9440',
                data: monthly.data
              }
            ]
          };
        }
      } catch (error) {
        this.isLoading = false;
        this.error = error.response.data;
        
        this.$router.push('/login').catch(err => {
          console.log(err)
        })
      }
    },

    confirm() {
      this.menu = false

      this.date = {
        text: new Date(this.datePicker).toLocaleString('en-us',{month:'long', year:'numeric'}),
        value: this.datePicker
      }

      const site_tag_id = this.$route.query.site_tag_id
      const arrDate = this.datePicker.split('-')
      this.$router.push({
        query: {
          site_tag_id: site_tag_id,
          year: arrDate[0],
          month: arrDate[1]
        }
      })

      this.fetchData()
    }
  }
};
</script>