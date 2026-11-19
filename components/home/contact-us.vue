<template>
    <div id="contact-us" class="tp-home-contact-us">
        <div class="title">
            <h3 class="title__main">Still have question to ask?</h3>
            <p class="title__sub">Fill the form, sent us message, we’ll contact you as soon as possible!</p>
        </div>
        <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
        <form @submit="handleSubmit" method="post" enctype="text/plain">
            <input type="text" v-model="form.name" name="name" placeholder="*Your Name" required>
            <div class="form-group">
                <input type="number" v-model="form.phone" name="phone" placeholder="*Your Phone No" required>
                <input type="email" v-model="form.email" name="email" placeholder="*Your Email" required>
            </div>
            <input type="text" v-model="form.subject" name="subject"
                placeholder="*Subject - write your subject to discuss" required>
            <textarea v-model="form.message" name="message" placeholder="*Message - write your message to discuss"
                rows="5" required />
            <button type="submit" :disabled="isLoading">
                <span v-if="isLoading">Sending...</span>
                <span v-else>Submit</span>
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import type { DeepReadonly } from 'vue';
import type { Header } from '../../types/home-api-type';
import { useContactUsApi } from '@/composables/useContactUsApi'
import type { ContactUsPayload } from '@/types/contact-us-api-type';
import { toast } from 'vue3-toastify';

const props = defineProps<{
    header: DeepReadonly<Header>
}>()

const form = ref<ContactUsPayload>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
})

const { sendMessage, isLoading, error } = useContactUsApi()

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const response = await sendMessage(form.value);
    if (response.status === 201) {
        form.value = {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        }
    }
}
</script>