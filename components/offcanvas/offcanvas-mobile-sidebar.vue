<template>
  <div :class="`offcanvas__area offcanvas__radius ${utilsStore.openMobileMenus ? 'offcanvas-opened' : ''
    }`">
    <div class="offcanvas__wrapper">
      <div class="offcanvas__close">
        <button @click="utilsStore.handleOpenMobileMenu()" class="offcanvas__close-btn offcanvas-close-btn !flex items-center justify-center rounded-full">
          <svg-close-2 />
        </button>
      </div>
      <div class="offcanvas__content">
        <div class="offcanvas__top mb-70 d-flex justify-content-between align-items-center">
          <div class="offcanvas__logo logo">
            <nuxt-link href="/" class="d-flex align-items-center gap-2">
              <img src="/images/logo/logo.png" alt="logo" style="width: 40px;">
              <h1 class="tp-header-logo-text">Agro Asia Berdikari</h1>
            </nuxt-link>
          </div>
        </div>
        <div class="tp-main-menu-mobile fix d-lg-none mb-40">
          <!-- mobile menus start -->
          <header-mobile-menus></header-mobile-menus>
          <!-- mobile menus end -->
        </div>

        <nuxt-link :to="{ path: '/', hash: '#contact-us' }" @click.prevent="handleContactClick" class="tp-header-btn-cta">Contact Us</nuxt-link>

        <div class="offcanvas__contact align-items-center d-none">
          <div class="offcanvas__contact-icon mr-20">
            <span>
              <img src="/images/icon/contact.png" alt="contact_img" />
            </span>
          </div>
          <div class="offcanvas__contact-content">
            <h3 class="offcanvas__contact-title">
              <a href="tel:098-852-987">004524865</a>
            </h3>
          </div>
        </div>
      </div>
      <div class="offcanvas__bottom">
        <div class="offcanvas__footer d-flex align-items-center justify-content-between">
          <div class="offcanvas__select language">
            <div class="offcanvas__lang d-flex align-items-center justify-content-md-end">
              <div class="offcanvas__lang-img mr-15">
                <img src="/images/icon/language-flag.png" alt="language-flag" />
              </div>
              <div class="offcanvas__lang-wrapper">
                <span @click="handleToggleActive('lang')" class="offcanvas__lang-selected-lang tp-lang-toggle"
                  id="tp-offcanvas-lang-toggle">English
                </span>
                <ul :class="`offcanvas__lang-list tp-lang-list ${isToggleActive === 'lang' ? 'tp-lang-list-open' : ''
                  }`">
                  <li>Spanish</li>
                  <li>Portugese</li>
                  <li>American</li>
                  <li>Canada</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div @click="utilsStore.handleOpenMobileMenu()" :class="`body-overlay ${utilsStore.openMobileMenus ? 'opened' : ''}`">
  </div>
</template>

<script setup lang="ts">
import { useUtilityStore } from "@/pinia/useUtilityStore";
const utilsStore = useUtilityStore();

let isToggleActive = ref<string>("");
// handle active
const handleToggleActive = (type: string) => {
  if (type === isToggleActive.value) {
    isToggleActive.value = "";
  } else {
    isToggleActive.value = type;
  }
};

// Smoothly scroll to #contact-us and close the mobile menu
const handleContactClick = async () => {
  // Close the offcanvas first
  utilsStore.handleOpenMobileMenu();

  const router = useRouter();
  const route = useRoute();

  if (route.path === "/") {
    await nextTick();
    const el = document.getElementById("contact-us");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    await router.push({ path: "/", hash: "#contact-us" });
    // Wait for DOM to paint the target section
    setTimeout(() => {
      const el = document.getElementById("contact-us");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }
};
</script>
