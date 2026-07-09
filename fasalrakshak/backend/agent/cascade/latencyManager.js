/**
 * Latency Manager
 * Tracks execution time for different phases.
 */
export class LatencyTracker {
  constructor() {
    this.startTime = Date.now();
    this.markers = {};
  }

  mark(phase) {
    this.markers[phase] = Date.now();
  }

  getLatencies() {
    const latencies = {};
    let previousTime = this.startTime;

    for (const [phase, time] of Object.entries(this.markers)) {
      latencies[phase] = time - previousTime;
      previousTime = time;
    }
    
    latencies.total = Date.now() - this.startTime;
    return latencies;
  }
}
