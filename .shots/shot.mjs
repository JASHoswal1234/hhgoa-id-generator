import { chromium } from 'playwright'
const b = await chromium.launch({ channel: 'chrome' })
const sizes = [['desktop',1600,1000],['laptop',1280,800],['tablet',834,1112],['mobile',390,844]]
for (const [name,w,h] of sizes) {
  const p = await b.newPage({ viewport:{width:w,height:h} })
  const errs = []
  p.on('console', m => { if (m.type()==='error') errs.push(m.text()) })
  p.on('pageerror', e => errs.push('PAGEERROR '+e.message))
  await p.goto('http://localhost:5173/', { waitUntil:'networkidle' })
  await p.waitForTimeout(2600)
  await p.screenshot({ path:`.shots/${name}.png` })
  const d = await p.evaluate(() => ({
    sh:document.documentElement.scrollHeight, ch:document.documentElement.clientHeight,
    sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth,
  }))
  console.log(`${name.padEnd(8)} ${w}x${h}  vOverflow=${d.sh-d.ch}px  hOverflow=${d.sw-d.cw}px  errors=${errs.length?errs.join(' | '):'none'}`)
  await p.close()
}

// Accessibility + reduced-motion audit
const p = await b.newPage({ viewport:{width:1440,height:900} })
await p.emulateMedia({ reducedMotion:'reduce' })
await p.goto('http://localhost:5173/', { waitUntil:'networkidle' })
await p.waitForTimeout(400)
await p.screenshot({ path:'.shots/reduced-motion.png' })
const a11y = await p.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')]
  return {
    h1: document.querySelectorAll('h1').length,
    h1Text: document.querySelector('h1')?.textContent?.trim(),
    imgs: imgs.length,
    imgsMissingAlt: imgs.filter(i => i.getAttribute('alt') === null).length,
    decorativeHidden: imgs.filter(i => i.getAttribute('alt') === '').length,
    landmarks: [...document.querySelectorAll('main,section[aria-label],header,nav')].map(e => e.tagName.toLowerCase()),
    // Everything must be visible with motion disabled. Elements in the light
    // layer carry a *designed* opacity in --hh-o (a 6% shadow must stay 6%),
    // so compare each element against its own intended value rather than
    // against 1 — otherwise every shadow reads as a false positive.
    invisible: [...document.querySelectorAll('.hh-settle,.hh-wash')].filter(e => {
      const intended = parseFloat(e.style.getPropertyValue('--hh-o') || '1')
      return +getComputedStyle(e).opacity < intended * 0.99
    }).length,
    // Anything still mid-transform with motion disabled is a real failure.
    transformed: [...document.querySelectorAll('.hh-settle,.hh-wash')].filter(e => {
      const t = getComputedStyle(e).transform
      return t !== 'none' && !/matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)/.test(t)
    }).length,
    settleCount: document.querySelectorAll('.hh-settle,.hh-wash').length,
  }
})
console.log('\nreduced-motion + a11y:', JSON.stringify(a11y, null, 1))
await p.close()
await b.close()
