<script setup>
import { computed, onMounted, onUnmounted, ref, useId } from 'vue'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'

const staff = [
  { id: 'maya', name: 'Maya Patel', initials: 'MP', color: '#e3eee2' },
  { id: 'leo', name: 'Leo Brooks', initials: 'LB', color: '#e8e8f5' },
  { id: 'nia', name: 'Nia Reed', initials: 'NR', color: '#f3e5d8' },
  { id: 'kai', name: 'Kai Morgan', initials: 'KM', color: '#dcebea' },
  { id: 'rosa', name: 'Rosa Alvarez', initials: 'RA', color: '#f3e4e9' },
]

const statuses = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  completed: 'Completed',
  blocked: 'Blocked',
}
const appointmentStatuses = ['confirmed', 'pending', 'completed']

// Time values are minutes after midnight in the viewer's local time.
const firstMinute = 9 * 60
const lastMinute = 15 * 60
const slotMinutes = 15
const slots = (lastMinute - firstMinute) / slotMinutes
const times = Array.from({ length: slots + 1 }, (_, index) => firstMinute + index * slotMinutes)
const hourMarks = times.filter(time => time % 60 === 0 && time < lastMinute)
const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })
const hourFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric' })

function timeAt(minutes) {
  return new Date(2000, 0, 1, 0, minutes)
}

function formatTime(minutes, formatter = timeFormat) {
  return formatter.format(timeAt(minutes))
}

function dateKey(date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
}

const selectedDate = ref(new Date())
const entries = ref([
  ['maya', 570, 630, 'Jordan Lee', 'Cut & finish', 'confirmed'],
  ['maya', 630, 645, 'Avery Shaw', 'Consultation', 'completed'],
  ['maya', 690, 735, 'Elena Rossi', 'Color consultation', 'pending'],
  ['maya', 765, 810, 'Noah Banks', 'Cut & finish', 'confirmed'],
  ['leo', 540, 570, 'Charlie Kim', 'Express cut', 'completed'],
  ['leo', 585, 630, 'Morgan Tate', 'Beard trim', 'confirmed'],
  ['leo', 660, 720, 'Lunch break', '', 'blocked'],
  ['leo', 735, 780, 'Ellis Green', 'Cut & finish', 'confirmed'],
  ['nia', 540, 600, 'Robin Wells', 'Color consultation', 'confirmed'],
  ['nia', 615, 660, 'Harper Ellis', 'Wash & style', 'pending'],
  ['nia', 720, 765, 'Sasha Cole', 'Wash & style', 'confirmed'],
  ['nia', 795, 855, 'Team training', '', 'blocked'],
  ['kai', 555, 585, 'Drew Adams', 'Beard trim', 'completed'],
  ['kai', 600, 660, 'Cameron Price', 'Cut & finish', 'confirmed'],
  ['kai', 675, 705, 'Studio prep', '', 'blocked'],
  ['kai', 735, 795, 'Jamie Hill', 'Color refresh', 'pending'],
  ['rosa', 540, 585, 'Riley James', 'Wash & style', 'confirmed'],
  ['rosa', 600, 645, 'Tessa Chen', 'Cut & finish', 'pending'],
  ['rosa', 660, 675, 'Sam Torres', 'Consultation', 'confirmed'],
  ['rosa', 720, 780, 'Lunch break', '', 'blocked'],
  ['rosa', 795, 840, 'Frankie Bell', 'Wash & style', 'confirmed'],
].map(([staffId, start, end, name, service, status], index) => ({
  id: index + 1,
  date: dateKey(selectedDate.value),
  staffId,
  start,
  end,
  name,
  service,
  status,
})))
let nextId = entries.value.length + 1

const dayEntries = computed(() => {
  const day = dateKey(selectedDate.value)
  return entries.value.filter(entry => entry.date === day)
})
const staffSchedule = computed(() => staff.map(person => ({
  ...person,
  entries: dayEntries.value
    .filter(entry => entry.staffId === person.id)
    .sort((first, second) => first.start - second.start),
})))
const appointmentCount = computed(() => dayEntries.value.filter(entry => entry.status !== 'blocked').length)

const now = ref(new Date())
let clock
onMounted(() => {
  clock = setInterval(() => { now.value = new Date() }, 60_000)
})
onUnmounted(() => clearInterval(clock))

