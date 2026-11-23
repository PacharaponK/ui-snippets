import AppointmentCalendar from '../examples/customize/AppointmentCalendar.vue'
import appointmentCalendarSource from '../examples/customize/AppointmentCalendar.vue?raw'
import { appointmentCalendarId, customizeCategoryId } from './libraryAccess'

export default [
  {
    id: appointmentCalendarId,
    name: 'Appointment Calendar',
    description: 'A staff schedule for viewing, booking, and blocking appointments by day.',
    framework: 'primevue',
    category: customizeCategoryId,
    tags: ['calendar', 'schedule', 'staff', 'booking', 'availability', 'bootstrap'],
    previewComponent: AppointmentCalendar,
    sourceCode: appointmentCalendarSource,
    widePreview: true,
  },
]
