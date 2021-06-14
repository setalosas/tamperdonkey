/* eslint-disable no-debugger, spaced-comment, no-multi-spaces, no-unused-vars, valid-typeof, 
   object-curly-spacing, no-trailing-spaces, indent, new-cap, block-spacing, comma-spacing,
   handle-callback-err, no-return-assign, camelcase, yoda, object-property-newline,
   standard/array-bracket-even-spacing, object-curly-newline, no-void, quotes,
   no-multiple-empty-lines */

const injectContentScript = contentScript => { // ez csak akkor kell h kulso cuccot kell behivni
  const fingerPrint = 'id' + Date.now()
  const script = document.createElement('script')
  script.src = contentScript
  script.async = true
  script.setAttribute('type', 'module')
  script.setAttribute('id', fingerPrint)
  if (typeof document.head === 'undefined') {
    console.error(`💉supermod.injector: document.head is undef!`)
    debugger
    setTimeout(_ => injectContentScript(contentScript), 1000)
  }
  document.head.appendChild(script)
}

const onReadyState = _ => new Promise(resolve => { // ez kell, mert megvarjuk h az oldal bejojjon
  document.getElementsByTagName('head').length
    ? resolve()
    : document.addEventListener('readystatechange', _ => {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
          resolve()
        }
      })
  })

  // ez csak ha kulso dolgot akarsz behivni

const konfig = {
  contentScript: 'https://prex.mork.work/supermod-esm.js' 
}

// ez mondja meg h milyen urlmintakra akarsz triggerelni
// ha csak egyre, a manifestben is lehet allitani a "matches" rule-ban
// mert ost minden szajtnal lefut es itt valogatja ki, h szukseg van-e ra

const sites = {
  telex: {type: 'include', pattern: 'telex.hu/', oncomplete: true}
}

// ez a lenyeg:

onReadyState().then(_ => {
  const loc = window.location.href
  const sloc = loc.substr(0, 90)
  
  const siteMatched = site => { // ex az egesz szajtkereso resz nem kell, ha csak egy szajt van
    const {pattern} = site
    if (site.type === 'include') {
      return loc.includes(pattern)
    } else if (site.type === 'includeall') {
      return pattern.length === pattern.filter(pat => loc.includes(pat)).length
    } else if (site.type === 'includeany') {
      return pattern.filter(pat => loc.includes(pat)).length
    }
  }
  
  for (const sitekey in sites) {
    const site = sites[sitekey]
    if (siteMatched(site)) {
      console.log(`💉supermod.injector will inject tamper now on match:`, sitekey, sloc)
      window.expo = 'hellomi!'
      document.body.setAttribute('sitekey', sitekey)
      site.oncomplete && document.body.setAttribute('oncomplete', 'true')

      // ez hivja meg a kis rutint below ami piszkalja a domot
      
      extensionCore()

      // ez nem kell ha nem akarsz kulsot injektalni
      injectContentScript(konfig.contentScript)
      break
    }
  }
})

const extensionCore = () => {
  // juhej!

  const q$ = s => document.querySelector(s)
  const q$$ = s => [...document.querySelectorAll(s)]

  for (const img of [...q$$('img')]) {
    img.style.border = '2px solid red'
  }
}
