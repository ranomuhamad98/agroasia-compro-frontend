<template>
  <footer>
    <div class="container">
      <div class="about-us">
        <p class="title">About Us.</p>
        <p class="description">orporate clients and leisure travelers has been relying on Groundlink for dependable
          safe, and professional
          chauffeured car service in major cities across World. Indeed it has been more than one decade and five years
          that Groundlink</p>
        <div class="socials">
          <a href="https://www.facebook.com/profile.php?id=100093111111111" target="_blank" rel="noopener noreferrer">
            <Icon name="fa:facebook" />
          </a>
          <a href="https://www.twitter.com/profile.php?id=100093111111111" target="_blank" rel="noopener noreferrer">
            <Icon name="mdi:twitter" />
          </a>
          <a href="https://vimeo.com/profile.php?id=100093111111111" target="_blank" rel="noopener noreferrer">
            <Icon name="entypo-social:vimeo" />
          </a>
          <a href="https://www.linkedin.com/profile.php?id=100093111111111" target="_blank" rel="noopener noreferrer">
            <Icon name="streamline-logos:path-logo-solid" />
          </a>
        </div>
      </div>
      <div class="contact">
        <h2>PT Agro Asia Berdikari</h2>
        <a href="mailto:agroasia119@gmail.com" class="contact__mail">agroasia119@gmail.com</a>
        <p class="contact__phone">+62 812 773 3166 | +62 21 74634590</p>
        <div class="contact-address">
          <Icon name="mdi:map-marker-outline" class="contact-address-icon" />
          <span>Jl Palapa perum serua barokah Blok D12 serua Tangerang selatan 15414</span>
        </div>
        <a class="wa-button" href="https://wa.me/628127733166" target="_blank" rel="noopener noreferrer">
          <Icon name="mdi:whatsapp" class="wa-button-title" />
          <p class="wa-button-item wa-button__text">+62 812 773 3166</p>
        </a>
      </div>
    </div>
    <div class="copyright">
      <p>© Agro Asia Berdikari 2025 All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{ bg_clr?: boolean }>();
</script>

<style lang="scss" scoped>
@use '@/assets/scss/utils/_colors.scss' as *;
@use '@/assets/scss/utils/_breakpoints.scss' as *;

footer {
  background-color: map-get($colors, 'black', 'indigo');

  .container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 8rem 1rem 2rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5rem;

    @media #{$xs} {
      flex-direction: column;
      align-items: start;
    }
  }
}

.about-us {
  max-width: 300px;
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
    font-size: 24px;
    color: map-get($colors, 'green', 'light');
    margin-left: .8rem;
  }

  &-item {
    font-size: 16px;
    background-color: map-get($colors, 'green', 'light');
    width: 100%;
    height: 100%;
    margin-bottom: 0;
    font-size: 12px;
    padding: .5rem 1rem;
    border-radius: 10px;

    &:hover {
      background-color: map-get($colors, 'green', 'medium');
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
