<template>
  <footer>
    <div class="tp-footer-area tp-footer-style-2 tp-footer-style-5" style="background-color: #f4f7f9" >
      <div class="tp-footer-top pt-95 pb-45">
          <div class="container">
            <div class="row">
                <div class="col-xl-4 col-lg-3 col-md-4 col-sm-6">
                  <div class="tp-footer-widget footer-col-1 mb-50">
                      <div class="tp-footer-widget-content">
                        <div class="tp-footer-logo">
                            <nuxt-link href="/">
                              <img src="/images/logo/logo.svg" alt="logo">
                            </nuxt-link>
                        </div>
                        <p class="tp-footer-desc">
                          We are a team of designers and developers that create high quality WordPress
                        </p>
                        <div class="tp-footer-social">
                            <social-links></social-links>
                        </div>
                      </div>
                  </div>
                </div>
                <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                  <div class="tp-footer-widget footer-col-2 mb-50">
                      <h4 class="tp-footer-widget-title">My Account</h4>
                      <div class="tp-footer-widget-content">
                        <ul>
                            <li><a href="#">Track Orders</a></li>
                            <li><a href="#">Shipping</a></li>
                            <li><a href="#">Wishlist</a></li>
                            <li><a href="#">My Account</a></li>
                            <li><a href="#">Order History</a></li>
                            <li><a href="#">Returns</a></li>
                        </ul>
                      </div>
                  </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                  <div class="tp-footer-widget footer-col-3 mb-50">
                      <h4 class="tp-footer-widget-title">Infomation</h4>
                      <div class="tp-footer-widget-content">
                        <ul>
                            <li><a href="#">Our Story</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Latest News</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                      </div>
                  </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                  <div class="tp-footer-widget footer-col-4 mb-50">
                      <h4 class="tp-footer-widget-title">Talk To Us</h4>
                      <div class="tp-footer-widget-content">
                        <div class="tp-footer-talk mb-20">
                            <span>Got Questions? Call us</span>
                            <h4><a href="tel:670-413-90-762">+670 413 90 762</a></h4>
                        </div>
                        <div class="tp-footer-contact">
                            <div class="tp-footer-contact-item d-flex align-items-start">
                              <div class="tp-footer-contact-icon">
                                  <span>
                                    <svg-email></svg-email>
                                  </span>
                              </div>
                              <div class="tp-footer-contact-content">
                                  <p><a href="mailto:shofi@gmail.com">shofi@gmail.com</a></p>
                              </div>
                            </div>
                            <div class="tp-footer-contact-item d-flex align-items-start">
                              <div class="tp-footer-contact-icon">
                                  <span>
                                    <svg-location></svg-location>
                                  </span>
                              </div>
                              <div class="tp-footer-contact-content">
                                  <p><a href="https://www.google.com/maps/place/Sleepy+Hollow+Rd,+Gouverneur,+NY+13642,+USA/@44.3304966,-75.4552367,17z/data=!3m1!4b1!4m6!3m5!1s0x4cccddac8972c5eb:0x56286024afff537a!8m2!3d44.3304928!4d-75.453048!16s%2Fg%2F1tdsjdj4" target="_blank">79 Sleepy Hollow St. <br> Jamaica, New York 1432</a></p>
                              </div>
                            </div>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
          </div>
      </div>
      <div class="tp-footer-bottom">
          <div class="container">
            <div class="tp-footer-bottom-wrapper">
                <div class="row align-items-center">
                  <div class="col-md-6">
                      <div class="tp-footer-copyright">
                        <p>© {{new Date().getFullYear()}} All Rights Reserved  |  Vue nuxt Template by <nuxt-link href="/">Themepure</nuxt-link>.</p>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="tp-footer-payment text-md-end">
                        <p>
                            <img src="/images/footer/footer-pay-2.png" alt="">
                        </p>
                      </div>
                  </div>
                </div>
            </div>
          </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{bg_clr?:boolean}>();
</script>
