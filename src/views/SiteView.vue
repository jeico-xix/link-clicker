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
      @update:filter-by="updateFilterBy"
      @update:date-by="updateDateBy"
      @update:date-time-from="updateDateTimeFrom"
      @update:date-time-to="updateDateTimeTo"
      @refresh="fetchData"
      @search="search"
      @clear="clear"
    >
      <template #search>
        <v-text-field
          v-model="query"
          hide-details
          x-small
          outlined
          label="Search"
          dense
          single-line
          class="shrink"
        />
      </template>
    </base-toolbar>

    <v-divider />
    <v-data-table
      :loading="isLoading"
      loading-text="Loading... Please wait"
      dense
      :headers="headers"
      :items="sites"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Sites</v-toolbar-title>
          <v-spacer />
          <v-dialog 
            v-model="tagsDialog" 
            max-width="800px"
          >
            <v-card>
              <v-card-title>
                <span class="text-h5">Tags</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <div class="pa-4">
                    <v-chip
                      v-for="tag in tags"
                      :key="tag.id"
                      class="ma-2"
                      color="primary"
                    >
                      {{ tag.name }}
                    </v-chip>
                  </div>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  text
                  @click="closeTagsDialog"
                >
                  <v-icon>
                    mdi-close
                  </v-icon>
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog 
            v-model="dialog" 
            max-width="600px"
            persistent
          >
            <template #activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-plus</v-icon>
                New Site
              </v-btn>
            </template>
            <v-form
              ref="form"
              v-model="isValid"
              lazy-validation
              @submit.prevent="save"
            >
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <div v-if="error !== ''">
                      <v-alert
                        dense
                        outlined
                        type="error"
                      >
                        {{ error }}
                      </v-alert>
                    </div>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >
                        <v-text-field
                          v-model="editedItem.name"
                          outlined
                          label="Name"
                          :rules="nameRules"
                          required
                          name="username"
                          autocomplete="off"
                          autofocus
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >
                        <v-text-field
                          v-model="editedItem.url"
                          outlined
                          label="URL"
                          :rules="urlRules"
                          autocomplete="off"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-text-field
                          v-model="editedItem.api"
                          outlined
                          label="API"
                          :rules="apiRules"
                          autocomplete="off"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="4"
                        md="4"
                      >
                        <v-text-field
                          v-model.number="editedItem.settings.start"
                          outlined
                          type="number"
                          label="Start"
                          oninput="if(this.value < 1) this.value = 1;"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="4"
                      >
                        <v-text-field
                          v-model.number="editedItem.settings.end"
                          outlined
                          type="number"
                          label="End"
                          oninput="if(this.value < 1) this.value = 1;"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                        md="4"
                      >
                        <v-text-field
                          v-model.number="editedItem.settings.page_limit"
                          outlined
                          type="number"
                          label="Page Limit"
                          oninput="if(this.value < 1) this.value = 1;"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    text
                    @click="close"
                  >
                    <v-icon>
                      mdi-close
                    </v-icon>
                    Cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    text
                    :disabled="!isValid"
                    type="submit"
                    :loading="isSaving"
                  >
                    <v-icon>
                      mdi-check
                    </v-icon>
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
          <v-dialog
            v-model="dialogDelete"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="text-h5">
                Are you sure you want to delete this item?
              </v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  text
                  @click="closeDelete"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="red darken-1"
                  text
                  @click="deleteItemConfirm"
                >
                  Confirm
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #[`item.tags`]="{item}">
        <div v-if="item.tags">
          <v-chip
            v-for="tag in item.tags.slice(0, tagsLimit)"
            :key="tag.id"
            class="ma-2"
            color="primary"
            small
          >
            {{ tag.name }}
          </v-chip>
          <v-chip
            v-if="item.tags.length > tagsLimit"
            small
            class="ma-2"
            @click="showMoreTags(item.tags)"
          >
            Show All
          </v-chip>
        </div>
      </template>
      <template #[`item.number`]="{index}">
        {{ index + 1 }}
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
// import BaseTab from '../components/BaseTab'
import _ from 'lodash'
import BaseToolbar from '../components/BaseToolbar'

