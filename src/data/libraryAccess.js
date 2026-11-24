export const customizeCategoryId = 'customize'
export const appointmentCalendarId = 'appointment-calendar'
export const weeklyAppointmentCalendarId = 'weekly-appointment-calendar'

const customizeComponentIds = [appointmentCalendarId, weeklyAppointmentCalendarId]

export function isCustomizeRoute(route) {
  return (route.name === 'gallery' && route.query.category === customizeCategoryId)
    || (route.name === 'component' && customizeComponentIds.includes(route.params.id))
}
