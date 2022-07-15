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
      @update:date-by="updateDateBy"
      @update:date-time-from="updateDateTimeFrom"
      @update:date-time-to="updateDateTimeTo"
      @refresh="fetchData"
      @search="fetchData"
      @clear="fetchData"
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
      :items="settings"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer />

          <v-dialog
            v-model="dialogToggleStatus"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="text-h5">
                Are you sure you want to update status for this item?
              </v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  text
                  @click="dialogToggleStatus = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  :loading="isLoading"
                  @click="updateItemStatusContirm"
                >
                  Confirm
                </v-btn>
                <v-spacer />
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
                New Country
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
                          label="Country"
                          :rules="nameRules"
                          required
                          name="country"
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
                          v-model="editedItem.code"
                          outlined
                          label="Code"
                          :counter="2"
                          :rules="codeRules"
                          autocomplete="off"
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
                    :loading="isLoading"
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
                  :loading="isLoading"
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
      <template #[`item.status`]="{item}">
        <div>
          <v-chip
            small
            :class="getStatusClass(item.status)"
            text-color="white"
          >
            {{ item.status.toUpperCase() }}
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
          @click="toggleItemStatus(item)"
        >
          mdi-power
        </v-icon>
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
import BaseToolbar from '../components/BaseToolbar'

export default {
  name: 'SettingView',
  components: {
    BaseToolbar
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: '#', value: 'number' },
      { text: 'Country', value: 'name' },
      { text: 'Code', value: 'code' },
      { text: 'Status', value: 'status' },
      { text: 'Created At', value: 'created_at' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    settings: [],
    dialogToggleStatus: false,
    isValid: false,
    isLoading: false,
    nameRules: [
      v => !!v || 'Country Name is required'
    ],
    codeRules: [
      v => !!v || 'Code is required',
      v => v.length <= 2 || 'Code must be a maximum of 2 characters'
    ],
    error: '',
    editedIndex: -1,
    editedItem: {
      name: '',
      code: '',
      status: ''
    },
    defaultItem: {
      name: '',
      code: '',
      status: ''
    },
    filterByColumns: [
      {
        text: 'Country',
        value: 'name'
      },
      {
        text: 'Code',
        value: 'code'
      },
      {
        text: 'Status',
        value: 'status',
        items: [
          {
            text: 'Enabled',
            value: 'enabled'
          },
          {
            text: 'Disabled',
            value: 'disabled'
          }
        ]
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
    currentNumber: 1,
    filters: []
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Country' : 'Edit Country'
    }
  },

  watch: {
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
    this.isValid = false
  },

  methods: {
    getStatusClass(status) {
      if (status === 'enabled') {
        return 'success'
      }

      return 'red'
    },

    updateFilterBy(filter) {
      // this.status = {
      //   text:'All',
      //   value: ''
      // }
      // this.query = ''

      this.filterBy = filter;
    },

    updateDateBy(dateBy) {
      this.dateBy = dateBy;
    },

    updateDateTimeFrom(date, time) {
      const dateTime = `${date} ${time}`;
      this.dateTimeFrom = {
        text: dateTime,
        value: `${dateTime}:00`
      }
    },

    updateDateTimeTo(date, time) {
      const dateTime = `${date} ${time}`;
      this.dateTimeTo = {
        text: dateTime,
        value: `${dateTime}:00`
      }
    },

    toggleItemStatus(item) {
      this.editedItem = item;
      this.editedIndex = this.settings.indexOf(item);
      this.dialogToggleStatus = true;
    },

    editItem(item) {
      this.editedIndex = this.settings.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.settings.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    close() {
      this.error = '';
      this.isValid = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      })
    },

    updateFilters(filters) {
      this.filters = filters;
    },

    updateItemStatusContirm() {
      let status = 'disabled';
      if (this.editedItem.status === 'disabled') {
        status = 'enabled';
      }

      this.editedItem.status = status;
      this.isValid = true;
      this.save();
    },

    async fetchData() {
      try {
        this.isLoading = true;
        
        const response = await this.$http.get('/countries', {
          params: this.$route.query
        });

        this.settings = response.data.list;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        this.error = error.response.data
      }
    },

    async save() {      
      if (!this.isValid) {
        return;
      }

      this.isValid = false;

      const isUpdate = this.editedIndex > -1
      const item = { ...this.editedItem }

      if (isUpdate) {
        delete item['id'];
        delete item['created_at'];

        try {
          this.isLoading = true;

          await this.$http.patch(`/countries/${this.editedItem.id}`, item)

          if (this.dialogToggleStatus) {
            this.dialogToggleStatus = false;
          }

          this.close()

          this.fetchData()
        } catch (error) {
          this.isLoading = false;
          this.error = error.response.data
        }
        return
      }

      try {
        this.isLoading = true;

        await this.$http.post('/countries', item)
        
        this.close()
        
        this.fetchData()
      } catch (error) {
        this.isLoading = false;
        this.error = error.response.data
      }
    },
    
    async deleteItemConfirm() {
      try {
        this.isLoading = true;

        await this.$http.delete(`/countries/${this.editedItem.id}`)
        
        this.closeDelete()
        
        this.fetchData()
      } catch (error) {
        this.isLoading = false;
        this.error = error.response.data
      }
    }
  }
}
</script>