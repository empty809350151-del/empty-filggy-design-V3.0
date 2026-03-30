import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Fragment,
  useCallback,
  createContext,
  forwardRef,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  avoidOptions,
  budgetOptions,
  directSearchHotels,
  fallbackAlternatives,
  getHotelById,
  getHotelsByPlan,
  getPlanById,
  getRoomsByHotel,
  hotelComparison,
  planComparison,
  preferenceOptions,
  recentTrips,
  requiredOptions,
  stayPlans,
  tasks,
  type Hotel,
  type IntentPreference,
} from './data/mockData'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const Router = import.meta.env.VITE_ROUTER_MODE === 'hash' ? HashRouter : BrowserRouter

type IntentState = {
  taskId: string
  city: string
  dateLabel: string
  exactDates: string
  guests: string
  place: string
  preference: IntentPreference
  budget: string
  required: string[]
  avoid: string[]
}

type CheckoutState = {
  phone: string
  guests: string[]
  arrival: string
  lateHold: boolean
  note: string
}

type FlowContextValue = {
  intent: IntentState
  selectedPlanId: string
  selectedHotelId: string
  selectedRoomId: string
  comparePlanIds: string[]
  compareHotelIds: string[]
  checkout: CheckoutState
  setIntent: (updates: Partial<IntentState>) => void
  selectPlan: (planId: string) => void
  selectHotel: (hotelId: string) => void
  selectRoom: (roomId: string) => void
  togglePlanCompare: (planId: string) => void
  toggleHotelCompare: (hotelId: string) => void
  setCheckout: (updates: Partial<CheckoutState>) => void
  resetHotelCompare: (hotelIds: string[]) => void
}

const FlowContext = createContext<FlowContextValue | null>(null)

const defaultIntent: IntentState = {
  taskId: 'business',
  city: '北京',
  dateLabel: '今晚住 1 晚',
  exactDates: '3月26日 - 3月27日',
  guests: '1 间房 1 成人',
  place: '国贸',
  preference: 'distance',
  budget: '500-800',
  required: ['可免费取消', '24小时前台', '可开票'],
  avoid: ['隔音差'],
}

const defaultCheckout: CheckoutState = {
  phone: '',
  guests: ['张晨'],
  arrival: '',
  lateHold: true,
  note: '',
}

function App() {
  return (
    <Router>
      <FlowProvider>
        <AppShell />
      </FlowProvider>
    </Router>
  )
}

function FlowProvider({ children }: PropsWithChildren) {
  const [intent, setIntentState] = useState<IntentState>(defaultIntent)
  const [selectedPlanId, setSelectedPlanId] = useState('plan-close')
  const [selectedHotelId, setSelectedHotelId] = useState('atrium')
  const [selectedRoomId, setSelectedRoomId] = useState('atrium-best')
  const [comparePlanIds, setComparePlanIds] = useState<string[]>(['plan-close', 'plan-value'])
  const [compareHotelIds, setCompareHotelIds] = useState<string[]>(['atrium', 'station'])
  const [checkout, setCheckoutState] = useState<CheckoutState>(defaultCheckout)

  const setIntent = useCallback((updates: Partial<IntentState>) => {
    setIntentState((current) => ({ ...current, ...updates }))
  }, [])

  const selectPlan = useCallback((planId: string) => {
    setSelectedPlanId(planId)
    const nextHotels = getPlanById(planId).hotelIds
    const preferredHotel = nextHotels[0] ?? getHotelById('atrium').id
    setSelectedHotelId(preferredHotel)
    const firstRoom = getRoomsByHotel(preferredHotel)[0]?.id
    if (firstRoom) {
      setSelectedRoomId(firstRoom)
    }
  }, [])

  const selectHotel = useCallback((hotelId: string) => {
    setSelectedHotelId(hotelId)
    const hotel = getHotelById(hotelId)
    setSelectedPlanId(hotel.planId)
    const firstRoom = getRoomsByHotel(hotelId)[0]?.id
    if (firstRoom) {
      setSelectedRoomId(firstRoom)
    }
  }, [])

  const selectRoom = useCallback((roomId: string) => {
    setSelectedRoomId(roomId)
  }, [])

  const togglePlanCompare = useCallback((planId: string) => {
    setComparePlanIds((current) => {
      if (current.includes(planId)) {
        return current.filter((id) => id !== planId)
      }
      if (current.length >= 3) {
        return current
      }
      return [...current, planId]
    })
  }, [])

  const toggleHotelCompare = useCallback((hotelId: string) => {
    setCompareHotelIds((current) => {
      if (current.includes(hotelId)) {
        return current.filter((id) => id !== hotelId)
      }
      if (current.length >= 2) {
        return current
      }
      return [...current, hotelId]
    })
  }, [])

  const setCheckout = useCallback((updates: Partial<CheckoutState>) => {
    setCheckoutState((current) => ({ ...current, ...updates }))
  }, [])

  const resetHotelCompare = useCallback((hotelIds: string[]) => {
    setCompareHotelIds(hotelIds)
  }, [])

  const value = {
    intent,
    selectedPlanId,
    selectedHotelId,
    selectedRoomId,
    comparePlanIds,
    compareHotelIds,
    checkout,
    setIntent,
    selectPlan,
    selectHotel,
    selectRoom,
    togglePlanCompare,
    toggleHotelCompare,
    setCheckout,
    resetHotelCompare,
  }

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}

function useFlow() {
  const context = useContext(FlowContext)
  if (!context) {
    throw new Error('Flow context is missing')
  }
  return context
}

function usePageMotion(key: string) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-animate]',
          { y: 18 },
          {
            y: 0,
            duration: 0.42,
            ease: 'power2.out',
            stagger: 0.05,
            clearProps: 'transform',
          },
        )

        ScrollTrigger.batch('.scroll-reveal', {
          once: true,
          start: 'top 88%',
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 16 },
              {
                y: 0,
                duration: 0.36,
                ease: 'power2.out',
                stagger: 0.04,
                clearProps: 'transform',
              },
            )
          },
        })
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        mm.revert()
      }
    },
    { scope, dependencies: [key], revertOnUpdate: true },
  )

  return scope
}

