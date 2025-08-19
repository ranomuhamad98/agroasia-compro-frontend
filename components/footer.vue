<template>
  <footer>
    <div class="container">
      <div class="about-us">
        <p class="title capitalize font-bold">{{ footer?.about_us }}</p>
        <p class="description">{{ footer?.about_us_text }}</p>
        <div class="socials">
          <a :href="footer?.sosmed_facebook" target="_blank" rel="noopener noreferrer">
            <Icon name="fa:facebook" />
          </a>
          <a :href="footer?.sosmed_twitter" target="_blank" rel="noopener noreferrer">
            <Icon name="mdi:twitter" />
          </a>
          <a :href="footer?.sosmed_youtube" target="_blank" rel="noopener noreferrer">
            <Icon name="icon-park-outline:youtube" />
          </a>
          <a :href="footer?.sosmed_linkedin" target="_blank" rel="noopener noreferrer">
            <Linkedin class="size-4" />
          </a>
        </div>
      </div>
      <div class="contact">
        <h2>{{ footer?.pt_name }}</h2>
        <a :href="`mailto:${footer?.email}`" class="contact__mail">{{ footer?.email }}</a>
        <p class="contact__phone">
          <a :href="`https://wa.me/${footer?.whatsapp_number}?text=${footer?.whatsapp_prerequisite_text}`" class="contact__phone-item" target="_blank" rel="noopener noreferrer">{{ footer?.whatsapp_number }}</a>
        </p>
        <div class="contact-address">
          <Icon name="mdi:map-marker-outline" class="contact-address-icon" />
          <span>{{ footer?.address }}</span>
        </div>
        <a class="wa-button" :href="`https://wa.me/${footer?.whatsapp_number}?text=${footer?.whatsapp_prerequisite_text}`" target="_blank" rel="noopener noreferrer">
          <Icon name="mdi:whatsapp" class="wa-button-title" />
          <p class="wa-button-item wa-button__text">Hubungi Kami</p>
        </a>
        <img src="/images/footer/rintik.png" alt="decoration" class="decoration-1" width="50" />
      </div>

      <img src="/images/footer/daun.png" alt="decoration" class="decoration-2" width="100" />
      <img src="/images/footer/daun-panjang.png" alt="decoration" class="decoration-3" width="130" />
      <img src="/images/footer/daun-lengkap.png" alt="decoration" class="decoration-4" width="100" />
    </div>
    <div class="copyright">
      <p>© {{ footer?.pt_name }} {{ new Date().getFullYear() }} All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Linkedin } from 'lucide-vue-next';
import { useHomeApi } from '@/composables/useHomeApi';
defineProps<{ bg_clr?: boolean }>();

const {
  footer
} = useHomeApi()

</script>

<style lang="scss" scoped>
@use '@/assets/scss/utils/_colors.scss' as *;
@use '@/assets/scss/utils/_breakpoints.scss' as *;

.contact__phone-item {
  color: map-get($colors, 'white', 'pure');
  text-decoration: none;
  font-size: 16px;
  margin-bottom: 0;

  &:hover {
    color: map-get($colors, 'green', 'light');
  }
}

footer {
  background-color: map-get($colors, 'black', 'indigo');
  overflow: hidden;

  .container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 8rem 1rem 5rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5rem;
    position: relative;

    .decoration-2 {
      position: absolute;
      top: 80px;
      right: -120px;

      @media #{$xs} {
        right: 0;
      }
    }

    .decoration-3 {
      position: absolute;
      bottom: 10px;
      right: -130px;

      @media #{$xs} {
        right: 0;
      }
    }

    .decoration-4 {
      position: absolute;
      bottom: 10px;
      left: -130px;

      @media #{$xs} {
        left: 0;
        bottom: 40%;
      }
    }

    @media #{$xs} {
      flex-direction: column;
      align-items: start;
    }
  }
}

.about-us {
  max-width: 300px;

  .title {
    font-weight: bold;
    font-size: 20px;
  }
}

.socials {
  display: flex;
  gap: 1rem;

  a {
    height: 40px;
    width: 40px;
    background-color: map-get($colors, 'white', 'pure');
    border-radius: 100%;
    color: map-get($colors, 'black', 'indigo');
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      background-color: map-get($colors, 'green', 'light');
      color: map-get($colors, 'white', 'pure');
    }
  }
}

footer p {
  font-family: 'Nunito', sans-serif;
  color: map-get($colors, 'white', 'pure');

  &.title {
    font-size: 20px;
    font-weight: bold;
    line-height: 32px;
    margin-bottom: 1rem;
  }

  &.description {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 1rem;
  }
}

.copyright {
  background-color: map-get($colors, 'grey', 'chaorcal');

  p {
    text-align: left;
    font-size: 14px;
    color: map-get($colors, 'white', 'pure');
    max-width: 1200px;
    margin-bottom: 0;
    padding: .8rem 1rem;
    margin: 0 auto;
  }
}

.contact {
  max-width: 400px;
  width: 100%;
  position: relative;

  .decoration-1 {
    position: absolute;
    bottom: -65px;
    left: 30px;
  }

  h2 {
    color: map-get($colors, 'white', 'pure');
    font-size: 34px;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  &__mail,
  &__phone,
  &__address {
    color: map-get($colors, 'white', 'pure');
    font-size: 16px;
    margin-bottom: .5rem;
    display: block;
  }

  &__address {
    margin-bottom: 1rem;
  }

  &-address {
    display: flex;
    align-items: start;
    justify-content: start;
    gap: 1rem;
    font-size: 16px;
    color: map-get($colors, 'white', 'pure');

    &-icon {
      font-size: 30px;
      width: 30px;
      display: block;
    }
  }

}

.wa-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: map-get($colors, 'white', 'pure');
  color: map-get($colors, 'black', 'indigo');
  margin-top: 2rem;
  padding: .3rem;
  border-radius: 5px;

  &-title {
    font-size: 30px;
    color: map-get($colors, 'green', 'light');
    margin-left: .8rem;
  }

  &-item {
    font-size: 16px;
    background-color: map-get($colors, 'green', 'medium-1');
    width: 100%;
    height: 100%;
    margin-bottom: 0;
    font-size: 12px;
    padding: .5rem 1rem;
    border-radius: 10px;

    &:hover {
      background-color: map-get($colors, 'green', 'light');
      color: map-get($colors, 'white', 'pure');
    }
  }

  &__text {
    font-size: 16px;

    a {
      font-size: 16px;
      color: map-get($colors, 'white', 'pure');
      text-decoration: none;
      margin-bottom: 0;

      p {
        margin: 0;
      }
    }
  }
}
</style>
