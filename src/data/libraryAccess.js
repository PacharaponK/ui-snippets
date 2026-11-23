export const customizeCategoryId = 'customize'
export const appointmentCalendarId = 'appointment-calendar'

export function isCustomizeRoute(route) {
  return (route.name === 'gallery' && route.query.category === customizeCategoryId)
    || (route.name === 'component' && route.params.id === appointmentCalendarId)
}
