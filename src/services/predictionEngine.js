const baseMinutes = 11 * 60 + 40
const baselineQueueAhead = 42
const baselineProcessingRate = 6

function formatTime(totalMinutes) {
  const roundedMinutes = Math.round(totalMinutes)
  const normalizedMinutes = ((roundedMinutes % 1440) + 1440) % 1440
  const hours = Math.floor(normalizedMinutes / 60)
  const minutes = normalizedMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function predictProcurement({ queueAhead, processingRate, stageDelay = 0, travelTime, buffer }) {
  const queueDelta = ((queueAhead - baselineQueueAhead) / processingRate) * 60
  const throughputDelta = ((baselineProcessingRate / processingRate) - 1) * 40
  const startMinutes = baseMinutes + queueDelta + throughputDelta + stageDelay
  const endMinutes = startMinutes + 20
  const departureMinutes = startMinutes - travelTime - buffer

  return {
    start: formatTime(startMinutes),
    end: formatTime(endMinutes),
    window: `${formatTime(startMinutes)} - ${formatTime(endMinutes)}`,
    departure: formatTime(departureMinutes),
  }
}

export const initialPrediction = predictProcurement({
  queueAhead: 42,
  processingRate: 6,
  stageDelay: 0,
  travelTime: 35,
  buffer: 10,
})

export const delayedPrediction = predictProcurement({
  queueAhead: 42,
  processingRate: 4,
  stageDelay: 5,
  travelTime: 35,
  buffer: 10,
})

export const recoveredPrediction = predictProcurement({
  queueAhead: 42,
  processingRate: 7,
  stageDelay: 16,
  travelTime: 35,
  buffer: 10,
})
