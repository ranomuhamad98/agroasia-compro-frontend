<template>
  <header>
    <div id="header-sticky" :class="`tp-header-area p-relative tp-header-sticky tp-header-height ${isSticky ? 'header-sticky' : ''}`">
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
import { useUtilityStore} from '@/pinia/useUtilityStore';

const {isSticky} = useSticky();
const router = useRouter();
const route = useRoute();


let isActive = ref<boolean>(false);
let searchText = ref<string>('');
// handle active
const handleActive = () => isActive.value = !isActive.value;

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const utilityStore = useUtilityStore();

// handle Submit
const handleSubmit = () => {
  if(searchText.value){
    router.push(`/search?searchText=${searchText.value}`)
  }
  else{
    router.push(`/search`)
  }
}

watch(() => route.path, () => {
  isActive.value = false;
})
</script>
