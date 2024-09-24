import { createConsola } from "consola"
import { createElapsedTimeProfiler } from "~/lib/utils/development"

export default defineNuxtPlugin({
    name: "polyfill",
    parallel: false,
    hooks: {
        async 'app:created'() {
            const logger = createConsola().withTag(`polyfill`)
            const measureElapsedTime = createElapsedTimeProfiler()
            const polyfills = []
            // @ts-ignore
            if (!('IntersectionObserver' in window)) polyfills.push(import('intersection-observer'))
            if (!('ResizeObserver' in window)) polyfills.push(import('resize-observer-polyfill'))
            // @ts-ignore
            if (!Object.fromEntries) polyfills.push(import('object.fromentries/auto'))
            // @ts-ignore
            if (!Array.prototype.at) polyfills.push(import('array.prototype.at/auto'))
            // @ts-ignore
            if (!('animate' in document.createElement('div'))) polyfills.push(import('web-animations-js'))
            try {
                await Promise.all(polyfills)
                logger.debug(`polyfill 花費了 ${measureElapsedTime()} ms`)
            } catch (error) {
                logger.error(error)
            }
        }
    },
})

