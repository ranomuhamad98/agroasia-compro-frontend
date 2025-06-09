<template>
  <header>
    <div class="tp-header-top">
      <div class="container-fluid">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-4">
            <div class="d-flex align-items-center gap-2">
              <Icon name="material-symbols:location-on-outline" style="color: var(--tp-green-light);" />
              <span class="tp-header-top-text">Tangerang Selatan</span>
            </div>
            <div class="d-flex align-items-center gap-2 border-start ps-4 pe-4">
              <Icon name="material-symbols:mail-outline-rounded" style="color: var(--tp-green-light);" />
              <span class="tp-header-top-text">agroasia119@gmail.com</span>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <div class="offcanvas__lang d-flex align-items-center">
              <div class="offcanvas__lang-wrapper">
                <div @click="handleToggleLanguage" class="tp-header-language-selector" style="cursor: pointer">
                  <Icon name="ph:globe-bold" />
                  <span>{{ selectedLanguage }}</span>
                  <Icon name="material-symbols:keyboard-arrow-down-rounded" />
                </div>
                <ul :class="['offcanvas__lang-list tp-lang-list', {'tp-lang-list-open': isLanguageOpen}]" style="background: white; margin-top: 5px">
                  <li @click="selectLanguage('English')" style="cursor: pointer">English</li>
                  <li @click="selectLanguage('Indonesia')" style="cursor: pointer">Indonesia</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="header-sticky"
      :class="`tp-header-area p-relative tp-header-sticky tp-header-height ${isSticky ? 'header-sticky' : ''}`">
      <div class="tp-header-5 pl-25 pr-25">
        <div class="container-fluid">
          <div class="d-flex align-items-center justify-content-between">
            <div class="">
              <div class="tp-header-left-5 d-flex align-items-center">
                <div class="tp-header-hamburger-5 mr-15 d-lg-none">
                  <button @click="utilityStore.handleOpenMobileMenu()" class="tp-hamburger-btn-2 tp-offcanvas-open-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </div>
                <div class="logo">
                  <nuxt-link href="/" class="d-flex align-items-center gap-2">
                    <img src="/images/logo/logo.png" alt="logo" style="width: 40px;">
                    <h1 class="tp-header-logo-text">Agro Asia Berdikari</h1>
                  </nuxt-link>
                </div>
              </div>
            </div>
            <div class="d-none d-xl-block">
              <div class="main-menu">
                <nav class="tp-main-menu-content">
                  <!-- menus start -->
                  <header-menus />
                  <!-- menus end -->
                </nav>
              </div>
            </div>
            <div class="d-none d-lg-block">
              <nuxt-link to="/contact" class="tp-header-btn-cta">Contact Us</nuxt-link>
            </div>
          </div>
        </div>
      </div>

    </div>
  </header>

  <!-- cart offcanvas start -->
  <offcanvas-mobile-sidebar></offcanvas-mobile-sidebar>
  <!-- cart offcanvas end -->
</template>

<script setup lang="ts">
import { useCartStore } from '@/pinia/useCartStore';
import { useWishlistStore } from '@/pinia/useWishlistStore';
import { useUtilityStore } from '@/pinia/useUtilityStore';

const { isSticky } = useSticky();
const router = useRouter();
const route = useRoute();

const isLanguageOpen = ref(false);
const selectedLanguage = ref('English');

const handleToggleLanguage = () => {
  isLanguageOpen.value = !isLanguageOpen.value;
};

const selectLanguage = (language: string) => {
  selectedLanguage.value = language;
  isLanguageOpen.value = false;
};

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const utilityStore = useUtilityStore();

let isActive = ref<boolean>(false);
let searchText = ref<string>('');
// handle active
const handleActive = () => isActive.value = !isActive.value;

// handle Submit
const handleSubmit = () => {
  if (searchText.value) {
    router.push(`/search?searchText=${searchText.value}`)
  }
  else {
    router.push(`/search`)
  }
}

watch(() => route.path, () => {
  isActive.value = false;
})
</script>
