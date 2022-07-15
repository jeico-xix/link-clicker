<template>
  <div
    v-if="selectedItem"
    class="mr-2" 
  >
    <v-menu
      offset-y
    >
      <template #activator="{ attrs, on }">
        <v-btn
          class="mb-1"
          v-bind="{...attrs, ...$attrs}"
          elevation="0"
          v-on="on"
        >
          {{ selectedItem.text }}
          <v-icon
            x-small
            right
          >
            mdi-chevron-down
          </v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="item in items"
          :key="item.value"
          link
          :value="item"
          @click="click(item)"
        >
          <v-list-item-title v-text="item.text" />
        </v-list-item>
      </v-list>
    </v-menu>

    <slot name="action"></slot>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    items: Array
  },

  data() {
    return {
      selectedItem: this.value
    }
  },
  
  methods: {
    click (item) {
      this.selectedItem = item;
      this.$emit('change', this.selectedItem)
    }
  }
}
</script>