const currentMinute = computed(() => {
  if (dateKey(now.value) !== dateKey(selectedDate.value)) return null

  const minute = now.value.getHours() * 60 + now.value.getMinutes()
  return minute >= firstMinute && minute < lastMinute ? minute : null
})

function selectDate(date) {
  if (date instanceof Date) selectedDate.value = date
}

function moveDay(offset) {
  const date = selectedDate.value
  selectedDate.value = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset)
}

function rowAt(minutes) {
  return (minutes - firstMinute) / slotMinutes + 1
}

function entryLabel(entry) {
  return [entry.name, entry.service, `${formatTime(entry.start)} to ${formatTime(entry.end)}`, statuses[entry.status]]
    .filter(Boolean)
    .join(', ')
}

const uid = useId()
const editorVisible = ref(false)
const draft = ref(null)
const error = ref('')
const isBlock = computed(() => draft.value?.status === 'blocked')
const editorTitle = computed(() => {
  if (isBlock.value) return draft.value.id ? 'Blocked time' : 'Block time'
  return draft.value?.id ? 'Appointment details' : 'New appointment'
})
const saveLabel = computed(() => {
  if (draft.value?.id) return 'Save changes'
  return isBlock.value ? 'Save block' : 'Save appointment'
})

function editEntry(entry) {
  draft.value = { ...entry }
  error.value = ''
  editorVisible.value = true
}

function createEntry(status) {
  editEntry({
    date: dateKey(selectedDate.value),
    staffId: staff[0].id,
    start: firstMinute,
    end: firstMinute + 30,
    name: '',
    service: '',
    status,
  })
}

function saveEntry() {
  const entry = { ...draft.value, name: draft.value.name.trim(), service: draft.value.service.trim() }
  if (!entry.name || (!isBlock.value && !entry.service)) {
    error.value = isBlock.value ? 'Enter a reason.' : 'Enter the client name and service.'
    return
  }
  if (entry.end <= entry.start) {
    error.value = 'End time must be after start time.'
    return
  }

  const conflict = entries.value.some(existing =>
    existing.id !== entry.id &&
    existing.date === entry.date &&
    existing.staffId === entry.staffId &&
    existing.start < entry.end &&
    existing.end > entry.start,
  )
  if (conflict) {
    error.value = 'This staff member already has something scheduled during that time.'
    return
  }

  if (entry.id) {
    const index = entries.value.findIndex(existing => existing.id === entry.id)
    entries.value[index] = entry
  } else {
    entries.value.push({ ...entry, id: nextId++ })
  }
  editorVisible.value = false
}
</script>

