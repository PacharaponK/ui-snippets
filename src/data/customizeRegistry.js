import AppointmentCalendar from '../examples/customize/AppointmentCalendar.vue'
import appointmentCalendarSource from '../examples/customize/AppointmentCalendar.vue?raw'
import WeeklyAppointmentCalendar from '../examples/customize/WeeklyAppointmentCalendar.vue'
import weeklyAppointmentCalendarSource from '../examples/customize/WeeklyAppointmentCalendar.vue?raw'
import { appointmentCalendarId, customizeCategoryId, weeklyAppointmentCalendarId } from './libraryAccess'

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
  {
    id: weeklyAppointmentCalendarId,
    name: 'Weekly Appointment Calendar',
    description: 'A Monday–Sunday staff schedule for viewing, booking, and blocking appointments.',
    framework: 'primevue',
    category: customizeCategoryId,
    tags: ['calendar', 'weekly', 'schedule', 'staff', 'booking', 'availability', 'bootstrap'],
    previewComponent: WeeklyAppointmentCalendar,
    sourceCode: weeklyAppointmentCalendarSource,
    widePreview: true,
  },
]
