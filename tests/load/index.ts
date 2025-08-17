import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Trend } from 'k6/metrics';

let avgDuration = new Trend('avg_duration');

export const options = {
  stages: [
    { duration: '5s', target: 20 }, // Ramp-up to 20 VUs
    { duration: '10s', target: 20 },  // Stay at 20 VUs for 1 minute
    { duration: '5s', target: 0 },  // Ramp-down to 0 VUs
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
    'avg_duration': ['avg<200'], // Custom threshold for the custom metric
},
};

export default function () {
  group('Process onboarding', function() {
    const data = { companyName: `Test Company ${crypto.randomUUID().slice(0, 4)}` }
    let res = http.post('http://localhost:3300/api/v1/onboarding/submit', data)

    check(res, { 'success login': (r) => r.status === 200 })

    avgDuration.add(res.timings.duration);

    sleep(0.1)
  })
}