<template>
  <section class="appointment-calendar" :aria-labelledby="`${uid}-title`">
    <header class="schedule-header d-flex align-items-center justify-content-between flex-wrap gap-3">
      <div>
        <h2 :id="`${uid}-title`" class="schedule-title">Staff schedule</h2>
        <p class="schedule-location mb-0">Studio North</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <Button unstyled class="schedule-button" label="Block time" @click="createEntry('blocked')" />
        <Button
          unstyled
          class="schedule-button schedule-primary"
          label="New appointment"
          @click="createEntry('confirmed')"
        />
      </div>
    </header>

    <div class="schedule-toolbar d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div class="d-flex align-items-center flex-wrap gap-2">
        <label class="visually-hidden" :for="`${uid}-date`">Schedule date</label>
        <DatePicker
          :input-id="`${uid}-date`"
          :model-value="selectedDate"
          :manual-input="false"
          class="schedule-date"
          date-format="DD, MM d"
          show-icon
          icon-display="input"
          @update:model-value="selectDate"
        />
        <div class="d-flex align-items-center gap-1" role="group" aria-label="Date navigation">
          <Button unstyled class="schedule-button day-arrow" aria-label="Previous day" @click="moveDay(-1)">
            <span class="chevron" aria-hidden="true"></span>
          </Button>
          <Button unstyled class="schedule-button" label="Today" @click="selectDate(new Date())" />
          <Button unstyled class="schedule-button day-arrow" aria-label="Next day" @click="moveDay(1)">
            <span class="chevron chevron-forward" aria-hidden="true"></span>
          </Button>
        </div>
      </div>
      <span class="schedule-count" aria-live="polite">
        {{ appointmentCount }} {{ appointmentCount === 1 ? 'appointment' : 'appointments' }}
      </span>
    </div>

    <div
      class="schedule-scroll"
      role="region"
      aria-label="Appointment schedule grid"
      tabindex="0"
    >
      <div class="schedule-grid" :style="{ '--staff-count': staff.length, '--slot-count': slots }">
        <div class="schedule-corner" aria-hidden="true">Time</div>
        <div v-for="person in staff" :key="person.id" class="staff-heading">
          <span class="staff-avatar" :style="{ backgroundColor: person.color }" aria-hidden="true">
            {{ person.initials }}
          </span>
          <span>{{ person.name }}</span>
        </div>

        <div class="time-rail">
          <span
            v-for="time in hourMarks"
            :key="time"
            class="time-label"
            :style="{ gridRow: rowAt(time) }"
          >
            {{ formatTime(time, hourFormat) }}
          </span>
          <span
            v-if="currentMinute !== null"
            class="current-time-label"
            :style="{ '--time-row': rowAt(currentMinute) - 1 }"
          >
            {{ formatTime(currentMinute) }}
          </span>
        </div>
        <div
          v-for="person in staffSchedule"
          :key="person.id"
          class="staff-lane"
          role="group"
          :aria-label="person.name"
        >
          <span
            v-if="currentMinute !== null"
            class="current-time-line"
            :style="{ '--time-row': rowAt(currentMinute) - 1 }"
            aria-hidden="true"
          ></span>
          <button
            v-for="entry in person.entries"
            :key="entry.id"
            type="button"
            class="appointment-entry"
            :class="{ 'appointment-compact': entry.end - entry.start === slotMinutes }"
            :data-status="entry.status"
            :style="{ gridRow: `${rowAt(entry.start)} / ${rowAt(entry.end)}` }"
            :aria-label="entryLabel(entry)"
            @click="editEntry(entry)"
          >
            <span class="appointment-name">{{ entry.name }}</span>
            <span v-if="entry.service" class="appointment-service">{{ entry.service }}</span>
            <span class="appointment-time">{{ timeFormat.formatRange(timeAt(entry.start), timeAt(entry.end)) }}</span>
          </button>
        </div>
      </div>
    </div>

    <footer class="schedule-footer d-flex align-items-center flex-wrap gap-3">
      <ul class="schedule-legend d-flex flex-wrap list-unstyled gap-3 mb-0" aria-label="Appointment statuses">
        <li v-for="(label, status) in statuses" :key="status" :data-status="status">{{ label }}</li>
      </ul>
      <p v-if="!dayEntries.length" class="schedule-empty ms-auto mb-0" role="status">
        No appointments or blocks for this day.
      </p>
    </footer>

    <Dialog v-model:visible="editorVisible" modal :header="editorTitle" :style="{ width: 'min(29rem, 94vw)' }">
      <form v-if="draft" class="d-grid gap-3" @submit.prevent="saveEntry">
        <div>
          <label class="form-label" :for="`${uid}-name`">{{ isBlock ? 'Reason' : 'Client name' }}</label>
          <input :id="`${uid}-name`" v-model="draft.name" class="form-control" required autofocus>
        </div>
        <div v-if="!isBlock">
          <label class="form-label" :for="`${uid}-service`">Service</label>
          <input :id="`${uid}-service`" v-model="draft.service" class="form-control" required>
        </div>
        <div>
          <label class="form-label" :for="`${uid}-staff`">Staff member</label>
          <select :id="`${uid}-staff`" v-model="draft.staffId" class="form-select">
            <option v-for="person in staff" :key="person.id" :value="person.id">{{ person.name }}</option>
          </select>
        </div>
        <div class="row g-2">
          <div class="col">
            <label class="form-label" :for="`${uid}-start`">Start time</label>
            <select :id="`${uid}-start`" v-model="draft.start" class="form-select">
              <option v-for="time in times.slice(0, -1)" :key="time" :value="time">{{ formatTime(time) }}</option>
            </select>
          </div>
          <div class="col">
            <label class="form-label" :for="`${uid}-end`">End time</label>
            <select :id="`${uid}-end`" v-model="draft.end" class="form-select">
              <option v-for="time in times.slice(1)" :key="time" :value="time">{{ formatTime(time) }}</option>
            </select>
          </div>
        </div>
        <div v-if="!isBlock">
          <label class="form-label" :for="`${uid}-status`">Status</label>
          <select :id="`${uid}-status`" v-model="draft.status" class="form-select">
            <option v-for="status in appointmentStatuses" :key="status" :value="status">{{ statuses[status] }}</option>
          </select>
        </div>
        <p v-if="error" role="alert" class="text-danger small mb-0">{{ error }}</p>
        <div class="d-flex justify-content-end flex-wrap gap-2">
          <Button type="button" severity="secondary" outlined label="Cancel" @click="editorVisible = false" />
          <Button type="submit" :label="saveLabel" />
        </div>
      </form>
    </Dialog>
  </section>
