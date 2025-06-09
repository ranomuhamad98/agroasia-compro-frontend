<template>
    <nav class="tp-main-menu-content">
      <ul v-for="(menu, i) in menu_data" :key="i">
        <li
          v-if="menu.drop_down"
          :key="menu.id"
          :class="`has-dropdown ${isActiveMenu === menu.title?'dropdown-opened':''}`"
        >
          <a :class="`${isActiveMenu === menu.title?'expanded':''}`">
            {{ menu.title }}
            <button
              @click="handleOpenSubMenu(menu.title)"
              :class="`dropdown-toggle-btn ${isActiveMenu === menu.title?'dropdown-opened':''}`"
            >
              <i class="fa-regular fa-angle-right"></i>
            </button>
          </a>
          <ul :class="`tp-submenu ${isActiveMenu === menu.title ? 'active':''}`">
            <li v-for="(subMenu, i) in menu.dropdown_menus" :key="i">
              <nuxt-link :to="subMenu.link">{{ subMenu.title }}</nuxt-link>
            </li>
          </ul>
        </li>
        <li v-else :key="i">
          <nuxt-link :to="menu.link">{{ menu.title }}</nuxt-link>
        </li>
      </ul>
    </nav>
</template>

<script setup lang="ts">
import { menu_data } from "@/data/menu-data";

let isActiveMenu = ref<string>("");

const handleOpenSubMenu = (title: string) => {
  if (title === isActiveMenu.value) {
    isActiveMenu.value = "";
  } else {
    isActiveMenu.value = title;
  }
};
</script>
