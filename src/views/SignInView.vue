<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { customizeCategoryId, isCustomizeRoute } from '../data/libraryAccess'
import { signIn } from '../data/librarySession'
import { galleryLocation } from '../router/galleryLocation'

const route = useRoute()
const router = useRouter()
const key = ref('')
const pending = ref(false)
const error = ref('')

async function submit() {
  pending.value = true
  error.value = ''
  try {
    await signIn(key.value.trim())
    const redirect = route.query.next
    const target = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
      ? router.resolve(redirect)
      : null
    await router.replace(target && isCustomizeRoute(target)
      ? target.fullPath
      : galleryLocation({ category: customizeCategoryId }))
  } catch (problem) {
    error.value = problem.message
  } finally {
    key.value = ''
    pending.value = false
  }
}
</script>

<template>
  <section class="sign-in-panel" aria-labelledby="sign-in-title">
    <h1 id="sign-in-title">Sign in</h1>
    <p>Enter your library access key to sign in.</p>
    <form class="d-grid gap-3" @submit.prevent="submit">
      <div>
        <label class="form-label" for="library-access-key">Access key</label>
        <input
          id="library-access-key"
          v-model="key"
          class="form-control"
          type="password"
          autocomplete="current-password"
          maxlength="64"
          required
          :disabled="pending"
        >
      </div>
      <p v-if="error" class="text-danger mb-0" role="alert"><span>{{ error }}</span></p>
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <RouterLink class="text-button" :to="galleryLocation()">Continue as guest</RouterLink>
        <button class="primary-action" type="submit" :disabled="pending">{{ pending ? 'Signing in…' : 'Sign in' }}</button>
      </div>
    </form>
  </section>
</template>