</template>

<style scoped>
.appointment-calendar {
  --schedule-ink: #1c2d2a;
  --schedule-muted: #51615e;
  --schedule-line: #dce7e2;
  --schedule-accent: #225d50;
  --schedule-slot-height: 1.65rem;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--schedule-line);
  border-radius: 0.8rem;
  background: #fff;
  color: var(--schedule-ink);
}

.schedule-header {
  padding: 1.05rem clamp(0.75rem, 2vw, 1.3rem);
  border-bottom: 1px solid var(--schedule-line);
  background: #f0f6f2;
}

.appointment-calendar .schedule-title {
  margin: 0;
  color: var(--schedule-ink);
  font-size: 1.15rem;
  font-weight: 750;
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.schedule-location {
  margin-top: 0.2rem;
  color: var(--schedule-muted);
  font-size: 0.75rem;
}

.schedule-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.125rem;
  padding: 0.35rem 0.65rem;
  border: 1px solid #cfdfd7;
  border-radius: 0.4rem;
  background: #fff;
  color: var(--schedule-ink);
  font-size: 0.75rem;
  font-weight: 650;
  line-height: 1.2;
}

.schedule-button:hover {
  background: #f2f8f4;
}

.schedule-primary {
  border-color: var(--schedule-accent);
  background: var(--schedule-accent);
  color: #fff;
}

.schedule-primary:hover {
  background: #17483d;
}

.schedule-toolbar {
  padding: 0.65rem clamp(0.75rem, 2vw, 1.3rem);
  border-bottom: 1px solid var(--schedule-line);
}

.schedule-date {
  max-width: 100%;
  width: 14.5rem;
}

.schedule-date :deep(input) {
  width: 100%;
  min-width: 0;
  padding-block: 0.35rem;
  border-color: #cfdfd7;
  color: var(--schedule-ink);
  font-size: 0.83rem;
  font-weight: 700;
  cursor: pointer;
}

.schedule-date :deep(svg) {
  color: var(--schedule-accent);
}

.day-arrow {
  width: 2.125rem;
  padding-inline: 0;
}

.chevron {
  width: 0.42rem;
  height: 0.42rem;
  border: solid var(--schedule-accent);
  border-width: 0 0 1.5px 1.5px;
  transform: translateX(1px) rotate(45deg);
}

.chevron-forward {
  transform: translateX(-1px) rotate(225deg);
}

.schedule-count,
.schedule-legend,
.schedule-empty {
  color: var(--schedule-muted);
  font-size: 0.72rem;
  font-weight: 550;
}

.schedule-scroll {
  max-height: var(--schedule-grid-max-height, 32rem);
  overflow: auto;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 4.05rem repeat(var(--staff-count), minmax(8.4rem, 1fr));
  width: max(100%, calc(4.05rem + 8.4rem * var(--staff-count)));
}

.schedule-corner,
.staff-heading {
  position: sticky;
  z-index: 2;
  top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 3.05rem;
  padding: 0.5rem 0.6rem;
  border-right: 1px solid var(--schedule-line);
  border-bottom: 1px solid var(--schedule-line);
  background: #fbfdfb;
  font-size: 0.75rem;
  font-weight: 700;
}

.schedule-corner,
.time-rail {
  left: 0;
  z-index: 2;
}

.schedule-corner {
  z-index: 3;
  color: var(--schedule-muted);
}

