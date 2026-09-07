import { useEffect, useState } from 'react'
import { statePresets } from './data/demoState'
import './App.css'

const navItems = [
  { path: '/farmer', label: 'Farmer view', icon: '⌁' },
  { path: '/operator', label: 'Centre operations', icon: '◫' },
  { path: '/operator/simulation', label: 'Demo controls', icon: '✦' },
]

function App() {
  const [path, setPath] = useState(window.location.pathname || '/')
  const [scenario, setScenario] = useState('normal')
  const [isUpdating, setIsUpdating] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const state = statePresets[scenario]

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function navigate(nextPath) {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function changeScenario(nextScenario) {
    setIsUpdating(true)
    window.setTimeout(() => {
      setScenario(nextScenario)
      setIsUpdating(false)
    }, 850)
  }

  const farmerPath = path === '/farmer/booking' ? 'booking' : path === '/farmer/status' ? 'status' : 'overview'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate('/')} aria-label="Go to home">
          <span className="brand-mark">KQ</span>
          <span><strong>KisaanQ</strong><small>procurement intelligence</small></span>
        </button>
        <div className="demo-tag"><span className="pulse-dot" /> prototype environment</div>
        <nav className="side-nav" aria-label="Main navigation">
          <span className="nav-kicker">Workspace</span>
          {navItems.map((item) => (
            <button className={path === item.path ? 'nav-item active' : 'nav-item'} key={item.path} onClick={() => navigate(item.path)}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="centre-mini" onClick={() => navigate('/operator')}><span className="mini-label">Connected centre</span><strong>Kendra A</strong><span>Main Procurement Centre</span><i>●</i></button>
          <button className="user-chip" onClick={() => navigate('/farmer')}><span className="avatar">RS</span><span><strong>Ramesh Singh</strong><small>Farmer account</small></span><b>•••</b></button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{path === '/' ? 'Overview' : path.includes('operator') ? 'Centre Operations' : 'Farmer Dashboard'}</strong></div>
          <div className="top-actions"><span className="last-sync"><i /> simulated events synced <b>just now</b></span><button className="icon-button" aria-label="Notifications" onClick={() => navigate('/notification')}>♧<em>{scenario === 'delayed' ? '1' : ''}</em></button><button className="language" onClick={() => navigate('/')}>EN <span>⌄</span></button></div>
        </header>
        {path === '/' && <Landing navigate={navigate} />}
        {path.startsWith('/farmer') && <FarmerDashboard state={state} isUpdating={isUpdating} farmerPath={farmerPath} showWhy={showWhy} setShowWhy={setShowWhy} navigate={navigate} />}
        {path === '/operator' && <OperatorDashboard state={state} changeScenario={changeScenario} navigate={navigate} />}
        {path === '/operator/simulation' && <Simulation state={state} isUpdating={isUpdating} changeScenario={changeScenario} navigate={navigate} />}
        {path === '/notification' && <NotificationScreen state={state} navigate={navigate} />}
      </main>
    </div>
  )
}

function PageIntro({ eyebrow, title, detail, action }) {
  return <div className="page-intro"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{detail}</p></div>{action}</div>
}

function Landing({ navigate }) {
  return <div className="landing page-enter"><div className="landing-copy"><span className="eyebrow">Predictive procurement intelligence</span><h1>Your turn,<br /><em>before you leave home.</em></h1><p>KisaanQ turns a changing centre queue into a clear service window and a practical time to leave. Built for farmers. Useful for the people running the centre.</p><div className="landing-actions"><button className="primary-button" onClick={() => navigate('/farmer')}>Try farmer demo <span>→</span></button><button className="text-button" onClick={() => navigate('/operator')}>Open operator view <span>↗</span></button></div></div><div className="landing-visual clickable-section" role="button" tabIndex="0" onClick={() => navigate('/farmer')} onKeyDown={(event) => event.key === 'Enter' && navigate('/farmer')}><div className="sun-disc" /><div className="field-lines" /><div className="arrival-card"><span>next best action</span><strong>Leave at 10:55 AM</strong><small>35 min travel · 10 min buffer</small></div><div className="map-pin">✦</div><div className="route-line" /></div><div className="principles"><button onClick={() => navigate('/farmer')}><b>01 / Predict</b><span>Know your actual service window.</span></button><button onClick={() => navigate('/operator')}><b>02 / Prevent</b><span>Spot congestion before queues build.</span></button><button onClick={() => navigate('/operator/simulation')}><b>03 / Adapt</b><span>Keep farmers informed as conditions move.</span></button></div></div>
}

function FarmerDashboard({ state, isUpdating, farmerPath, showWhy, setShowWhy, navigate }) {
  if (farmerPath === 'booking') return <Booking navigate={navigate} />
  if (farmerPath === 'status') return <StatusScreen state={state} navigate={navigate} />
  return <div className="page-enter"><PageIntro eyebrow="Farmer dashboard / Ramesh Singh" title="Good morning, Ramesh." detail="Your procurement journey, in one calm view." action={<button className="outline-button" onClick={() => navigate('/farmer/booking')}>＋ Book a slot</button>} /><div className="status-grid"><section className={state.mode === 'delayed' ? 'hero-status delayed clickable-section' : 'hero-status clickable-section'} role="button" tabIndex="0" onClick={(event) => !event.target.closest('button') && navigate('/notification')} onKeyDown={(event) => event.key === 'Enter' && navigate('/notification')}><div className="section-label"><span className="status-dot" /> {state.mode === 'delayed' ? 'Procurement time updated' : 'Procurement status'} <span className="live-label">{state.mode === 'delayed' ? 'just now' : 'on track'}</span></div><div className="centre-line"><div><small>Centre</small><strong>Kendra A <span>·</span> Main Procurement Centre</strong></div><div className="token"><small>Your token</small><strong>#143</strong></div></div><div className="eta-block"><small>Your predicted turn</small>{isUpdating ? <strong className="updating">Updating forecast<span>...</span></strong> : <strong>{state.prediction.window}</strong>}<span className="confidence">● High confidence</span></div>{state.mode === 'delayed' && <div className="update-strip"><b>↑ 25 min later than your last estimate</b><span>Weighing throughput has temporarily decreased.</span></div>}<button className="why-toggle" onClick={() => setShowWhy(!showWhy)}>Why this ETA? <span>{showWhy ? '−' : '+'}</span></button>{showWhy && <div className="why-list"><span>✓ 42 farmers currently ahead</span><span>✓ {state.activeCounters} active weighing counters</span><span>✓ Current processing rate: {state.processingRate} farmers/hour</span><span>✓ Quality-check stage: Normal</span></div>}</section><section className="departure-card clickable-section" role="button" tabIndex="0" onClick={() => navigate('/farmer/booking')} onKeyDown={(event) => event.key === 'Enter' && navigate('/farmer/booking')}><div className="section-label"><span className="sun-icon">◒</span> Plan your arrival</div><h2>When should<br />you leave?</h2><div className="departure-time">{isUpdating ? '...' : state.prediction.departure}</div><div className="travel-details"><span>Travel time <b>35 min</b></span><span>Arrival buffer <b>10 min</b></span></div><div className="schedule-ok">✓ <span>You're on schedule</span></div></section></div><div className="lower-grid"><section className="journey-card clickable-section" role="button" tabIndex="0" onClick={() => navigate('/farmer/status')} onKeyDown={(event) => event.key === 'Enter' && navigate('/farmer/status')}><div className="card-heading"><div><span className="eyebrow">Your journey</span><h2>One step at a time</h2></div><span className="date-pill">Today · 07 Mar 2025</span></div><div className="journey-track"><div className="journey-step done"><i>✓</i><div><b>Slot booked</b><small>09:12 AM · Confirmed</small></div></div><div className="journey-step current"><i>2</i><div><b>Make your way to Kendra A</b><small>Leave by {state.prediction.departure}</small></div></div><div className="journey-step"><i>3</i><div><b>Procurement complete</b><small>We will mark this when done</small></div></div></div></section><section className="notification-prompt clickable-section" role="button" tabIndex="0" onClick={(event) => !event.target.closest('button') && navigate('/notification')} onKeyDown={(event) => event.key === 'Enter' && navigate('/notification')}><span className="prompt-icon">✦</span><div><span className="eyebrow">Stay in the loop</span><h2>We will tell you<br />when things change.</h2><p>Centre events become clear updates for you.</p></div><button className="round-arrow" onClick={() => navigate('/notification')}>↗</button></section></div></div>
}

function StatusScreen({ state, navigate }) {
  return <div className="page-enter"><PageIntro eyebrow="Farmer dashboard / Booking confirmed" title="Your place is held." detail="The centre will work from this token and the forecast will keep moving with it." action={<button className="text-button" onClick={() => navigate('/farmer')}>← View live status</button>} /><section className="status-confirmation"><div className="confirmation-mark">✓</div><span className="eyebrow">Slot confirmed</span><h2>Kendra A · Main Procurement Centre</h2><div className="confirmation-grid"><div><small>Token</small><strong>#143</strong></div><div><small>Commodity</small><strong>Wheat · 24 qtl</strong></div><div><small>Expected procurement</small><strong>{state.prediction.window}</strong></div><div><small>Recommended departure</small><strong>{state.prediction.departure}</strong></div></div><button className="primary-button" onClick={() => navigate('/farmer')}>Continue to live status <span>→</span></button></section></div>
}

function Booking({ navigate }) {
  return <div className="page-enter"><PageIntro eyebrow="Farmer dashboard / New booking" title="Reserve your place." detail="Pick a commodity and we will find a workable service window." action={<button className="text-button" onClick={() => navigate('/farmer')}>← Back to dashboard</button>} /><section className="booking-layout"><form className="booking-form" onSubmit={(event) => { event.preventDefault(); navigate('/farmer/status') }}><label>Commodity<select defaultValue="Wheat"><option>Wheat</option><option>Mustard</option><option>Paddy</option></select></label><label>Quantity <span className="optional">in quintals</span><input defaultValue="24" type="number" /></label><label>Preferred centre<select defaultValue="Kendra A — Main Procurement Centre"><option>Kendra A — Main Procurement Centre</option><option>Kendra B — East Yard</option></select></label><label>Preferred date<input defaultValue="2025-03-07" type="date" /></label><button className="primary-button" type="submit">Confirm slot <span>→</span></button></form><button className="slot-preview clickable-section" onClick={() => navigate('/farmer/status')}><span className="eyebrow">Available slot</span><strong>Today<br /><em>10:00 AM</em></strong><div className="slot-divider" /><small>Estimated service</small><b>11:40 AM - 12:00 PM</b><div className="slot-note">Based on current centre conditions. This window will update if operations change.</div></button></section></div>
}

function OperatorDashboard({ state, changeScenario, navigate }) {
  return <div className="page-enter"><PageIntro eyebrow="Centre operations / Kendra A" title="The floor, at a glance." detail="Make the next operational decision with the queue in view." action={<button className="outline-button" onClick={() => navigate('/operator/simulation')}>✦ Run simulation</button>} /><div className="metric-row"><Metric label="Current queue" value="42" unit="farmers" onClick={() => navigate('/operator/simulation')} /><Metric label="Active counters" value={`${state.activeCounters} / 3`} unit="open" onClick={() => navigate('/operator/simulation')} /><Metric label="Processing rate" value={state.processingRate} unit="farmers / hr" onClick={() => navigate('/operator/simulation')} /><Metric label="Centre load" value={`${state.load}%`} unit={state.load > 85 ? 'high' : 'steady'} alert={state.load > 85} onClick={() => navigate('/operator/simulation')} /></div><section className="ops-panel clickable-section" role="button" tabIndex="0" onClick={() => navigate('/operator/simulation')} onKeyDown={(event) => event.key === 'Enter' && navigate('/operator/simulation')}><div className="panel-title"><div><span className="eyebrow">Live pipeline</span><h2>Every token has a place.</h2></div><span className="simulated-badge">● SIMULATED CENTRE EVENTS</span></div><div className="pipeline"><PipelineStage number="42" label="Token queue" /><span className="pipeline-arrow">→</span><PipelineStage number="18" label="Weighing" alert={state.mode === 'delayed'} note={state.mode === 'delayed' ? 'Bottleneck' : 'Normal'} /><span className="pipeline-arrow">→</span><PipelineStage number="11" label="Quality check" note="Normal" /><span className="pipeline-arrow">→</span><PipelineStage number="7" label="Procurement complete" note="Today" /></div></section><div className="operator-lower"><section className={state.mode === 'delayed' ? 'bottleneck-card active clickable-section' : 'bottleneck-card clickable-section'} role="button" tabIndex="0" onClick={(event) => !event.target.closest('button') && navigate('/operator/simulation')} onKeyDown={(event) => event.key === 'Enter' && navigate('/operator/simulation')}><div className="alert-symbol">!</div><div><span className="eyebrow">{state.mode === 'delayed' ? 'Operational change detected' : 'Watch the floor'}</span><h2>{state.mode === 'delayed' ? 'Weighing bottleneck' : 'No active bottlenecks'}</h2><p>{state.mode === 'delayed' ? 'Throughput is down 22%. Farmer forecasts have been recalculated.' : 'All stages are moving within their expected range.'}</p></div><button className="primary-button compact" onClick={(event) => { event.stopPropagation(); changeScenario('delayed') }}>{state.mode === 'delayed' ? 'Delay reported' : 'Report stage delay'} <span>→</span></button></section><section className="forecast-card clickable-section" role="button" tabIndex="0" onClick={() => navigate('/operator/simulation')} onKeyDown={(event) => event.key === 'Enter' && navigate('/operator/simulation')}><div><span className="eyebrow">Next 60 minutes</span><h2>Congestion forecast</h2></div><strong>{state.load}%</strong><div className="forecast-bar"><i style={{ width: `${state.load}%` }} /></div><small>Projected {state.load > 85 ? 'high' : 'steady'} · +18 expected arrivals</small></section></div></div>
}

function Metric({ label, value, unit, alert, onClick }) { return <button className={alert ? 'metric alert clickable-section' : 'metric clickable-section'} onClick={onClick}><span>{label}</span><strong>{value}</strong><small>{unit}</small></button> }
function PipelineStage({ number, label, alert, note }) { return <div className={alert ? 'pipeline-stage alert' : 'pipeline-stage'}><strong>{number}</strong><span>{label}</span><small>{alert && '⚠ '}{note}</small></div> }

function Simulation({ state, isUpdating, changeScenario, navigate }) {
  return <div className="page-enter"><PageIntro eyebrow="Operator tools / Demo scenario" title="Change the centre." detail="A small control room for the 60-second KisaanQ story." /><section className="simulation-layout"><div className="scenario-card"><div className="scenario-header"><div><span className="eyebrow">Demo scenario</span><h2>Kendra A</h2></div><span className={state.mode === 'delayed' ? 'scenario-state warning' : 'scenario-state'}>{state.label}</span></div><p className="scenario-copy">Choose an event. The prediction engine will recalculate the farmer's service window and departure time.</p><div className="scenario-buttons"><button className={state.mode === 'normal' ? 'scenario-button selected' : 'scenario-button'} onClick={() => changeScenario('normal')}><span>01</span><b>Normal conditions</b><small>6 farmers / hour · 2 counters</small></button><button className={state.mode === 'delayed' ? 'scenario-button selected warning' : 'scenario-button'} onClick={() => changeScenario('delayed')}><span>02</span><b>Introduce weighing delay</b><small>4 farmers / hour · forecast updates</small></button><button className={state.mode === 'recovered' ? 'scenario-button selected' : 'scenario-button'} onClick={() => changeScenario('recovered')}><span>03</span><b>Recover centre</b><small>7 farmers / hour · 3 counters</small></button></div><button className="reset-button" onClick={() => changeScenario('normal')}>↺ Reset demo</button></div><div className="simulation-readout clickable-section" role="button" tabIndex="0" onClick={() => navigate('/farmer/status')} onKeyDown={(event) => event.key === 'Enter' && navigate('/farmer/status')}><span className="eyebrow">Prediction engine</span><h2>{isUpdating ? 'Updating...' : 'The farmer sees this.'}</h2><div className="readout-row"><span>Expected turn</span><strong>{isUpdating ? '...' : state.prediction.window}</strong></div><div className="readout-row"><span>Recommended departure</span><strong>{isUpdating ? '...' : state.prediction.departure}</strong></div><div className="readout-row"><span>Processing rate</span><strong>{state.processingRate} farmers / hr</strong></div><div className="readout-note">State is local to this prototype. In production, authorised centre events would supply these inputs.</div></div></section></div>
}

function NotificationScreen({ state, navigate }) {
  return <div className="page-enter"><PageIntro eyebrow="Farmer notification / Prototype" title="The update arrives clearly." detail="A simulated notification keeps the farmer one step ahead." /><section className="notification-layout"><button className="phone-frame clickable-section" onClick={() => navigate('/farmer')}><div className="phone-top"><span>9:41</span><span>⌁ ◉</span></div><div className="phone-notification"><div className="notification-head"><span className="notification-logo">KQ</span><div><strong>KisaanQ</strong><small>now · Prototype notification</small></div><b>•••</b></div><h2>{state.mode === 'delayed' ? 'Your procurement time has been updated.' : 'Your procurement time is confirmed.'}</h2><span className="notification-centre">Kendra A</span><div className="notification-time"><small>New expected time</small><strong>{state.prediction.window}</strong><small>Recommended departure</small><strong>{state.prediction.departure}</strong></div><p>{state.mode === 'delayed' ? 'Weighing stage is experiencing a delay. Your ETA has been recalculated.' : 'Centre conditions are normal. We will notify you if anything changes.'}</p><footer>— KisaanQ</footer></div></button><button className="notification-copy clickable-section" onClick={() => navigate('/operator')}><span className="eyebrow">Operational clarity</span><h2>One centre event.<br /><em>One useful update.</em></h2><p>KisaanQ does not ask farmers to keep refreshing a queue number. It turns the change into a decision they can act on.</p><div className="notification-legend"><span><i className="green-dot" /> farmer informed</span><span><i className="red-dot" /> event simulated</span></div></button></section></div>
}

export default App
