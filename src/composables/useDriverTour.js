/* eslint-disable no-unused-vars */
// useDriverTour.js
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { nextTick } from "vue"
import { useTourStore } from '@/store/tour';

export function useDriverTour() {
  let currentStepIndex = 0
  let customStepHandlers = []
  const tour = useTourStore();

  const startTour = async (steps = [], options = {}) => {
    await nextTick() // TODO: REMOVER USO INNECESARIO EN ESTA VERSION

    if (!steps || !Array.isArray(steps)) {
      console.error("Pasos inválidos para el recorrido. Se esperaba un array.");
      return;
    }
    
    if (!steps.length) {
      console.warn("No se encontraron pasos para el recorrido.");
      return;
    }

    customStepHandlers = steps.map(step => ({
      onNext: step.onNextClick || null,
      onPrev: step.onPrevClick || null,
      onDestroy: step.onDestroyStarted || null,
      waitForElement: step.waitForElement || false,
    }))

    tour.setIsActive(true);
    const driverObj = driver({
      showProgress: true,
      disableActiveInteraction: true,
      steps: steps.map(({ onNextClick, onPrevClick, onDestroyStarted, waitForElement, ...rest }) => rest),
      ...options,
      onNextClick: (el) => {
        const handler = customStepHandlers[currentStepIndex]?.onNext
        handler?.(el)
        
        if (customStepHandlers[currentStepIndex]?.waitForElement) {
          setTimeout(() => {
            driverObj.moveNext()
          }, 500);
        } else {
          driverObj.moveNext()
        }
        currentStepIndex = (currentStepIndex + 1) % customStepHandlers.length
        tour.setCurrentStep(currentStepIndex);
      },
      onPrevClick: (el) => {
        const handler = customStepHandlers[currentStepIndex]?.onPrev;
        handler?.(el)
        currentStepIndex = (currentStepIndex - 1 + customStepHandlers.length) % customStepHandlers.length
        driverObj.movePrevious()
        tour.setCurrentStep(currentStepIndex);
      },
      onDestroyStarted: () => {
        // se reinicia los index por lo que toca obtener la longitud y a esta se le resta 1 para obtener el ultimo elemento
        const handler = customStepHandlers[customStepHandlers.length - 1]?.onDestroy
        handler?.()
        driverObj.destroy()
        tour.setIsActive(false);
      }
    })

    driverObj.drive()
  }

  const initTour = () => {
    startTour(tour.steps, tour.options)
  }

  return { startTour, initTour }
}
