import { delayedPrediction, initialPrediction, recoveredPrediction } from '../services/predictionEngine'

export const statePresets = {
  normal: {
    mode: 'normal',
    label: 'Normal conditions',
    queueAhead: 42,
    processingRate: 6,
    activeCounters: 2,
    load: 78,
    stageDelay: 0,
    prediction: initialPrediction,
  },
  delayed: {
    mode: 'delayed',
    label: 'Weighing bottleneck',
    queueAhead: 42,
    processingRate: 4,
    activeCounters: 2,
    load: 91,
    stageDelay: 5,
    prediction: delayedPrediction,
  },
  recovered: {
    mode: 'recovered',
    label: 'Centre recovered',
    queueAhead: 42,
    processingRate: 7,
    activeCounters: 3,
    load: 64,
    stageDelay: 16,
    prediction: recoveredPrediction,
  },
}
