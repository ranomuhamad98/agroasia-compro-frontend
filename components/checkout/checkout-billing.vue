<template>
  <div class="tp-checkout-bill-form">
      <div class="tp-checkout-bill-inner">
          <div class="row">
            <div class="col-md-6">
                <div class="tp-checkout-input">
                  <label>First Name <span>*</span></label>
                  <Field name="firstName" placeholder="First Name" type="text" />
                  <ErrorMessage name="firstName" class="error" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="tp-checkout-input">
                  <label>Last Name <span>*</span></label>
                  <Field name="lastName" placeholder="Last Name" type="text" />
                  <ErrorMessage name="lastName" class="error" />
                </div>
            </div>
            <div class="col-md-12">
                <div class="tp-checkout-input">
                  <label>Company name (optional)</label>
                  <Field name="company" placeholder="Example LTD." type="text" />
                </div>
            </div>
            <div class="col-md-12">
                <div class="tp-checkout-input">
                  <label>Country / Region </label>
                  <Field name="country" placeholder="United States (US)" type="text" />
                  <ErrorMessage name="country" class="error" />
                </div>
            </div>
            <div class="col-md-12">
                <div class="tp-checkout-input">
                  <label>Street address</label>
                  <Field name="address" placeholder="House number and street name" type="text" />
                  <ErrorMessage name="address" class="error" />
                </div>

                <div class="tp-checkout-input">
                  <input type="text" placeholder="Apartment, suite, unit, etc. (optional)">
                </div>
            </div>
            <div class="col-md-12">
                <div class="tp-checkout-input">
                  <label>Town / City</label>
                  <Field name="city" placeholder="City" type="text" />
                  <ErrorMessage name="city" class="error" />
                </div>
            </div>
            <div class="col-md-6">
                <div class="tp-checkout-input">
                  <label>State / County</label>
                  <ui-nice-select
                    :options="[
                      { value: 'new-york-us', text: 'New York US' },
                      { value: 'berlin-germany', text: 'Berlin Germany' },
                      { value: 'paris-france', text: 'Paris France' },
                      { value: 'tokiyo-japan', text: 'Tokiyo Japan' }
                    ]"
                    name="New York US"
                    :default-current="0"
                    @onChange="changeHandler"
                  />
                </div>
            </div>
            <div class="col-md-6">
                <div class="tp-checkout-input">
                  <label>Postcode ZIP</label>
                  <Field name="zipCode" placeholder="zipCode" type="text" />
                  <ErrorMessage name="zipCode" class="error" />
                </div>
            </div>
            <div class="col-md-12">
                <div class="tp-checkout-input">
                  <label>Phone <span>*</span></label>
                  <Field name="phone" placeholder="Phone" type="text" />
                  <ErrorMessage name="phone" class="error" />
                </div>
            </div>
            <div class="col-md-12">
                <div class="tp-checkout-input">
                  <label>Email address <span>*</span></label>
                  <Field name="email" placeholder="Email" type="text" />
                  <ErrorMessage name="email" class="error" />
                </div>
            </div>
            <div class="col-md-12">
                <div class="tp-checkout-input">
                  <label>Order notes (optional)</label>
                  <Field name="orderNote" v-slot="{ field }">
                    <textarea v-bind="field" id="orderNote" name="orderNote" placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                  </Field>
                </div>
            </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';

let selectedState = ref('');

const changeHandler = (e: { value: string; text: string }) => {
  selectedState.value = e.value;
};
</script>
