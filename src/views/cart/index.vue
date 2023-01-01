<template>
  <div class="app-container">
    <ComicList />
    <CustomerChoose style="margin-top: 50px" />
  </div>
</template>

<script>
import CustomerChoose from './customer-choose.vue'
import ComicList from './comic-list.vue'

export default {
  components: {
    CustomerChoose,
    ComicList
  }
}
</script>
