<template>
  <div :class="`offcanvas__area offcanvas__radius ${utilsStore.openMobileMenus ? 'offcanvas-opened' : ''
    }`">
    <div class="offcanvas__wrapper">
      <div class="offcanvas__close">
        <button @click="utilsStore.handleOpenMobileMenu()" class="offcanvas__close-btn offcanvas-close-btn">
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

        <nuxt-link to="/contact" class="tp-header-btn-cta">Contact Us</nuxt-link>

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
          <div class="offcanvas__currency-wrapper currency">
            <span @click="handleToggleActive('currency')"
              class="offcanvas__currency-selected-currency tp-currency-toggle"
              id="tp-offcanvas-currency-toggle">Currency : USD
            </span>
            <ul :class="`offcanvas__currency-list tp-currency-list ${isToggleActive === 'currency' ? 'tp-currency-list-open' : ''
              }`">
              <li>USD</li>
              <li>ERU</li>
              <li>BDT</li>
              <li>INR</li>
            </ul>
          </div>
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
</script>
