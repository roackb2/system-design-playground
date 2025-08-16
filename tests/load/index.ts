import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  iterations: 100,
};

export default function () {
  const data = { companyName: `Test Company ${crypto.randomUUID().slice(0, 4)}` }
  let res = http.post('http://localhost:3300/api/v1/onboarding/submit', data)

  check(res, { 'success login': (r) => r.status === 200 })

  sleep(0.01)
}
