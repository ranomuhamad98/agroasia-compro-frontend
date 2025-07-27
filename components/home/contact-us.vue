<template>
    <div id="contact-us" class="tp-home-contact-us">
        <div class="title">
            <h3 class="title__main">Still have question to ask?</h3>
            <p class="title__sub">Fill the form, sent us message, we’ll contact you as soon as possible!</p>
        </div>
        <form  :action="`mailto:${props.header.email}`" method="post" enctype="text/plain">
            <div class="form-group">
                <input type="text" name="name" placeholder="*Your Name" required>
                <input type="text" name="emailOrWhatsapp" placeholder="*Your Phone No / Email" required>
            </div>
            <input type="text" name="subject" placeholder="*Subject - write your subject to discuss" required>
            <textarea name="message" placeholder="*Message - write your message to discuss" rows="5" required />
            <button type="submit">Submit</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue';
import type { Header } from '../../types/home-api-type';

const props = defineProps<{
    header: DeepReadonly<Header>
}>()
</script>