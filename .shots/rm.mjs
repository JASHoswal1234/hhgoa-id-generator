import { chromium } from 'playwright'
const b = await chromium.launch({ channel: 'chrome' })
const p = await b.newPage({ viewport:{width:1440,height:900} })
await p.emulateMedia({ reducedMotion:'reduce' })
await p.goto('http://localhost:5173/', { waitUntil:'networkidle' })
await p.waitForTimeout(300)   // deliberately short: nothing may depend on animation finishing
const r = await p.evaluate(() => {
  const els = [...document.querySelectorAll('.hh-settle,.hh-wash')]
  const faded = els.filter(e => +getComputedStyle(e).opacity < 0.7)
    .map(e => ({ cls: e.className.slice(0,28), op: getComputedStyle(e).opacity, anim: getComputedStyle(e).animationName }))
  return { total: els.length, hiddenOrFaint: faded,
           anyRunningAnimation: els.filter(e => getComputedStyle(e).animationName !== 'none').length }
})
console.log(JSON.stringify(r, null, 1))
await b.close()
