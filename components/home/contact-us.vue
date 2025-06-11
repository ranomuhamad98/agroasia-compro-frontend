<template>
    <div class="tp-home-contact-us">
            <div class="title">
                <h3 class="title__main">Still have question to ask?</h3>
                <p class="title__sub">Fill the form, sent us message, we’ll contact you as soon as possible!</p>
            </div>
            <form action="">
                <div class="form-group">
                    <input type="text" placeholder="Name">
                    <input type="text" placeholder="Email">
                </div>
                <input type="text" placeholder="*Subject - write your subject to discuss" required>
                <textarea
                    placeholder="*Message - write your message to discuss"
                    rows="5"
                    required />
                <button type="submit">Submit</button>
            </form>
    </div>
</template>

<script setup lang="ts">
</script>