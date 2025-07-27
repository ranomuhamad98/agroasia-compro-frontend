<template>
    <div class="tp-home-faq">
        <div class="container">
            <div class="wrapper">
                <div class="title">
                    <nuxt-img src="/images/home/faq/logo.png" alt="Frequently Asked Questions" width="80" height="80" />
                    <h3 class="title__main">FAQ</h3>
                </div>
                <div class="content">
                    <div class="content__item" v-for="(faq, index) in props.faq" :key="`faq-${index}`">
                        <p class="question__icon">?</p>
                        <div class="question">
                            <h4 class="question__title">{{ faq.title }}</h4>
                            <p class="question__answer">{{ faq.content }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wrapper">
                <home-contact-us :header="props.header" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue';
import type { FAQ, Header } from '../../types/home-api-type';

const props = defineProps<{
    faq: DeepReadonly<FAQ[]>
    header: DeepReadonly<Header>
}>()

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