function usePlanSwipeDeck(planCount: number, onActivePlanChange: (planId: string) => void) {
  const scope = useRef<HTMLDivElement>(null)
  const activePlanRef = useRef<string | null>(null)

  useGSAP(
    () => {
      const rail = scope.current
      if (!rail) {
        return
      }

      const cards = gsap.utils.toArray<HTMLElement>('[data-plan-card]', rail)
      if (!cards.length) {
        return
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let frameId = 0
      const getCenteredScrollLeft = (card: HTMLElement) =>
        card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2

      gsap.set(cards, { transformOrigin: '50% 18%', willChange: 'transform, opacity' })

      const syncCards = () => {
        frameId = 0

        const leftAnchor = rail.querySelector<HTMLElement>('[data-plan-seq-index="0"]')
        const middleAnchor = rail.querySelector<HTMLElement>(`[data-plan-seq-index="${planCount}"]`)
        const rightAnchor = rail.querySelector<HTMLElement>(`[data-plan-seq-index="${planCount * 2}"]`)

        if (leftAnchor && middleAnchor && rightAnchor) {
          const leftStart = getCenteredScrollLeft(leftAnchor)
          const middleStart = getCenteredScrollLeft(middleAnchor)
          const rightStart = getCenteredScrollLeft(rightAnchor)
          const leftBoundary = (leftStart + middleStart) / 2
          const rightBoundary = (middleStart + rightStart) / 2

          if (rail.scrollLeft < leftBoundary) {
            rail.scrollLeft += middleStart - leftStart
            requestSync()
            return
          }

          if (rail.scrollLeft > rightBoundary) {
            rail.scrollLeft -= rightStart - middleStart
            requestSync()
            return
          }
        }

        const railRect = rail.getBoundingClientRect()
        const focusX = railRect.left + railRect.width / 2
        const range = Math.max(railRect.width * 0.62, 1)
        let nearestId = cards[0]?.dataset.planId ?? null
        let nearestDistance = Number.POSITIVE_INFINITY

        cards.forEach((card) => {
          const rect = card.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const distance = Math.abs(centerX - focusX)
          const progress = gsap.utils.clamp(0, 1, distance / range)

          if (distance < nearestDistance) {
            nearestDistance = distance
            nearestId = card.dataset.planId ?? nearestId
          }

          card.dataset.cardActive = progress < 0.18 ? 'true' : 'false'

          if (prefersReducedMotion) {
            gsap.to(card, {
              opacity: progress < 0.18 ? 1 : 0.9,
              duration: 0.18,
              ease: 'power2.out',
              overwrite: 'auto',
            })
            return
          }

          const direction = centerX < focusX ? -1 : 1

          gsap.to(card, {
            y: progress * 18,
            scale: 1 - progress * 0.08,
            rotation: direction * progress * 1.2,
            opacity: 1 - progress * 0.22,
            duration: 0.22,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        })

        if (nearestId && activePlanRef.current !== nearestId) {
          activePlanRef.current = nearestId
          onActivePlanChange(nearestId)
        }
      }

      const requestSync = () => {
        if (!frameId) {
          frameId = window.requestAnimationFrame(syncCards)
        }
      }

      requestSync()
      rail.addEventListener('scroll', requestSync, { passive: true })
      window.addEventListener('resize', requestSync)

      return () => {
        if (frameId) {
          window.cancelAnimationFrame(frameId)
        }
        rail.removeEventListener('scroll', requestSync)
        window.removeEventListener('resize', requestSync)
        gsap.killTweensOf(cards)
      }
    },
    { scope, dependencies: [planCount, onActivePlanChange], revertOnUpdate: true },
  )

  return scope
}

function AppShell() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="app-surface">
      <div className="device-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/intent" element={<IntentPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/plans/compare" element={<PlanComparePage />} />
          <Route path="/plans/:planId/hotels" element={<PlanHotelsPage />} />
          <Route path="/plans/:planId/hotels/compare" element={<HotelComparePage />} />
          <Route path="/hotel/:hotelId" element={<HotelDetailPage />} />
          <Route path="/hotel/:hotelId/rooms" element={<RoomSelectionPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/search" element={<DirectSearchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

function HeroDiffuseBackground() {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tweens: gsap.core.Tween[] = []
      const panel = scope.current?.closest<HTMLElement>('.hero-panel')
      const field = scope.current?.querySelector<HTMLElement>('[data-ambient-field]')
      const mist = scope.current?.querySelector<HTMLElement>('[data-mist]')
      const blobs = gsap.utils.toArray<HTMLElement>('[data-blob]')
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const blobMotions = prefersReducedMotion
        ? [
            { x: 8, y: 6, scale: 1.03, opacity: 0.7, duration: 8.2 },
            { x: -7, y: 8, scale: 1.04, opacity: 0.66, duration: 9.4 },
            { x: 6, y: -6, scale: 1.02, opacity: 0.62, duration: 7.8 },
            { x: -6, y: -5, scale: 1.03, opacity: 0.58, duration: 9.8 },
          ]
        : [
            { x: 18, y: 12, scale: 1.06, opacity: 0.76, duration: 6.8 },
            { x: -16, y: 18, scale: 1.08, opacity: 0.7, duration: 8.4 },
            { x: 14, y: -12, scale: 1.05, opacity: 0.66, duration: 6.2 },
            { x: -12, y: -11, scale: 1.07, opacity: 0.62, duration: 8.8 },
          ]

      blobs.forEach((blob, index) => {
        gsap.set(blob, { transformOrigin: '50% 50%' })
        tweens.push(
          gsap.to(blob, {
            ...blobMotions[index],
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        )
      })

      if (field) {
        tweens.push(
          gsap.to(field, {
            x: prefersReducedMotion ? 6 : 18,
            y: prefersReducedMotion ? -5 : -14,
            rotation: prefersReducedMotion ? 1.2 : 3.6,
            duration: prefersReducedMotion ? 10.5 : 9.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        )
      }

      if (mist) {
        tweens.push(
          gsap.to(mist, {
            x: prefersReducedMotion ? 7 : 18,
            y: prefersReducedMotion ? -4 : -10,
            scale: prefersReducedMotion ? 1.05 : 1.1,
            opacity: prefersReducedMotion ? 0.44 : 0.62,
            duration: prefersReducedMotion ? 8.6 : 6.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        )
      }

      if (panel) {
        gsap.set(panel, {
          '--hero-panel-glow-x': '18%',
          '--hero-panel-glow-y': '12%',
          '--hero-panel-blush-x': '84%',
          '--hero-panel-blush-y': '18%',
        })

        tweens.push(
          gsap.to(panel, {
            '--hero-panel-glow-x': prefersReducedMotion ? '24%' : '34%',
            '--hero-panel-glow-y': prefersReducedMotion ? '16%' : '22%',
            '--hero-panel-blush-x': prefersReducedMotion ? '78%' : '68%',
            '--hero-panel-blush-y': prefersReducedMotion ? '22%' : '30%',
            duration: prefersReducedMotion ? 12 : 8.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        )
      }

      return () => {
        tweens.forEach((tween) => tween.kill())
      }
    },
    { scope },
  )

  return (
    <div ref={scope} className="hero-ambient" aria-hidden="true">
      <div className="hero-ambient-field" data-ambient-field>
        <span className="hero-ambient-blob is-gold" data-blob />
        <span className="hero-ambient-blob is-apricot" data-blob />
        <span className="hero-ambient-blob is-cream" data-blob />
        <span className="hero-ambient-blob is-aqua" data-blob />
      </div>
      <span className="hero-ambient-mist" data-mist />
    </div>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const { setIntent } = useFlow()
  const motionRef = usePageMotion('home')
  const taskEntryRef = useRef<HTMLDivElement>(null)
  const titleSweepRef = useRef<HTMLHeadingElement>(null)
  const taskEmojiMap: Record<string, string> = {
    business: '💼',
    family: '👨‍👩‍👧',
    tonight: '🌙',
    airport: '✈️',
    weekend: '🛌',
    city: '🏙️',
    show: '🎭',
    hospital: '🏥',
  }
  const taskBadgeMap: Record<string, string> = {
    business: '效率优先',
    family: '亲子友好',
    tonight: '临时落脚',
    airport: '机场过夜',
    weekend: '周末松弛',
    city: '城市氛围',
    show: '散场不慌',
    hospital: '陪护就近',
  }
  const heroTitle = '选住法，住得更对味'

  useGSAP(
    () => {
      if (!titleSweepRef.current) {
        return
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const sheenTween = gsap.fromTo(
        titleSweepRef.current,
        {
          '--hero-title-sheen-x': '126%',
          '--hero-title-sheen-y': '132%',
          '--hero-title-sheen-opacity': 1,
        },
        {
          '--hero-title-sheen-x': '-34%',
          '--hero-title-sheen-y': '-42%',
          '--hero-title-sheen-opacity': 0,
          duration: prefersReducedMotion ? 2.2 : 2.8,
          ease: 'power2.inOut',
          repeat: -1,
          repeatDelay: prefersReducedMotion ? 5.8 : 5.2,
        },
      )

      return () => {
        sheenTween.kill()
      }
    },
    { scope: titleSweepRef },
  )

  return (
    <Page ref={motionRef}>
      <section className="hero-panel" data-animate>
        <HeroDiffuseBackground />
        <div className="hero-copy">
          <h1 ref={titleSweepRef} className="hero-title" data-text={heroTitle}>
            {heroTitle}
          </h1>
          <p className="hero-copy-note">Citywalk、看海、泡汤、躺平，按你的玩法找到对味酒店</p>
        </div>
        <div className="hero-flow">
          {[
            ['1', '选任务', '出差、带娃或临时住'],
            ['2', '给方向', '赶路少、花得值或住得好'],
            ['3', '看住法', '直接看代表酒店和取舍'],
          ].map(([, title, summary], index, items) => (
            <Fragment key={title}>
              <div className="hero-flow-step">
                <div className="hero-flow-head">
                  <strong>{title}</strong>
                </div>
                <p>{summary}</p>
              </div>
              {index < items.length - 1 ? (
                <div className="hero-flow-arrow" aria-hidden="true">
                  <span className="hero-flow-arrow-triangle" />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </section>

      <div className="hero-cta-stack scroll-reveal">
        <button
          type="button"
          className="primary-button hero-primary-cta"
          onClick={() => taskEntryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          试试选择住法
        </button>
        <button type="button" className="text-button hero-text-cta" onClick={() => navigate('/search')}>
          直接搜酒店
        </button>
      </div>

      <div ref={taskEntryRef} className="task-grid" data-animate>
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            className="task-card"
            data-task={task.id}
            data-badge={taskBadgeMap[task.id] ?? '住法推荐'}
            aria-label={`${task.title} ${task.subtitle}`}
            onClick={() => {
              setIntent({ taskId: task.id, place: task.recentPlaces[0] ?? '国贸' })
              navigate('/intent')
            }}
          >
            <div className="task-card-body">
              <span className="task-card-emoji" aria-hidden="true">
                {taskEmojiMap[task.id] ?? '🏨'}
              </span>
              <strong>{task.title}</strong>
              <span>{task.subtitle}</span>
            </div>
            <div className="task-card-meta">
              <div className="task-place-row">
                {task.recentPlaces.slice(0, 2).map((place) => (
                  <span key={place} className="task-place-chip">
                    {place}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <section className="home-block">
        <SectionTitle title="继续上次偏好" subtitle="保留最近 90 天的住法偏好，帮助你直接进入结果。" />
        <div className="stack-list scroll-reveal">
          {recentTrips.map((trip) => (
            <button key={trip.id} type="button" className="recent-card" onClick={() => navigate('/plans')}>
              <div>
                <strong>{trip.cityDate}</strong>
                <span>{trip.summary}</span>
              </div>
              <div className="recent-meta">
                <Tag>{trip.task}</Tag>
                <span className="text-link">继续</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <button type="button" className="direct-entry scroll-reveal" onClick={() => navigate('/search')}>
        <div>
          <strong>我知道自己要搜什么</strong>
          <span>沿用传统 OTA 搜索路径，按城市、日期和酒店筛选。</span>
        </div>
        <span className="arrow">›</span>
      </button>
    </Page>
  )
}

function IntentPage() {
  const navigate = useNavigate()
  const { intent, setIntent } = useFlow()
  const motionRef = usePageMotion('intent')
  const [sheet, setSheet] = useState<
    'task' | 'city' | 'date' | 'guest' | 'place' | 'budget' | 'required' | 'avoid' | null
  >(null)

  const activeTask = tasks.find((task) => task.id === intent.taskId) ?? tasks[0]
  const activeTaskLabel = activeTask.title.replace(/\s*\/\s*/g, '/')
  const preferenceLabel =
    preferenceOptions.find((option) => option.id === intent.preference)?.label ?? '平衡'
  const summaryHeadline = `${intent.city} · ${intent.dateLabel}，主要去${intent.place}，更想${preferenceLabel}`

  return (
    <Page ref={motionRef}>
      <TopNav
        title="这次怎么住"
        onBack={() => navigate(-1)}
        rightLabel="直接搜索酒店"
        leftIcon="e93e"
        rightIcon="e99d"
        iconOnly
        onRightClick={() => navigate('/search')}
      />

      <section className="intent-summary" data-animate>
        <h2>{summaryHeadline}</h2>
        <button type="button" className="chip intent-task-tag is-active" onClick={() => setSheet('task')}>
          {activeTaskLabel}
        </button>
      </section>

      <SectionTitle title="基础信息" />
      <div className="card-list" data-animate>
        <SelectionRow label="城市" value={intent.city} onClick={() => setSheet('city')} />
        <SelectionRow label="日期" value={intent.exactDates} onClick={() => setSheet('date')} />
        <SelectionRow label="人数房间" value={intent.guests} onClick={() => setSheet('guest')} />
      </div>

      <SectionTitle title="主要去哪" />
      <div className="card-list scroll-reveal">
        <SelectionRow label="关键地点" value={intent.place} onClick={() => setSheet('place')} />
        <div className="chip-row">
          {activeTask.recentPlaces.map((place) => (
            <button key={place} type="button" className="chip" onClick={() => setIntent({ place })}>
              {place}
            </button>
          ))}
        </div>
      </div>

      <SectionTitle title="更偏向哪种方向" />
      <div className="segmented-grid scroll-reveal">
        {preferenceOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`choice-card ${intent.preference === option.id ? 'is-active' : ''}`}
            onClick={() => setIntent({ preference: option.id })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <SectionTitle title="预算范围" />
      <div className="chip-row scroll-reveal">
        {budgetOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={`chip ${intent.budget === option ? 'is-active' : ''}`}
            onClick={() => (option === '自定义' ? setSheet('budget') : setIntent({ budget: option }))}
          >
            {option}
          </button>
        ))}
      </div>

      <SectionTitle title="必须要有" />
      <div className="chip-row scroll-reveal">
        {requiredOptions.map((option) => (
          <ToggleChip
            key={option}
            active={intent.required.includes(option)}
            label={option}
            onClick={() =>
              setIntent({
                required: intent.required.includes(option)
                  ? intent.required.filter((item) => item !== option)
                  : [...intent.required, option],
              })
            }
          />
        ))}
        <button type="button" className="text-button" onClick={() => setSheet('required')}>
          更多条件
        </button>
      </div>

      <SectionTitle title="尽量不要" />
      <div className="chip-row scroll-reveal">
        {avoidOptions.map((option) => (
          <ToggleChip
            key={option}
            active={intent.avoid.includes(option)}
            label={option}
            onClick={() =>
              setIntent({
                avoid: intent.avoid.includes(option)
                  ? intent.avoid.filter((item) => item !== option)
                  : [...intent.avoid, option],
              })
            }
          />
        ))}
        <button type="button" className="text-button" onClick={() => setSheet('avoid')}>
          更多选项
        </button>
      </div>

      <StickyBar
        left={<span>预计生成 3 条住法</span>}
        right={
          <button type="button" className="primary-button" onClick={() => navigate('/plans')}>
            生成 3 种住法
          </button>
        }
      />

      <BottomSheet
        open={sheet !== null}
        title={
          {
            task: '切换任务',
            city: '选择城市',
            date: '选择日期',
            guest: '人数与房间',
            place: '主要去哪',
            budget: '预算范围',
            required: '必须要有',
            avoid: '尽量不要',
          }[sheet ?? 'task']
        }
        onClose={() => setSheet(null)}
      >
        {sheet === 'task' && (
          <div className="sheet-list">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                className={`sheet-option ${intent.taskId === task.id ? 'is-active' : ''}`}
                onClick={() => {
                  setIntent({ taskId: task.id, place: task.recentPlaces[0] ?? intent.place })
                  setSheet(null)
                }}
              >
                <strong>{task.title}</strong>
                <span>{task.subtitle}</span>
              </button>
            ))}
          </div>
        )}

        {sheet === 'city' && (
          <div className="sheet-list">
            {['北京', '上海', '杭州', '广州', '深圳'].map((city) => (
              <button
                key={city}
                type="button"
                className={`sheet-line ${intent.city === city ? 'is-active' : ''}`}
                onClick={() => {
                  setIntent({ city })
                  setSheet(null)
                }}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        {sheet === 'date' && (
          <div className="sheet-list">
            {[
              ['今晚住 1 晚', '3月26日 - 3月27日'],
              ['明晚住 1 晚', '3月27日 - 3月28日'],
              ['周末住 2 晚', '3月28日 - 3月30日'],
            ].map(([label, exact]) => (
              <button
                key={label}
                type="button"
                className={`sheet-option ${intent.dateLabel === label ? 'is-active' : ''}`}
                onClick={() => {
                  setIntent({ dateLabel: label, exactDates: exact })
                  setSheet(null)
                }}
              >
                <strong>{label}</strong>
                <span>{exact}</span>
              </button>
            ))}
          </div>
        )}

        {sheet === 'guest' && (
          <div className="sheet-list">
            {['1 间房 1 成人', '1 间房 2 成人', '2 间房 2 成人', '1 间房 2 成人 1 儿童'].map((guest) => (
              <button
                key={guest}
                type="button"
                className={`sheet-line ${intent.guests === guest ? 'is-active' : ''}`}
                onClick={() => {
                  setIntent({ guests: guest })
                  setSheet(null)
                }}
              >
                {guest}
              </button>
            ))}
          </div>
        )}

        {sheet === 'place' && (
          <div className="sheet-list">
            {activeTask.recentPlaces.map((place) => (
              <button
                key={place}
                type="button"
                className={`sheet-line ${intent.place === place ? 'is-active' : ''}`}
                onClick={() => {
                  setIntent({ place })
                  setSheet(null)
                }}
              >
                {place}
              </button>
            ))}
          </div>
        )}

        {sheet === 'budget' && (
          <div className="sheet-list">
            {budgetOptions.filter((option) => option !== '自定义').map((option) => (
              <button
                key={option}
                type="button"
                className={`sheet-line ${intent.budget === option ? 'is-active' : ''}`}
                onClick={() => {
                  setIntent({ budget: option })
                  setSheet(null)
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {(sheet === 'required' || sheet === 'avoid') && (
          <div className="chip-row">
            {(sheet === 'required' ? requiredOptions : avoidOptions).map((option) => {
              const active = sheet === 'required' ? intent.required.includes(option) : intent.avoid.includes(option)
              return (
                <ToggleChip
                  key={option}
                  active={active}
                  label={option}
                  onClick={() => {
                    if (sheet === 'required') {
                      setIntent({
                        required: active
                          ? intent.required.filter((item) => item !== option)
                          : [...intent.required, option],
                      })
                    } else {
                      setIntent({
                        avoid: active
                          ? intent.avoid.filter((item) => item !== option)
                          : [...intent.avoid, option],
                      })
                    }
                  }}
                />
              )
            })}
          </div>
        )}
      </BottomSheet>
    </Page>
  )
}

function PlansPage() {
  const navigate = useNavigate()
  const { intent, comparePlanIds, togglePlanCompare, selectHotel, selectPlan, selectedPlanId } = useFlow()
  const motionRef = usePageMotion('plans')
  const recommendedPlanId = useMemo(() => stayPlans.find((plan) => plan.recommendation)?.id ?? stayPlans[0].id, [])
  const orderedPlans = useMemo(() => {
    const recommendedIndex = stayPlans.findIndex((plan) => plan.id === recommendedPlanId)
    if (recommendedIndex <= 0) {
      return stayPlans
    }
    return [...stayPlans.slice(recommendedIndex), ...stayPlans.slice(0, recommendedIndex)]
  }, [recommendedPlanId])
  const loopedPlans = useMemo(() => Array.from({ length: 3 }, () => orderedPlans).flat(), [orderedPlans])
  const orderedPlanIds = useMemo(() => orderedPlans.map((plan) => plan.id), [orderedPlans])
  const [activePlanId, setActivePlanId] = useState(recommendedPlanId)
  const swipeDeckRef = usePlanSwipeDeck(orderedPlans.length, setActivePlanId)
  const didSyncInitialPlan = useRef(false)

  const scrollToPlan = useCallback((planId: string, behavior: ScrollBehavior = 'smooth') => {
    const rail = swipeDeckRef.current
    const orderIndex = orderedPlanIds.indexOf(planId)
    if (orderIndex === -1) {
      return
    }
    const middleSeqIndex = orderedPlans.length + orderIndex
    const card = rail?.querySelector<HTMLElement>(`[data-plan-seq-index="${middleSeqIndex}"]`)
    card?.scrollIntoView({ block: 'nearest', inline: 'center', behavior })
  }, [orderedPlanIds, orderedPlans.length, swipeDeckRef])

  useEffect(() => {
    if (didSyncInitialPlan.current) {
      return
    }

    didSyncInitialPlan.current = true
    const syncId = window.requestAnimationFrame(() => {
      setActivePlanId(recommendedPlanId)
      scrollToPlan(recommendedPlanId, 'auto')
    })

    return () => window.cancelAnimationFrame(syncId)
  }, [recommendedPlanId, scrollToPlan])

  useEffect(() => {
    if (selectedPlanId === activePlanId) {
      return
    }
    selectPlan(activePlanId)
  }, [activePlanId, selectPlan, selectedPlanId])

  return (
    <Page ref={motionRef}>
      <TopNav title="你的住法" onBack={() => navigate('/intent')} rightLabel="改条件" onRightClick={() => navigate('/intent')} />

      <SummaryStrip
        line1={`${intent.city} · ${intent.dateLabel} · ${intent.guests}`}
        line2={`${intent.place} · ${tasks.find((task) => task.id === intent.taskId)?.title ?? '出差高效住'} · ${
          preferenceOptions.find((option) => option.id === intent.preference)?.label ?? '平衡'
        }`}
        actionLabel="修改"
        onAction={() => navigate('/intent')}
      />

      <div className="plan-swipe-shell scroll-reveal">
        <div ref={swipeDeckRef} className="plan-swipe-track" aria-label="住法横滑卡组">
          {loopedPlans.map((plan, loopIndex) => {
            const leadHotel = getHotelById(plan.hotelIds[0])

            return (
              <article
                key={`${plan.id}-${loopIndex}`}
                className={`plan-card is-swipe-card ${plan.id === recommendedPlanId ? 'is-featured' : ''}`}
                data-animate
                data-plan-card
                data-plan-id={plan.id}
                data-plan-seq-index={loopIndex}
              >
                <div className="plan-topline">
                  <div className="tag-row">
                    {plan.recommendation ? <Tag tone="accent">{plan.recommendation}</Tag> : <Tag>{plan.compareTag}</Tag>}
                  </div>
                  <ToggleChip
                    active={comparePlanIds.includes(plan.id)}
                    label="加入比较"
                    onClick={() => togglePlanCompare(plan.id)}
                  />
                </div>

                <div className="plan-header">
                  <h2>{plan.label}</h2>
                  <p>{plan.headline}</p>
                </div>

                <div className="metric-grid">
                  <Metric title="去关键地点" value={plan.timeToPlace} />
                  <Metric title="总成本" value={plan.totalCost} />
                  <Metric title="酒店体验" value={plan.experience} />
                </div>

                <div className="plan-decision-grid">
                  <div className="plan-decision is-positive">
                    <span className="block-label">你会得到</span>
                    <ul className="decision-list">
                      {plan.gains.map((gain) => (
                        <li key={gain}>{gain}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="plan-decision is-tradeoff">
                    <span className="block-label">你要接受</span>
                    <ul className="decision-list">
                      {plan.tradeoffs.map((tradeoff) => (
                        <li key={tradeoff}>{tradeoff}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  className="plan-lead-hotel"
                  onClick={() => {
                    selectPlan(plan.id)
                    selectHotel(leadHotel.id)
                    navigate(`/hotel/${leadHotel.id}`)
                  }}
                >
                  <img src={leadHotel.cover} alt={leadHotel.name} className="plan-lead-image" />
                  <div className="plan-lead-copy">
                    <strong>{leadHotel.name}</strong>
                    <p>{leadHotel.fitReason}</p>
                  </div>
                  <div className="plan-lead-price">
                    <b>{leadHotel.roomPrice}</b>
                  </div>
                </button>

                <div className="mini-hotel-list">
                  {plan.hotelIds.slice(1, 3).map((hotelId) => {
                    const hotel = getHotelById(hotelId)
                    return (
                      <button
                        key={hotelId}
                        type="button"
                        className="mini-hotel"
                        onClick={() => {
                          selectPlan(plan.id)
                          selectHotel(hotelId)
                          navigate(`/hotel/${hotelId}`)
                        }}
                      >
                        <img src={hotel.cover} alt={hotel.name} className="mini-hotel-image" />
                        <div className="mini-hotel-copy">
                          <strong>{hotel.name}</strong>
                          <span>{hotel.fitReason}</span>
                        </div>
                        <b>{hotel.roomPrice}</b>
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    className="mini-hotel is-link"
                    onClick={() => {
                      selectPlan(plan.id)
                      navigate(`/plans/${plan.id}/hotels`)
                    }}
                  >
                    更多同类酒店
                  </button>
                </div>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    selectPlan(plan.id)
                    navigate(`/plans/${plan.id}/hotels`)
                  }}
                >
                  看这条住法
                </button>
              </article>
            )
          })}
        </div>
        <div className="plan-swipe-indicators" aria-label="住法切换">
          {orderedPlans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              className={`plan-swipe-dot ${activePlanId === plan.id ? 'is-active' : ''}`}
              aria-label={`查看${plan.label}`}
              aria-pressed={activePlanId === plan.id}
              onClick={() => {
                setActivePlanId(plan.id)
                scrollToPlan(plan.id)
              }}
            />
          ))}
        </div>
      </div>

      {comparePlanIds.length >= 2 ? (
        <StickyBar
          left={<span>已选 {comparePlanIds.length} 条住法</span>}
          right={
            <button type="button" className="primary-button" onClick={() => navigate('/plans/compare')}>
              比较已选住法
            </button>
          }
        />
      ) : null}

      <button type="button" className="text-footer scroll-reveal" onClick={() => navigate('/search')}>
        我想自己找
      </button>
    </Page>
  )
}

function PlanComparePage() {
  const navigate = useNavigate()
  const { comparePlanIds, selectedPlanId, selectPlan } = useFlow()
  const motionRef = usePageMotion('plan-compare')
  const comparedPlans = (comparePlanIds.length >= 2 ? comparePlanIds : ['plan-close', 'plan-value']).map(getPlanById)
  const currentPlan =
    comparedPlans.find((plan) => plan.id === selectedPlanId) ??
    comparedPlans[0] ??
    stayPlans[0]

  return (
    <Page ref={motionRef}>
      <TopNav title="住法比较" onBack={() => navigate('/plans')} rightLabel="改条件" onRightClick={() => navigate('/intent')} />

      <SummaryStrip line1="北京 · 今晚住 1 晚 · 1 间房 1 成人" line2="国贸 · 出差高效住 · 赶路少" />

      <section className="recommend-card" data-animate>
        <span className="eyebrow">系统建议</span>
        <h2>{currentPlan.reason}</h2>
        <p>{currentPlan.summary}</p>
        <div className="button-row">
          <button type="button" className="primary-button" onClick={() => navigate(`/plans/${currentPlan.id}/hotels`)}>
            继续看「{currentPlan.label}」
          </button>
          <button type="button" className="text-button" onClick={() => window.scrollTo({ top: 560, behavior: 'smooth' })}>
            继续比较
          </button>
        </div>
      </section>

      <div className="compare-chip-row" data-animate>
        {comparedPlans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            className={`compare-plan-chip ${currentPlan.id === plan.id ? 'is-active' : ''}`}
            onClick={() => selectPlan(plan.id)}
          >
            <strong>{plan.label}</strong>
            <span>{plan.timeToPlace} · {plan.totalCost}</span>
          </button>
        ))}
      </div>

      <div className="difference-stack">
        {planComparison.map((group) => (
          <article key={group.title} className="difference-card scroll-reveal">
            <strong>{group.title}</strong>
            <div className="difference-values">
              {group.values
                .filter((item) => comparedPlans.some((plan) => plan.id === item.planId))
                .map((item) => (
                  <div key={item.planId} className="difference-value">
                    <span>{getPlanById(item.planId).label}</span>
                    <b>{item.value}</b>
                    <Tag>{item.tag}</Tag>
                    <p>{item.note}</p>
                  </div>
                ))}
            </div>
          </article>
        ))}
      </div>

      <StickyBar
        left={<span>已选：{currentPlan.label}</span>}
        right={
          <button type="button" className="primary-button" onClick={() => navigate(`/plans/${currentPlan.id}/hotels`)}>
            继续看这条住法
          </button>
        }
      />
    </Page>
  )
}

function PlanHotelsPage() {
  const navigate = useNavigate()
  const { planId = 'plan-close' } = useParams()
  const {
    compareHotelIds,
    intent,
    selectHotel,
    selectPlan,
    toggleHotelCompare,
    resetHotelCompare,
  } = useFlow()
  const motionRef = usePageMotion(`hotels-${planId}`)
  const plan = getPlanById(planId)
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    selectPlan(plan.id)
    resetHotelCompare(plan.hotelIds.slice(0, 2))
  }, [plan.id, plan.hotelIds, resetHotelCompare, selectPlan])

  const hotelList = useMemo(() => {
    const base = [...getHotelsByPlan(plan.id)]
    if (sortBy === 'cheaper') {
      return base.sort((a, b) => parseCurrency(a.roomPrice) - parseCurrency(b.roomPrice))
    }
    if (sortBy === 'closer') {
      return base.sort((a, b) => parseMinutes(a.timeToPlace) - parseMinutes(b.timeToPlace))
    }
    if (sortBy === 'quieter') {
      return base.sort((a, b) => Number.parseFloat(b.score) - Number.parseFloat(a.score))
    }
    if (sortBy === 'flexible') {
      return base.sort(
        (a, b) => Number(b.tags.includes('免费取消')) - Number(a.tags.includes('免费取消')),
      )
    }
    return base
  }, [plan.id, sortBy])

  return (
    <Page ref={motionRef}>
      <TopNav title={plan.label} onBack={() => navigate('/plans')} rightLabel="改条件" onRightClick={() => navigate('/intent')} />

      <SummaryStrip
        line1={`${intent.city} · ${intent.dateLabel} · ${intent.guests}`}
        line2={`${intent.place} · 当前住法：${plan.label}`}
        actionLabel="修改"
        onAction={() => navigate('/intent')}
      />

      <section className="summary-card" data-animate>
        <span className="eyebrow">当前住法</span>
        <h2>{plan.label}</h2>
        <p>{plan.summary}</p>
        <div className="dual-copy">
          <div>
            <span className="block-label">你会得到</span>
            {plan.gains.map((gain) => (
              <p key={gain}>{gain}</p>
            ))}
          </div>
          <div>
            <span className="block-label">你要接受</span>
            {plan.tradeoffs.map((tradeoff) => (
              <p key={tradeoff}>{tradeoff}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="chip-row scroll-reveal">
        {[
          ['default', '默认推荐'],
          ['closer', '更近'],
          ['cheaper', '更便宜'],
          ['quieter', '更安静'],
          ['flexible', '可退优先'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`chip ${sortBy === id ? 'is-active' : ''}`}
            onClick={() => setSortBy(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="stack-list">
        {hotelList.map((hotel, index) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            isPrimary={index === 0}
            compareActive={compareHotelIds.includes(hotel.id)}
            onCompare={() => toggleHotelCompare(hotel.id)}
            onOpen={() => {
              selectHotel(hotel.id)
              navigate(`/hotel/${hotel.id}`)
            }}
          />
        ))}
      </div>

      {compareHotelIds.length >= 2 ? (
        <StickyBar
          left={<span>已选 {compareHotelIds.length} 家酒店</span>}
          right={
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate(`/plans/${plan.id}/hotels/compare`)}
            >
              比较这两家
            </button>
          }
        />
      ) : null}

      <button type="button" className="text-footer scroll-reveal" onClick={() => navigate('/search')}>
        我想自己找
      </button>
    </Page>
  )
}

function HotelComparePage() {
  const navigate = useNavigate()
  const { compareHotelIds, selectHotel } = useFlow()
  const { planId = 'plan-close' } = useParams()
  const motionRef = usePageMotion(`hotel-compare-${planId}`)
  const comparedHotels = (compareHotelIds.length >= 2 ? compareHotelIds.slice(0, 2) : ['atrium', 'station']).map(getHotelById)

  return (
    <Page ref={motionRef}>
      <TopNav title="这两家差别" onBack={() => navigate(`/plans/${planId}/hotels`)} />
      <SummaryStrip line1="北京 · 今晚住 1 晚" line2={`国贸 · 当前住法：${getPlanById(planId).label}`} />

      <section className="recommend-card" data-animate>
        <span className="eyebrow">系统建议</span>
        <h2>如果更在意效率，建议选 A</h2>
        <p>A 更近、晚到更稳；B 更适合想把早餐和会客体验做完整一点。</p>
        <div className="button-row">
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              selectHotel(comparedHotels[0].id)
              navigate(`/hotel/${comparedHotels[0].id}`)
            }}
          >
            看 A
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              selectHotel(comparedHotels[1].id)
              navigate(`/hotel/${comparedHotels[1].id}`)
            }}
          >
            看 B
          </button>
        </div>
      </section>

      <div className="hotel-compare-grid" data-animate>
        {comparedHotels.map((hotel, index) => (
          <button
            key={hotel.id}
            type="button"
            className="compare-hotel-card"
            onClick={() => {
              selectHotel(hotel.id)
              navigate(`/hotel/${hotel.id}`)
            }}
          >
            <img src={hotel.cover} alt={hotel.name} />
            <span className="compare-label">{index === 0 ? '酒店 A' : '酒店 B'}</span>
            <strong>{hotel.name}</strong>
            <span>{hotel.fitReason}</span>
            <b>{hotel.totalCost}</b>
            <p>{hotel.timeToPlace} · {hotel.score}</p>
          </button>
        ))}
      </div>

      <div className="difference-stack">
        {hotelComparison.map((group) => (
          <article key={group.title} className="difference-card scroll-reveal">
            <strong>{group.title}</strong>
            <div className="difference-values two-col">
              <div className="difference-value">
                <span>A</span>
                <b>{group.aValue}</b>
              </div>
              <div className="difference-value">
                <span>B</span>
                <b>{group.bValue}</b>
              </div>
            </div>
            <Tag>{group.tag}</Tag>
            <p>{group.note}</p>
          </article>
        ))}
      </div>

      <StickyBar
        left={<span>继续看更适合的一家</span>}
        right={
          <div className="button-row">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                selectHotel(comparedHotels[0].id)
                navigate(`/hotel/${comparedHotels[0].id}`)
              }}
            >
              选 A
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                selectHotel(comparedHotels[1].id)
                navigate(`/hotel/${comparedHotels[1].id}`)
              }}
            >
              选 B
            </button>
          </div>
        }
      />
    </Page>
  )
}

function HotelDetailPage() {
  const navigate = useNavigate()
  const { hotelId = 'atrium' } = useParams()
  const { intent, selectedPlanId, selectRoom } = useFlow()
  const motionRef = usePageMotion(`hotel-${hotelId}`)
  const galleryRef = useRef<HTMLDivElement | null>(null)
  const hotel = getHotelById(hotelId)
  const plan = getPlanById(selectedPlanId || hotel.planId)
  const roomList = getRoomsByHotel(hotel.id)
  const [openSections, setOpenSections] = useState<string[]>([])
  const [callState, setCallState] = useState<'idle' | 'queue' | 'calling' | 'done'>('idle')
  const [galleryState, setGalleryState] = useState({ hotelId, index: 0 })
  const galleryIndex = galleryState.hotelId === hotel.id ? galleryState.index : 0

  const syncGalleryIndex = useCallback(() => {
    const gallery = galleryRef.current
    const firstSlide = gallery?.querySelector<HTMLElement>('.gallery-slide')

    if (!gallery || !firstSlide) {
      return
    }

    const gap = Number.parseFloat(window.getComputedStyle(gallery).gap || '0') || 0
    const slideWidth = firstSlide.getBoundingClientRect().width
    const nextIndex = Math.round(gallery.scrollLeft / (slideWidth + gap))

    setGalleryState((current) => {
      const clampedIndex = Math.max(0, Math.min(nextIndex, hotel.gallery.length - 1))

      if (current.hotelId === hotel.id && current.index === clampedIndex) {
        return current
      }

      return { hotelId, index: clampedIndex }
    })
  }, [hotel.gallery.length, hotel.id, hotelId])

  useEffect(() => {
    if (callState !== 'queue') {
      return
    }
    const queueTimer = window.setTimeout(() => setCallState('calling'), 700)
    const doneTimer = window.setTimeout(() => setCallState('done'), 1700)
    return () => {
      window.clearTimeout(queueTimer)
      window.clearTimeout(doneTimer)
    }
  }, [callState])

  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) {
      return
    }

    gallery.scrollLeft = 0
    gallery.addEventListener('scroll', syncGalleryIndex, { passive: true })

    return () => {
      gallery.removeEventListener('scroll', syncGalleryIndex)
    }
  }, [hotel.id, syncGalleryIndex])

  return (
    <Page ref={motionRef}>
      <TopNav title={hotel.name} onBack={() => navigate(-1)} rightLabel="改条件" onRightClick={() => navigate('/intent')} />

      <SummaryStrip
        line1={`${intent.city} · ${intent.dateLabel}`}
        line2={`${intent.place} · 当前住法：${plan.label}`}
      />

      <section className="gallery-panel" data-animate>
        <div ref={galleryRef} className="gallery" aria-label={`${hotel.name} 图片相册`}>
          {hotel.gallery.map((image, index) => (
            <figure key={image} className="gallery-slide">
              <img src={image} alt={`${hotel.name} 图片 ${index + 1}`} />
            </figure>
          ))}
        </div>
        <span className="gallery-count">
          {galleryIndex + 1}/{hotel.gallery.length}
        </span>
      </section>

      <section className="suitable-card" data-animate>
        <Tag tone="accent">来自住法：{plan.label}</Tag>
        <h2>{hotel.suitableTitle}</h2>
        <p>{hotel.suitableSummary}</p>
        <div className="chip-row">
          {hotel.suitableTags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="button-row">
          <button type="button" className="text-button" onClick={() => navigate(`/plans/${hotel.planId}/hotels`)}>
            换一家
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              selectRoom(roomList[0].id)
              navigate(`/hotel/${hotel.id}/rooms`)
            }}
          >
            选房型
          </button>
        </div>
      </section>

      <SectionTitle title="推荐你先看这 3 种" subtitle="先把高价值房型放到前面，而不是把所有 rate 一次性压给你。" />
      <div className="stack-list">
        {roomList.slice(0, 3).map((room) => (
          <article key={room.id} className="room-preview-card scroll-reveal">
            <div className="tag-row">
              <Tag tone="accent">{room.badge}</Tag>
            </div>
            <strong>{room.name}</strong>
            <p>{room.delta}</p>
            <div className="price-row">
              <b>{room.price}</b>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  selectRoom(room.id)
                  navigate(`/hotel/${hotel.id}/rooms`)
                }}
              >
                看这个房型
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="dual-copy scroll-reveal">
        <div>
          <span className="block-label">你会得到</span>
          {hotel.benefits.map((benefit) => (
            <p key={benefit}>{benefit}</p>
          ))}
        </div>
        <div>
          <span className="block-label">你要接受</span>
          {hotel.acceptances.map((acceptance) => (
            <p key={acceptance}>{acceptance}</p>
          ))}
        </div>
      </div>

      <SectionTitle title="和你这次情况相近的人这样说" subtitle="只保留短评摘要，不把你拖进长评论信息流。" />
      <div className="stack-list scroll-reveal">
        {hotel.reviews.map((review) => (
          <article key={`${review.scene}-${review.quote}`} className="review-card">
            <Tag>{review.scene}</Tag>
            <p>{review.quote}</p>
          </article>
        ))}
      </div>

      <SectionTitle title="位置与到达" subtitle="先回答你每天要不要折腾，再回答地图上离多远。" />
      <article className="info-card scroll-reveal">
        <div className="metric-grid">
          <Metric title="去关键地点" value={hotel.timeToPlace} />
          <Metric title="地址" value={hotel.address} compact />
          <Metric title="到店说明" value={hotel.arrivalTip} compact />
        </div>
        <div className="question-card">
          <strong>加床信息待确认</strong>
          <p>如果你需要更灵活的入住安排，可以让系统帮你问酒店。</p>
          <button type="button" className="text-button" onClick={() => setCallState('queue')}>
            帮我问酒店
          </button>
        </div>
      </article>

      <SectionTitle title="更多酒店信息" subtitle="长信息全部折叠，避免首屏变成说明书。" />
      <div className="stack-list scroll-reveal">
        {hotel.detailSections.map((section) => {
          const open = openSections.includes(section.title)
          return (
            <article key={section.title} className="accordion-card">
              <button
                type="button"
                className="accordion-head"
                onClick={() =>
                  setOpenSections((current) =>
                    open ? current.filter((item) => item !== section.title) : [...current, section.title],
                  )
                }
              >
                <strong>{section.title}</strong>
                <span>{open ? '收起' : '展开'}</span>
              </button>
              {open ? <p>{section.content}</p> : null}
            </article>
          )
        })}
      </div>

      <SectionTitle title="同住法下你还可以看" subtitle="保持在同一方向里挑，不把你重新扔回全量库存。" />
      <div className="stack-list scroll-reveal">
        {getHotelsByPlan(hotel.planId)
          .filter((item) => item.id !== hotel.id)
          .slice(0, 2)
          .map((item) => (
            <button key={item.id} type="button" className="recent-card" onClick={() => navigate(`/hotel/${item.id}`)}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.fitReason}</span>
              </div>
              <span>{item.roomPrice}</span>
            </button>
          ))}
      </div>

      <StickyBar
        left={<span>推荐房型 {roomList[0].price} 起</span>}
        right={
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              selectRoom(roomList[0].id)
              navigate(`/hotel/${hotel.id}/rooms`)
            }}
          >
            选房型
          </button>
        }
      />

      <CallOverlay state={callState} onClose={() => setCallState('idle')} />
    </Page>
  )
}

function RoomSelectionPage() {
  const navigate = useNavigate()
  const { hotelId = 'atrium' } = useParams()
  const { selectedPlanId, selectedRoomId, selectRoom } = useFlow()
  const motionRef = usePageMotion(`rooms-${hotelId}`)
  const hotel = getHotelById(hotelId)
  const plan = getPlanById(selectedPlanId || hotel.planId)
  const roomList = getRoomsByHotel(hotel.id)
  const [expandedRates, setExpandedRates] = useState<string | null>(null)
  const selectedRoom = roomList.find((room) => room.id === selectedRoomId) ?? roomList[0]

  return (
    <Page ref={motionRef}>
      <TopNav title="选这间房" onBack={() => navigate(`/hotel/${hotel.id}`)} />

      <section className="summary-inline" data-animate>
        {hotel.name} · {plan.label} · 今晚住 1 晚 · 1 间房 1 成人
      </section>

      <SectionTitle title="推荐你先看这 4 种" subtitle="按决策价值排序，不按房型库顺序排序。" />
      <div className="stack-list">
        {roomList.map((room) => (
          <article key={room.id} className={`room-card scroll-reveal ${selectedRoom.id === room.id ? 'is-selected' : ''}`}>
            <div className="tag-row">
              <Tag tone="accent">{room.badge}</Tag>
            </div>
            <strong>{room.name}</strong>
            <p>{room.delta}</p>
            <div className="room-meta">
              <span>{room.breakfast}</span>
              <span>{room.bed}</span>
              <span>{room.cancelRule}</span>
            </div>
            <div className="price-row">
              <b>{room.price}</b>
              {room.alternateRates ? (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setExpandedRates(expandedRates === room.id ? null : room.id)}
                >
                  查看其他价格
                </button>
              ) : null}
            </div>

            {expandedRates === room.id && room.alternateRates ? (
              <div className="rate-list">
                {room.alternateRates.map((rate) => (
                  <div key={rate.label} className="rate-line">
                    <div>
                      <strong>{rate.label}</strong>
                      <span>{rate.breakfast} · {rate.cancelRule}</span>
                    </div>
                    <b>{rate.price}</b>
                  </div>
                ))}
              </div>
            ) : null}

            <button type="button" className="secondary-button" onClick={() => selectRoom(room.id)}>
              {selectedRoom.id === room.id ? '已选择' : '选择这个房型'}
            </button>
          </article>
        ))}
      </div>

      <SectionTitle title="查看全部房型" subtitle="次级信息默认折叠，不抢推荐卡组的决策位置。" />
      <details className="accordion-card scroll-reveal">
        <summary>展开全部房型</summary>
        <div className="stack-list compact">
          {roomList.map((room) => (
            <div key={`all-${room.id}`} className="rate-line">
              <div>
                <strong>{room.name}</strong>
                <span>{room.breakfast} · {room.cancelRule}</span>
              </div>
              <b>{room.price}</b>
            </div>
          ))}
        </div>
      </details>

      <SectionTitle title="价格与规则" subtitle="提交前只保留必要规则，不让你在这里读长条款。" />
      <article className="info-card scroll-reveal">
        <p>价格已含：房费与基础服务费。</p>
        <p>取消规则：以所选 rate 的取消政策为准。</p>
        <p>到店时间说明：22:00 后建议勾选晚到保房。</p>
        <p>担保 / 押金：部分房型到店按酒店规则收取。</p>
      </article>

      <StickyBar
        left={<span>{selectedRoom ? `${selectedRoom.name} ${selectedRoom.price}` : '请选择一个房型'}</span>}
        right={
          <button
            type="button"
            className="primary-button"
            disabled={!selectedRoom}
            onClick={() => navigate('/checkout')}
          >
            确认这个房型
          </button>
        }
      />
    </Page>
  )
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { selectedHotelId, selectedPlanId, selectedRoomId, checkout, setCheckout } = useFlow()
  const motionRef = usePageMotion('checkout')
  const hotel = getHotelById(selectedHotelId)
  const plan = getPlanById(selectedPlanId)
  const room =
    getRoomsByHotel(hotel.id).find((item) => item.id === selectedRoomId) ?? getRoomsByHotel(hotel.id)[0]
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (!checkout.phone.trim()) nextErrors.phone = '请输入手机号'
    if (checkout.guests.length === 0 || !checkout.guests[0].trim()) nextErrors.guests = '请添加入住人'
    if (!checkout.arrival) nextErrors.arrival = '请选择到店时间'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  return (
    <Page ref={motionRef}>
      <TopNav title="确认预订" onBack={() => navigate(`/hotel/${hotel.id}/rooms`)} />

      <section className="summary-card" data-animate>
        <Tag tone="accent">{plan.label}</Tag>
        <h2>{hotel.name}</h2>
        <p>{room.name}</p>
        <p>今晚住 1 晚 · 1 间房 1 成人</p>
        <p>{hotel.fitReason}，价格也合适。</p>
      </section>

      <SectionTitle title="入住人信息" subtitle="尽量自动填，减少你在最后一步的输入成本。" />
      <div className="form-card-list" data-animate>
        <label className="field">
          <span>联系手机</span>
          <input
            value={checkout.phone}
            onChange={(event) => setCheckout({ phone: event.target.value })}
            placeholder="请输入手机号"
          />
          {errors.phone ? <small>{errors.phone}</small> : null}
        </label>

        <label className="field">
          <span>入住人</span>
          <input
            value={checkout.guests[0] ?? ''}
            onChange={(event) => setCheckout({ guests: [event.target.value] })}
            placeholder="请输入入住人姓名"
          />
          {errors.guests ? <small>{errors.guests}</small> : null}
        </label>
      </div>

      <SectionTitle title="到店安排" subtitle="提前把晚到、备注等影响履约的问题讲清楚。" />
      <div className="card-list scroll-reveal">
        <div className="choice-row">
          {['18:00 前', '18:00 - 22:00', '22:00 后'].map((slot) => (
            <button
              key={slot}
              type="button"
              className={`chip ${checkout.arrival === slot ? 'is-active' : ''}`}
              onClick={() => setCheckout({ arrival: slot })}
            >
              {slot}
            </button>
          ))}
        </div>
        {errors.arrival ? <small className="field-error">{errors.arrival}</small> : null}

        <label className="switch-row">
          <span>晚到帮我保房</span>
          <input
            type="checkbox"
            checked={checkout.lateHold}
            onChange={(event) => setCheckout({ lateHold: event.target.checked })}
          />
        </label>

        <label className="field">
          <span>特殊需求</span>
          <textarea
            value={checkout.note}
            onChange={(event) => setCheckout({ note: event.target.value })}
            placeholder="有特殊需求可备注"
          />
        </label>
      </div>

      <SectionTitle title="优惠与金额" subtitle="默认自动选最优，不让你在最后一步重新做算术题。" />
      <article className="info-card scroll-reveal">
        <p>已为你选最佳优惠。</p>
        <div className="rate-line">
          <span>房费</span>
          <b>{room.price}</b>
        </div>
        <div className="rate-line">
          <span>权益抵扣</span>
          <b>-¥20</b>
        </div>
        <div className="rate-line">
          <span>总价以提交订单页为准</span>
          <b>¥{parseCurrency(room.price) - 20}</b>
        </div>
      </article>

      <SectionTitle title="规则与保障" subtitle="只展示摘要，不在这里铺长条款。" />
      <article className="info-card scroll-reveal">
        <p>取消规则：{room.cancelRule}</p>
        <p>早餐说明：{room.breakfast}</p>
        <p>发票说明：可开发票</p>
        <p>停车说明：住客可按酒店规则使用停车位</p>
      </article>

      <details className="accordion-card scroll-reveal">
        <summary>你也可以看看</summary>
        <div className="stack-list compact">
          {fallbackAlternatives.map((item) => (
            <div key={item.title} className="rate-line">
              <div>
                <strong>{item.title}</strong>
                <span>切回对应住法继续挑选</span>
              </div>
              <b>{item.delta}</b>
            </div>
          ))}
        </div>
      </details>

      <StickyBar
        left={<span>应付金额 ¥{parseCurrency(room.price) - 20}</span>}
        right={
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              if (validate()) {
                setSubmitted(true)
              }
            }}
          >
            提交订单
          </button>
        }
      />

      <BottomSheet open={submitted} title="订单已提交（模拟）" onClose={() => setSubmitted(false)}>
        <p className="sheet-copy">核心链路已走通。真实支付和履约在这次原型范围之外。</p>
        <button type="button" className="primary-button full-width" onClick={() => setSubmitted(false)}>
          我知道了
        </button>
      </BottomSheet>
    </Page>
  )
}

function DirectSearchPage() {
  const navigate = useNavigate()
  const motionRef = usePageMotion('search')

  return (
    <Page ref={motionRef}>
      <TopNav title="酒店搜索" onBack={() => navigate(-1)} />

      <section className="search-bar" data-animate>
        <input defaultValue="北京 / 国贸 / 酒店" aria-label="酒店搜索" />
        <button type="button" className="secondary-button">搜索</button>
      </section>

      <SummaryStrip line1="北京 · 3月26日 - 3月27日 · 1 间房 1 成人" line2="推荐排序 · 位置距离 · 价格 / 星级" />

      <section className="recommend-card" data-animate>
        <span className="eyebrow">住法推荐</span>
        <h2>不想自己慢慢挑？</h2>
        <p>试试住法推荐，直接看适合这次的 3 种方案。</p>
        <button type="button" className="primary-button" onClick={() => navigate('/plans')}>
          试试住法
        </button>
      </section>

      <div className="stack-list">
        {directSearchHotels.map((hotel) => (
          <article key={hotel.id} className="search-card scroll-reveal">
            <img src={hotel.cover} alt={hotel.name} />
            <div className="search-copy">
              <strong>{hotel.name}</strong>
              <span>{hotel.location}</span>
              <div className="chip-row">
                {hotel.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="price-row">
                <span>{hotel.score} 分</span>
                <b>{hotel.price}</b>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Page>
  )
}

function HotelCard({
  hotel,
  isPrimary,
  compareActive,
  onCompare,
  onOpen,
}: {
  hotel: Hotel
  isPrimary: boolean
  compareActive: boolean
  onCompare: () => void
  onOpen: () => void
}) {
  return (
    <article className="hotel-card scroll-reveal">
      <button type="button" className="hotel-visual" onClick={onOpen}>
        <img src={hotel.cover} alt={hotel.name} />
        {isPrimary ? <Tag tone="accent">主推荐</Tag> : null}
      </button>
      <div className="hotel-copy">
        <button type="button" className="hotel-headline" onClick={onOpen}>
          <strong>{hotel.name}</strong>
          <p>{hotel.fitReason}</p>
        </button>
        <div className="chip-row">
          {hotel.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="metric-grid compact">
          <Metric title="去关键地点" value={hotel.timeToPlace} />
          <Metric title="总成本" value={hotel.totalCost} />
          <Metric title="用户评价" value={hotel.score} />
        </div>
        <p className="risk-line">风险提示：{hotel.risk}</p>
        <div className="price-row">
          <span>{hotel.roomSummary}</span>
          <b>{hotel.roomPrice}</b>
        </div>
        <div className="button-row">
          <ToggleChip active={compareActive} label="加入比较" onClick={onCompare} />
          <button type="button" className="secondary-button" onClick={onOpen}>
            看这家
          </button>
        </div>
      </div>
    </article>
  )
}

function TopNav({
  title,
  onBack,
  rightLabel,
  leftIcon,
  rightIcon,
  iconOnly,
  onRightClick,
}: {
  title: string
  onBack?: () => void
  rightLabel?: string
  leftIcon?: string
  rightIcon?: string
  iconOnly?: boolean
  onRightClick?: () => void
}) {
  return (
    <header className="top-nav">
      <button
        type="button"
        className={`nav-button ${iconOnly ? 'is-icon-only' : ''}`}
        onClick={onBack}
        disabled={!onBack}
        aria-label={onBack ? '返回' : undefined}
      >
        {leftIcon ? <IconFont glyph={leftIcon} className="nav-icon" /> : null}
        {onBack && !iconOnly ? '返回' : ''}
      </button>
      <h1>{title}</h1>
      <button
        type="button"
        className={`nav-button is-right ${iconOnly ? 'is-icon-only' : ''}`}
        onClick={onRightClick}
        disabled={!rightLabel}
        aria-label={rightLabel}
      >
        {rightIcon ? <IconFont glyph={rightIcon} className="nav-icon" /> : null}
        {!iconOnly ? rightLabel : null}
      </button>
    </header>
  )
}

function IconFont({ glyph, className }: { glyph: string; className?: string }) {
  return (
    <span className={['iconfontfliggy', className].filter(Boolean).join(' ')} aria-hidden="true">
      {String.fromCodePoint(Number.parseInt(glyph, 16))}
    </span>
  )
}

function SummaryStrip({
  line1,
  line2,
  actionLabel,
  onAction,
}: {
  line1: string
  line2: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <section className="summary-strip" data-animate>
      <div>
        <strong>{line1}</strong>
        <span>{line2}</span>
      </div>
      {actionLabel ? (
        <button type="button" className="text-button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  )
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="section-title scroll-reveal">
      <strong>{title}</strong>
      {subtitle ? <span>{subtitle}</span> : null}
    </div>
  )
}

function SelectionRow({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button type="button" className="selection-row" onClick={onClick}>
      <span>{label}</span>
      <strong>{value}</strong>
    </button>
  )
}

function Metric({ title, value, compact = false }: { title: string; value: string; compact?: boolean }) {
  return (
    <div className={`metric ${compact ? 'compact' : ''}`}>
      <span className="metric-label">{title}</span>
      <strong className="metric-value">{value}</strong>
    </div>
  )
}

function Tag({
  children,
  tone = 'neutral',
}: PropsWithChildren<{ tone?: 'neutral' | 'accent' }>) {
  return <span className={`tag ${tone === 'accent' ? 'is-accent' : ''}`}>{children}</span>
}

function ToggleChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" className={`chip ${active ? 'is-active' : ''}`} onClick={onClick}>
      {label}
    </button>
  )
}

function StickyBar({
  left,
  right,
}: {
  left: ReactNode
  right: ReactNode
}) {
  return (
    <div className="sticky-bar">
      <div className="sticky-bar-inner">
        <div className="sticky-copy">{left}</div>
        <div>{right}</div>
      </div>
    </div>
  )
}

function BottomSheet({
  open,
  title,
  onClose,
  children,
}: PropsWithChildren<{ open: boolean; title: string; onClose: () => void }>) {
  if (!open) {
    return null
  }

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-head">
          <strong>{title}</strong>
          <button type="button" className="text-button" onClick={onClose}>
            关闭
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function CallOverlay({ state, onClose }: { state: 'idle' | 'queue' | 'calling' | 'done'; onClose: () => void }) {
  if (state === 'idle') {
    return null
  }

  const content = {
    queue: {
      title: '正在为你联系酒店前台',
      body: '预计等待 30 秒左右，确认后会自动回填。',
    },
    calling: {
      title: '已接通，正在确认',
      body: '请稍等，系统正在确认加床与晚到安排。',
    },
    done: {
      title: '已确认',
      body: '当前房型支持备注加床需求，前台会在入住前再次确认。',
    },
  }[state]

  return (
    <div className="sheet-backdrop">
      <div className="call-card">
        <strong>{content.title}</strong>
        <p>{content.body}</p>
        <button type="button" className="primary-button full-width" onClick={onClose}>
          {state === 'done' ? '我知道了' : '取消'}
        </button>
      </div>
    </div>
  )
}

const Page = forwardRef<HTMLElement, PropsWithChildren>(({ children }, ref) => (
  <main ref={ref} className="page-shell">
    {children}
  </main>
))

Page.displayName = 'Page'

function parseCurrency(value: string) {
  return Number.parseInt(value.replace(/[^\d]/g, ''), 10) || 0
}

function parseMinutes(value: string) {
  return Number.parseInt(value.replace(/[^\d]/g, ''), 10) || 0
}

export default App
