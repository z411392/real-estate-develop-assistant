export const createElapsedTimeProfiler = () => {
    let startedAt = Date.now()
    const measureElapsedTime = () => {
        const now = Date.now()
        const cost = now - startedAt
        startedAt = now
        return cost
    }
    return measureElapsedTime
}
