<script setup lang="ts">
  import { panTo } from '../map.ts'

const oncheck = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    panTo(position.coords?.latitude, position.coords?.longitude)
  });
}
</script>

<template>
  <button @click.prevent="oncheck">current</button>
</template>

<style lang="scss">

</style>
