<template>
  <div>
    <!-- invoice start -->
    <section class="invoice__area pt-120 pb-120">
      <div class="container">
        <div class="invoice__msg-wrapper">
          <div class="row">
            <div class="col-xl-12">
              <div class="invoice_msg mb-40">
                <p class="text-black alert alert-success">Thank you <strong>Mark Doe</strong> Your order have been received ! </p>
              </div>
            </div>
          </div>
        </div>
        <div class="invoice__wrapper grey-bg-2 pt-40 pb-40 pl-40 pr-40 tp-invoice-print-wrapper">
          <div class="invoice__header-wrapper border-2 border-bottom border-white mb-40">
            <div class="row">
              <div class="col-xl-12">
                <div class="invoice__header pb-20">
                  <div class="row align-items-end">
                    <div class="col-md-4 col-sm-6">
                      <div class="invoice__left">
                        <img alt="logo" src="/images/logo/logo.svg" class="mb-15">
                        <p>2879 Elk Creek Road <br> Stone Mountain, Georgia </p>
                      </div>
                    </div>
                    <div class="col-md-8 col-sm-6">
                      <div class="invoice__right mt-15 mt-sm-0 text-sm-end">
                        <h3 class="text-uppercase font-70 mb-20">Invoice</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="invoice__customer mb-30">
            <div class="row">
              <div class="col-md-6 col-sm-8">
                <div class="invoice__customer-details">
                  <h4 class="mb-10 text-uppercase">Mark Doe</h4>
                  <p class="mb-0 text-uppercase">United State</p>
                  <p class="mb-0 text-uppercase">Washington DC</p>
                  <p class="mb-0">123456789</p>
                </div>
              </div>
              <div class="col-md-6 col-sm-4">
                <div class="invoice__details mt-md-0 mt-20 text-md-end">
                  <p class="mb-0">
                    <strong>Invoice ID:</strong> #10046
                  </p>
                  <p class="mb-0">
                    <strong>Date:</strong> May 13, 2023
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="invoice__order-table pt-30 pb-30 pl-40 pr-40 bg-white mb-30">
            <table class="table">
              <thead class="table-light">
                <tr>
                  <th scope="col">SL</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Item Price</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody class="table-group-divider">
                <tr>
                  <td>1</td>
                  <td>Apple Watch Series 8</td>
                  <td>1</td>
                  <td>$188</td>
                  <td>$188</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="invoice__total pt-40 pb-10 alert-success pl-40 pr-40 mb-30">
            <div class="row">
              <div class="col-lg-3 col-md-4">
                <div class="invoice__payment-method mb-30">
                  <h5 class="mb-0">Payment Method</h5>
                  <p class="tp-font-medium text-uppercase">card</p>
                </div>
              </div>
              <div class="col-lg-3 col-md-4">
                <div class="invoice__shippint-cost mb-30">
                  <h5 class="mb-0">Shipping Cost</h5>
                  <p class="tp-font-medium">$20</p>
                </div>
              </div>
              <div class="col-lg-3 col-md-4">
                <div class="invoice__discount-cost mb-30">
                  <h5 class="mb-0">Discount</h5>
                  <p class="tp-font-medium">$0.00</p>
                </div>
              </div>
              <div class="col-lg-3 col-md-4">
                <div class="invoice__total-ammount mb-30">
                  <h5 class="mb-0">Total Ammount</h5>
                  <p class="tp-font-medium text-danger">
                    <strong>$208</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <div class="invoice__print text-end mt-3">
          <div class="row">
            <div class="col-xl-12">
              <button type="button" class="tp-invoice-print tp-btn tp-btn-black">
                <span class="mr-5">
                  <i class="fa-regular fa-print"></i>
                </span> Print </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- invoice end -->
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: "Invoice Page" });
</script>