.staff-avatar {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 0.45rem;
  font-size: 0.62rem;
}

.time-rail,
.staff-lane {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: repeat(var(--slot-count), var(--schedule-slot-height));
  border-right: 1px solid var(--schedule-line);
}

.time-rail {
  position: sticky;
  background: #f8fbf9;
}

.time-label {
  grid-column: 1;
  padding: 0.23rem 0.45rem;
  border-top: 1px solid var(--schedule-line);
  color: var(--schedule-muted);
  text-align: right;
  white-space: nowrap;
  font-size: 0.68rem;
  font-variant-numeric: tabular-nums;
}

.staff-lane {
  background:
    repeating-linear-gradient(to bottom, var(--schedule-line) 0 1px, transparent 1px calc(4 * var(--schedule-slot-height))),
    repeating-linear-gradient(to bottom, #edf2ef 0 1px, transparent 1px var(--schedule-slot-height)),
    #fcfdfc;
}

.staff-lane:nth-child(even) {
  background-color: #f8fbf9;
}

.current-time-label,
.current-time-line {
  position: absolute;
  top: calc(var(--time-row) * var(--schedule-slot-height));
  pointer-events: none;
}

.current-time-line {
  inset-inline: 0;
  border-top: 2px solid #3f8b77;
}

.current-time-label {
  right: 0;
  z-index: 1;
  padding: 0.13rem 0.28rem;
  transform: translateY(-50%);
  border-radius: 0.26rem 0 0 0.26rem;
  background: var(--schedule-accent);
  color: #fff;
  font-size: 0.62rem;
  font-variant-numeric: tabular-nums;
}

[data-status='confirmed'] {
  --status-dot: #2d8265;
  --status-fill: #ebf7ef;
  --status-border: #c1dfce;
}

[data-status='pending'] {
  --status-dot: #946311;
  --status-fill: #fcf3df;
  --status-border: #ecd6a1;
}

[data-status='completed'] {
  --status-dot: #546c9c;
  --status-fill: #eef2fa;
  --status-border: #d1ddef;
}

[data-status='blocked'] {
  --status-dot: #676f72;
  --status-fill: repeating-linear-gradient(135deg, #f4f6f5 0 5px, #eaeeec 5px 6px);
  --status-border: #d2dbd6;
}

.appointment-entry {
  position: relative;
  grid-column: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  margin: 2px 0.32rem;
  padding: 0.18rem 0.95rem 0.12rem 0.42rem;
  overflow: hidden;
  border: 1px solid var(--status-border);
  border-left: 2px solid var(--status-dot);
  border-radius: 0.34rem;
  background: var(--status-fill);
  box-shadow: 0 1px 2px #10281d0f;
  color: var(--schedule-ink);
  text-align: left;
  line-height: 1.15;
}

.appointment-entry:hover,
.appointment-entry:focus-visible {
  z-index: 1;
  border-color: var(--status-dot);
}

.appointment-calendar :where(button, input, [tabindex]):focus-visible {
  outline: 2px solid var(--schedule-accent);
  outline-offset: -2px;
}

.appointment-entry::after {
  position: absolute;
  top: 0.4rem;
  right: 0.35rem;
  width: 0.31rem;
  height: 0.31rem;
  border-radius: 50%;
  background: var(--status-dot);
  content: '';
}

.appointment-entry > span {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.appointment-name {
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 700;
}

.appointment-service,
.appointment-time {
  flex-shrink: 0;
  margin-top: 0.11rem;
  color: var(--schedule-muted);
  font-size: 0.64rem;
}

.appointment-time {
  font-variant-numeric: tabular-nums;
}

.appointment-compact .appointment-service,
.appointment-compact .appointment-time {
  display: none;
}

.schedule-footer {
  padding: 0.65rem clamp(0.75rem, 2vw, 1.3rem);
  border-top: 1px solid var(--schedule-line);
}

.schedule-legend li {
  display: inline-flex;
  align-items: center;
  gap: 0.33rem;
}

.schedule-legend li::before {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: var(--status-dot);
  content: '';
}

.schedule-legend li[data-status='blocked']::before {
  border: 1px solid var(--status-dot);
  border-radius: 0.12rem;
  background: var(--status-fill);
}
</style>
