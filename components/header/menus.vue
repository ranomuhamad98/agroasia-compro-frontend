<template>
  <ul>
    <li v-for="(item,i) in menu_data" :key="i" :class="`${item.drop_down?'has-dropdown':item.mega_menu?'has-dropdown has-mega-menu':''}`">
      <nuxt-link :to="item.link" :class="`${$route.path === item.link ? 'router-link-active-menu' : ''}`">{{item.title}}</nuxt-link>


      <ul v-if="item.drop_down" class="tp-submenu">
        <li v-for="(drop_m,i) in item.dropdown_menus" :key="i" >
          <nuxt-link :to="drop_m.link" :class="`${$route.path === drop_m.link ? 'router-link-active-menu' : ''}`">{{drop_m.title}}</nuxt-link>
        </li>
      </ul>
      
    </li>
  </ul>
</template>

<script setup lang="ts">
import { menu_data } from "@/data/menu-data";
</script>

<style scoped>
.router-link-active-menu {
  color: var(--tp-green-medium);
}
</style>
