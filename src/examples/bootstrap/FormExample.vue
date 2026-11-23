<script setup>
import { ref, useId } from 'vue'

const fieldId = useId()
const name = ref('')
const role = ref('')
const updates = ref(false)
const result = ref('')

function submit() {
  const trimmedName = name.value.trim()
  result.value = trimmedName ? `Submitted for ${trimmedName}.` : 'Enter your name before submitting.'
}
</script>

<template>
  <form class="d-grid gap-2 small" style="width: min(100%, 18rem)" @submit.prevent="submit">
    <div>
      <label class="form-label mb-1" :for="`${fieldId}-name`">Name</label>
      <input :id="`${fieldId}-name`" v-model="name" class="form-control form-control-sm" placeholder="Your name" required>
    </div>
    <div>
      <label class="form-label mb-1" :for="`${fieldId}-role`">Role</label>
      <select :id="`${fieldId}-role`" v-model="role" class="form-select form-select-sm" required>
        <option value="" disabled>Select a role</option>
        <option>Designer</option>
        <option>Developer</option>
      </select>
    </div>
    <div class="form-check mb-0">
      <input :id="`${fieldId}-updates`" v-model="updates" class="form-check-input" type="checkbox">
      <label class="form-check-label" :for="`${fieldId}-updates`">Send me updates</label>
    </div>
    <button type="submit" class="btn btn-primary btn-sm">Submit</button>
    <p v-if="result" class="mb-0" role="status">{{ result }}</p>
  </form>
</template>

<style scoped>
form > .btn {
  justify-self: start;
}
</style>
