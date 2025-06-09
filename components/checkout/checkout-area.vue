<template>
  <section class="tp-checkout-area pb-120" style="background-color: #EFF1F5;">
    <div class="container">
      <div v-if="cartStore.cart_products.length === 0" class="text-center pt-50">
        <h3 class="py-2">No items found in cart to checkout</h3>
        <nuxt-link href="/shop" class="tp-checkout-btn">
          Return to shop
        </nuxt-link>
      </div>
      <div v-else class="row">
        <div class="col-xl-7 col-lg-7">
          <!-- checkout verify start -->
          <checkout-verify />
          <!-- checkout verify end -->
        </div>
        <!-- form start -->
        <Form @submit="handleOnSubmit" :validation-schema="schema">
          <div class="row">
            <div class="col-lg-7">
              <div class="tp-checkout-bill-area">
                <h3 class="tp-checkout-bill-title">Billing Details</h3>
                <checkout-billing />
              </div>
            </div>
            <div class="col-lg-5">
              <!-- checkout place order -->
              <checkout-order />
              <!-- checkout place order -->
            </div>
          </div>
        </Form>
        <!-- form end -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import {useCartStore} from '@/pinia/useCartStore';

const cartStore = useCartStore();

import { Form } from 'vee-validate';

const schema = yup.object({
  firstName: yup.string().required().label("First Name"),
  lastName: yup.string().required().label("Last Name"),
  company: yup.string().label("Company"),
  country: yup.string().required().label("Country"),
  address: yup.string().required().label("Address"),
  city: yup.string().required().label("City"),
  state: yup.string().required().label("State"),
  zipCode: yup.string().required().label("zipCode"),
  phone: yup.string().required().label("Phone"),
  orderNote: yup.string().label("Order Note"),
  email: yup.string().required().email().label("Email"),
});

const handleOnSubmit = () => {
  
}
</script>
