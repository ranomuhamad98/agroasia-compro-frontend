<template>
    <div class="tp-home-faq">
        <div class="container">
            <div class="wrapper">
                <div class="title">
                    <nuxt-img src="/images/home/faq/logo.png" alt="Frequently Asked Questions" width="80" height="80" />
                    <h3 class="title__main">FAQ</h3>
                </div>
                <div class="content">
                    <div class="content__item" v-for="faq in faqs" :key="faq.question">
                        <p class="question__icon">?</p>
                        <div class="question">
                            <h4 class="question__title">{{ faq.question }}</h4>
                            <p class="question__answer">{{ faq.answer }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wrapper">
                <home-contact-us />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const faqs = [
    {
        question: 'How do i place an order?',
        answer: 'Simply click on the product, enter the quantity, and click "Payment" to proceed via WhatsApp.'
    },
    {
        question: 'How can i become a partner?',
        answer: 'For partnership opportunities, please contact us via WhatsApp or email. We’ll guide you through our collaboration process.'
    },
    {
        question: 'What about shipping & pricing information?',
        answer: 'Shipping options, delivery times, and prices vary based on location and quantity. Contact us directly for a detailed quotation.'
    },
]
</script>
