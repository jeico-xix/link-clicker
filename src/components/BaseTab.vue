<template>
  <v-item-group class="ma-2">
    <v-item
      v-for="tab in tabs"
      :key="tab.text"
    >
      <v-btn
        text
        class="mr-2"
        :input-value="tab.is_active"
        @click="tab.is_active = !tab.is_active"
      >
        <v-icon>{{ tab.icon }}</v-icon>
        
        {{ tab.text }}
      </v-btn>
    </v-item>
  </v-item-group>
</template>

<script>
export default {
  props: {
    tabs: Array
  }
}
</script>