export default {
  name: 'SiteView',
  components: {
    // BaseTab,
    BaseToolbar
  },
  data: () => ({
    // tab: null,
    // tabs: [
    //   {
    //     text: 'All',
    //     is_active: true
    //   },
    //   {
    //     'is_active': false,
    //     'text': 'Deleted'
    //   }
    // ],
    tagsLimit: 0,
    tagsDialog: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: '#', value: 'number' },
      { text: 'Name', value: 'name' },
      { text: 'URL', value: 'url' },
      { text: 'API', value: 'api' },
      { text: 'Tags', value: 'tags' },
      { text: 'Created At', value: 'created_at' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    sites: [],
    tags: [],
    isLoading: false,
    isValid: false,
    isSaving: false,
    nameRules: [
      v => !!v || 'Name is required'
    ],
    urlRules: [
      v => !!v || 'URL is required'
    ],
    apiRules: [
      v => !!v || 'API is required'
    ],
    error: '',
    editedIndex: -1,
    editedItem: {
      name: '',
      url: '',
      api: '',
      settings: {
        start: 1,
        end: 2,
        page_limit: 0
      }
    },
    defaultItem: {
      name: '',
      url: '',
      api: '',
      settings: {
        start: 1,
        end: 2,
        page_limit: 0
      }
    },
    filterByColumns: [
      {
        text: 'Name',
        value: 'name'
      },
      {
        text: 'URL',
        value: 'url'
      },
      {
        text: 'API',
        value: 'api'
      }
    ],
    dateByColumns: [
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
    query: '',
    dateTimeFrom: {
      text: 'Date From',
      value: ''
    },
    dateTimeTo: {
      text: 'Date To',
      value: ''
    },
    itemsPerPage: 5,
    currentPage: 1,
    currentNumber: 1
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Site' : 'Edit Site'
    }
  },

  watch: {
    tagsDialog(val) {
      val || this.close()
    },

    dialog(val) {
      if (val) {
        this.isValid = false
      } else {
        this.isValid = true
      }
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },

  created() {
    if (this.$route.query.q) {
      this.query = this.$route.query.q
    }

    this.filterByColumns.forEach(filterBy => {
      if (this.$route.query.filter_by && this.$route.query.filter_by === filterBy.value) {
        this.filterBy = filterBy
      }
    });
  },

  mounted() {
    this.currentNumber = this.itemsPerPage * (this.currentPage - 1)

    this.fetchData()
    this.tagsLimit = 3;
    this.isValid = false
  },

  methods: {
    // tabChange(e) {
    //   console.log(e)
    // },

    showMoreTags(tags) {
      this.tags = tags
      this.tagsDialog = true
      
    },

    closeTagsDialog() {
      this.tagsDialog = false
    },

    fetchData() {
      const params = [
        `${(this.$route.query.filter_by) ? `filter_by=${this.$route.query.filter_by}` : ''}`,
        `q=${this.$route.query.q}`
      ]

      const queryParams = params.join('&');

      this.isLoading = true;
      this.$http.get(`/sites?${queryParams}`)
        .then(response => {
          this.isLoading = false;
          this.sites = response.data.list
        })
    },

    updateFilterBy(filter) {
      this.status = {
        text:'All',
        value: ''
      }
      this.query = ''

      this.filterBy = filter
    },

    updateDateBy(dateBy) {
      this.dateBy = dateBy;
    },

    updateDateTimeFrom(date, time) {
      const dateTime = `${date} ${time}` 
      this.dateTimeFrom = {
        text: dateTime,
        value: `${dateTime}:00`
      }
    },

    updateDateTimeTo(date, time) {
      const dateTime = `${date} ${time}` 
      this.dateTimeTo = {
        text: dateTime,
        value: `${dateTime}:00`
      }
    },

    search() {
      const query = {}
      if (this.filterBy.value !== '') {
        query.filter_by = this.filterBy.value
      }

      query.q = this.query

      if (!_.isEqual(this.$route.query, query)) {
        this.$router.push({ 
          query: query 
        })
      }

      this.fetchData()
    },

    clear() {
      this.fetchData()
    },

    editItem(item) {
      this.editedIndex = this.sites.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.sites.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.$http.delete(`/sites/${this.editedItem.id}`)
        .then(() => {
          this.sites.splice(this.editedIndex, 1)
          this.closeDelete()
        })
    },

    close() {
      this.error = '';
      this.isValid = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      this.isSaving = true;
      if (!this.isValid) {
        return;
      }

      const isUpdate = this.editedIndex > -1
      const item = { ...this.editedItem }
      if (isUpdate) {
        delete item['id'];
        delete item['created_at'];
        delete item['tags'];
        this.$http.patch(`/sites/${this.editedItem.id}`, item)
          .then(response => {
            this.isSaving = false;
            const id = response.data
            if (id === 0) {
              this.close()
              return
            }

            this.appendOrEditItem(id)
          }).catch(error => {
            this.isSaving = false;
            if (error.response) {
              this.error = error.response.data.message;
            }
          });
        return
      }

      this.$http.post('/sites', item)
        .then(response => {
          const id = response.data
          if (id === 0) {
            this.close()
            return
          }

          this.appendOrEditItem(id)
        }).catch(error => {
          this.isSaving = false;
          if (error.response) {
            this.error = error.response.data.message;
          }
        });
    },

    appendOrEditItem(id) {
      if (this.editedIndex > -1) {
        this.sites[this.editedIndex].id = id
        Object.assign(this.sites[this.editedIndex], this.editedItem)
      } else {
        this.sites.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>