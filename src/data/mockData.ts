export type Task = {
  id: string
  shortLabel: string
  title: string
  subtitle: string
  recentPlaces: string[]
}

export type IntentPreference = 'distance' | 'value' | 'quality' | 'balanced'

export type StayPlan = {
  id: string
  label: string
  headline: string
  summary: string
  reason: string
  timeToPlace: string
  totalCost: string
  experience: string
  gains: string[]
  tradeoffs: string[]
  recommendation?: string
  compareTag: string
  hotelIds: string[]
}

export type Hotel = {
  id: string
  planId: string
  name: string
  cover: string
  gallery: string[]
  fitReason: string
  tags: string[]
  timeToPlace: string
  totalCost: string
  score: string
  risk: string
  roomSummary: string
  roomPrice: string
  address: string
  arrivalTip: string
  locationInsight: string
  suitableTitle: string
  suitableSummary: string
  suitableTags: string[]
  benefits: string[]
  acceptances: string[]
  reviews: { scene: string; quote: string }[]
  detailSections: { title: string; content: string }[]
}

export type RoomOption = {
  id: string
  hotelId: string
  badge: string
  name: string
  delta: string
  breakfast: string
  bed: string
  cancelRule: string
  price: string
  note: string
  alternateRates?: {
    label: string
    price: string
    breakfast: string
    cancelRule: string
  }[]
}

export const tasks: Task[] = [
  {
    id: 'business',
    shortLabel: '差',
    title: '出差高效住',
    subtitle: '赶路少，第二天更省心',
    recentPlaces: ['国贸', '望京', '北京南站'],
  },
  {
    id: 'family',
    shortLabel: '娃',
    title: '带娃不折腾',
    subtitle: '少走路，住得稳',
    recentPlaces: ['环球影城', '北京动物园', '国家会议中心'],
  },
  {
    id: 'tonight',
    shortLabel: '今',
    title: '今晚临时住',
    subtitle: '快速落脚，少踩坑',
    recentPlaces: ['三里屯', '西单', '王府井'],
  },
  {
    id: 'airport',
    shortLabel: '夜',
    title: '转机 / 红眼过夜',
    subtitle: '到店稳，离机场近',
    recentPlaces: ['首都机场', '大兴机场', '三元桥'],
  },
  {
    id: 'weekend',
    shortLabel: '周',
    title: '周末休息住',
    subtitle: '轻松住一晚',
    recentPlaces: ['798', '亮马河', '鼓楼'],
  },
  {
    id: 'city',
    shortLabel: '城',
    title: '城市体验住',
    subtitle: '住得有感觉',
    recentPlaces: ['前门', '隆福寺', '亮马桥'],
  },
  {
    id: 'show',
    shortLabel: '演',
    title: '演出散场住',
    subtitle: '回去方便，不慌',
    recentPlaces: ['国家体育馆', '五棵松', '梅赛德斯中心'],
  },
  {
    id: 'hospital',
    shortLabel: '医',
    title: '医院陪护住',
    subtitle: '近医院，安排简单',
    recentPlaces: ['协和医院', '301 医院', '安贞医院'],
  },
]

export const preferenceOptions = [
  { id: 'distance', label: '赶路少' },
  { id: 'value', label: '花得值' },
  { id: 'quality', label: '住得好' },
  { id: 'balanced', label: '平衡' },
] as const

export const budgetOptions = ['不限', '300 内', '300-500', '500-800', '800-1200', '1200+', '自定义']

export const requiredOptions = [
  '可免费取消',
  '含早餐',
  '双床 / 双人住',
  '24小时前台',
  '可开票',
  '可停车',
  '近地铁',
  '可加床',
] as const

export const avoidOptions = ['隔音差', '无窗', '太老旧', '太偏', '不可退', '房间太小'] as const

export const recentTrips = [
  {
    id: 'recent-beijing',
    cityDate: '北京 · 今晚住 1 晚',
    task: '出差高效住',
    summary: '赶路少 · 可免费取消',
  },
  {
    id: 'recent-shanghai',
    cityDate: '上海 · 周末住 2 晚',
    task: '城市体验住',
    summary: '住得好 · 含早餐',
  },
]

export const stayPlans: StayPlan[] = [
  {
    id: 'plan-close',
    label: '赶路少',
    headline: '到国贸更快，晚到也稳',
    summary: '更靠近会场和地铁，适合把通勤时间压到最低。',
    reason: '如果更在意效率，建议选「赶路少」',
    timeToPlace: '到国贸 12 分钟',
    totalCost: '总成本 ¥620 起',
    experience: '住得稳',
    gains: ['通勤更短', '晚到更稳'],
    tradeoffs: ['房间不一定大', '价格不是最低'],
    recommendation: '更适合这次',
    compareTag: '更适合这次',
    hotelIds: ['atrium', 'station', 'metro'],
  },
  {
    id: 'plan-value',
    label: '花得值',
    headline: '把预算压在 600 内，也不牺牲核心需求',
    summary: '控制房费与交通的总成本，更适合预算有边界的差旅。',
    reason: '如果更看重预算，建议选「花得值」',
    timeToPlace: '到国贸 22 分钟',
    totalCost: '总成本 ¥498 起',
    experience: '够用不踩坑',
    gains: ['预算更稳', '免费取消更多'],
    tradeoffs: ['通勤会久一点', '品牌感一般'],
    compareTag: '更省钱',
    hotelIds: ['value', 'simple', 'calm'],
  },
  {
    id: 'plan-quality',
    label: '住得好',
    headline: '体面、安静、早餐更完整',
    summary: '适合需要更高休息质量和接待体面的场景。',
    reason: '如果更重视体验，建议选「住得好」',
    timeToPlace: '到国贸 18 分钟',
    totalCost: '总成本 ¥768 起',
    experience: '更舒服',
    gains: ['房间体验更完整', '早餐与服务更稳'],
    tradeoffs: ['整体更贵', '可选酒店更少'],
    compareTag: '更舒服',
    hotelIds: ['suite', 'quiet', 'premium'],
  },
]

export const hotels: Hotel[] = [
  {
    id: 'atrium',
    planId: 'plan-close',
    name: '北京国贸雅致酒店',
    cover: '/hotel-images/hotel-atrium.jpg',
    gallery: [
      '/hotel-images/hotel-atrium.jpg',
      '/hotel-images/hotel-window.jpg',
      '/hotel-images/hotel-bed.jpg',
    ],
    fitReason: '离国贸更近，晚到更稳',
    tags: ['近地铁', '免费取消', '24小时前台'],
    timeToPlace: '到国贸 12 分钟',
    totalCost: '总成本 ¥620 起',
    score: '4.8 分',
    risk: '房间不算大',
    roomSummary: '推荐房型：高级大床房',
    roomPrice: '¥588 起',
    address: '北京市朝阳区建国路乙 88 号',
    arrivalTip: '地铁步行 6 分钟，打车落客点直达大堂',
    locationInsight: '距国贸地铁站步行 6 分钟，晚间回酒店路线简单',
    suitableTitle: '适合这次国贸出差',
    suitableSummary: '到会场更近，晚到也省心，免费取消的房型选择充足。',
    suitableTags: ['到国贸 12 分钟', '免费取消', '24小时前台'],
    benefits: ['早上少赶路', '晚到也能顺利入住', '周边吃饭和打车都方便'],
    acceptances: ['房间面积偏紧凑', '早餐不是卖点', '价格不是这组里最低'],
    reviews: [
      { scene: '出差', quote: '去国贸开会很顺，早上能多睡一会。' },
      { scene: '晚到', quote: '半夜到店也很顺，前台处理挺利落。' },
      { scene: '预算', quote: '不算便宜，但综合时间成本很值。' },
    ],
    detailSections: [
      { title: '设施', content: '24 小时健身房、自助洗衣、会议会客区。' },
      { title: '政策', content: '入住前 18:00 可免费取消，支持开票。' },
      { title: '评价', content: '商务用户评价高，整体稳定性好。' },
      { title: '图片', content: '大堂与客房维护较新，风格偏简洁商务。' },
    ],
  },
  {
    id: 'station',
    planId: 'plan-close',
    name: '北京商务汇酒店',
    cover: '/hotel-images/hotel-corridor.jpg',
    gallery: [
      '/hotel-images/hotel-corridor.jpg',
      '/hotel-images/hotel-room.jpg',
      '/hotel-images/hotel-bath.jpg',
    ],
    fitReason: '到国贸和地铁都顺路',
    tags: ['近地铁', '含早餐', '可开票'],
    timeToPlace: '到国贸 15 分钟',
    totalCost: '总成本 ¥648 起',
    score: '4.7 分',
    risk: '早餐高峰偏挤',
    roomSummary: '推荐房型：商务双床房',
    roomPrice: '¥618 起',
    address: '北京市朝阳区景华南街 11 号',
    arrivalTip: '网约车进出方便，适合带行李快速落脚',
    locationInsight: '离核心地点略远于主推荐，但换乘成本低',
    suitableTitle: '适合想兼顾早餐与通勤的人',
    suitableSummary: '比主推荐略远一点，但早餐更完整，适合第二天早会。',
    suitableTags: ['到国贸 15 分钟', '含早餐', '可开票'],
    benefits: ['早餐更稳', '通勤仍然轻松', '会客区更完整'],
    acceptances: ['晚高峰打车略慢', '高峰早餐人多'],
    reviews: [
      { scene: '出差', quote: '早餐不错，适合早会前快速吃。' },
      { scene: '效率', quote: '路线简单，不容易绕。' },
      { scene: '服务', quote: '开票和入住都比较利落。' },
    ],
    detailSections: [
      { title: '设施', content: '餐厅、洗衣房、共享会议桌。' },
      { title: '政策', content: '大多数房型可免费取消。' },
      { title: '评价', content: '早餐与前台效率口碑较好。' },
      { title: '图片', content: '公共区干净明亮，房内风格偏商务。' },
    ],
  },
  {
    id: 'metro',
    planId: 'plan-close',
    name: '北京朝外轻居酒店',
    cover: '/hotel-images/hotel-window.jpg',
    gallery: [
      '/hotel-images/hotel-window.jpg',
      '/hotel-images/hotel-bed.jpg',
      '/hotel-images/hotel-bath.jpg',
    ],
    fitReason: '更轻松的预算下也能维持通勤效率',
    tags: ['近地铁', '免费取消', '安静'],
    timeToPlace: '到国贸 17 分钟',
    totalCost: '总成本 ¥568 起',
    score: '4.6 分',
    risk: '房型选择较少',
    roomSummary: '推荐房型：精选大床房',
    roomPrice: '¥538 起',
    address: '北京市朝阳区朝外大街 29 号',
    arrivalTip: '步行进出顺，适合短住',
    locationInsight: '不是最近，但在预算和距离之间更平衡',
    suitableTitle: '适合预算仍想保留效率的人',
    suitableSummary: '在同方向里价格更友好，适合控制差旅单价。',
    suitableTags: ['到国贸 17 分钟', '免费取消', '价格更友好'],
    benefits: ['价格更平衡', '回酒店路线清楚', '夜间环境安静'],
    acceptances: ['房型少', '没有明显品牌感'],
    reviews: [
      { scene: '预算', quote: '价格更友好，但体验不差。' },
      { scene: '通勤', quote: '去国贸还算方便，不折腾。' },
      { scene: '休息', quote: '夜里挺安静，适合短住。' },
    ],
    detailSections: [
      { title: '设施', content: '自助入住机、简餐、洗衣服务。' },
      { title: '政策', content: '支持免费取消与晚到保留。' },
      { title: '评价', content: '短住和快节奏出差人群评价稳定。' },
      { title: '图片', content: '空间小而整洁，灯光温和。' },
    ],
  },
  {
    id: 'value',
    planId: 'plan-value',
    name: '北京双井简宿酒店',
    cover: '/hotel-images/hotel-room.jpg',
    gallery: [
      '/hotel-images/hotel-room.jpg',
      '/hotel-images/hotel-window.jpg',
      '/hotel-images/hotel-bath.jpg',
    ],
    fitReason: '把预算压在 500 内，也保留免费取消',
    tags: ['免费取消', '近地铁', '预算友好'],
    timeToPlace: '到国贸 22 分钟',
    totalCost: '总成本 ¥498 起',
    score: '4.5 分',
    risk: '公共区一般',
    roomSummary: '推荐房型：舒适大床房',
    roomPrice: '¥468 起',
    address: '北京市朝阳区双井桥东 8 号',
    arrivalTip: '打车 15 分钟左右，晚高峰略慢',
    locationInsight: '交通可接受，适合预算优先的单人出差',
    suitableTitle: '适合预算明确、核心诉求清晰的人',
    suitableSummary: '价格压得更低，免费取消也保住了，适合短住。',
    suitableTags: ['总成本 ¥498 起', '免费取消', '近地铁'],
    benefits: ['预算最稳', '规则更灵活', '基础通勤可接受'],
    acceptances: ['公共区一般', '会客体面感不足'],
    reviews: [
      { scene: '预算', quote: '价格真的友好，适合控制成本。' },
      { scene: '规则', quote: '可退很关键，出差改计划不慌。' },
      { scene: '体验', quote: '基础够用，别期待太多附加服务。' },
    ],
    detailSections: [
      { title: '设施', content: '基础洗衣、自动售货、简易早餐。' },
      { title: '政策', content: '多数房型可免费取消。' },
      { title: '评价', content: '以价格稳定和规则灵活见长。' },
      { title: '图片', content: '客房整洁，公共空间普通。' },
    ],
  },
  {
    id: 'simple',
    planId: 'plan-value',
    name: '北京和风精选酒店',
    cover: '/hotel-images/hotel-lobby.jpg',
    gallery: [
      '/hotel-images/hotel-lobby.jpg',
      '/hotel-images/hotel-room.jpg',
      '/hotel-images/hotel-night.jpg',
    ],
    fitReason: '总体花费低，晚间入住体验稳',
    tags: ['预算友好', '24小时前台', '含早餐'],
    timeToPlace: '到国贸 26 分钟',
    totalCost: '总成本 ¥528 起',
    score: '4.4 分',
    risk: '通勤更久',
    roomSummary: '推荐房型：精选双床房',
    roomPrice: '¥498 起',
    address: '北京市朝阳区广渠路 36 号',
    arrivalTip: '深夜前台响应快，停车不方便',
    locationInsight: '更适合晚到后直接休息，第二天接受多一点通勤',
    suitableTitle: '适合想在预算里保住早餐的人',
    suitableSummary: '价格仍然友好，早餐和 24 小时前台补回一部分体验。',
    suitableTags: ['到国贸 26 分钟', '含早餐', '24小时前台'],
    benefits: ['深夜入住更稳', '早餐省事', '房价更可控'],
    acceptances: ['通勤更久', '停车不方便'],
    reviews: [
      { scene: '晚到', quote: '凌晨入住也有人接待。' },
      { scene: '早餐', quote: '早饭够用，适合赶时间。' },
      { scene: '预算', quote: '总成本挺稳，适合差旅报销控制。' },
    ],
    detailSections: [
      { title: '设施', content: '早餐厅、前台代寄存、简易会议角。' },
      { title: '政策', content: '晚到保房支持较好。' },
      { title: '评价', content: '适合晚到住一晚的商务用户。' },
      { title: '图片', content: '整体偏暖色，舒适但不算新。' },
    ],
  },
  {
    id: 'calm',
    planId: 'plan-value',
    name: '北京平衡商务酒店',
    cover: '/hotel-images/hotel-night.jpg',
    gallery: [
      '/hotel-images/hotel-night.jpg',
      '/hotel-images/hotel-bed.jpg',
      '/hotel-images/hotel-window.jpg',
    ],
    fitReason: '适合想在预算里换到更安静的休息环境',
    tags: ['更安静', '免费取消', '房型更稳'],
    timeToPlace: '到国贸 24 分钟',
    totalCost: '总成本 ¥546 起',
    score: '4.6 分',
    risk: '周边吃饭选择少',
    roomSummary: '推荐房型：安静楼层大床房',
    roomPrice: '¥516 起',
    address: '北京市朝阳区松榆南路 17 号',
    arrivalTip: '夜里环境安静，适合重休息',
    locationInsight: '比最低价略贵，但睡眠质量更稳',
    suitableTitle: '适合在预算内优先保证休息质量',
    suitableSummary: '对预算敏感，但不想冒隔音风险时，这家更稳妥。',
    suitableTags: ['更安静', '免费取消', '睡眠更稳'],
    benefits: ['睡眠更安稳', '预算仍可控', '取消规则灵活'],
    acceptances: ['周边配套少', '品牌感不强'],
    reviews: [
      { scene: '休息', quote: '晚上挺安静，第二天精神状态更好。' },
      { scene: '预算', quote: '比最便宜贵一点，但值得。' },
      { scene: '规则', quote: '可退很安心，改行程不慌。' },
    ],
    detailSections: [
      { title: '设施', content: '静音楼层、空气净化、简约餐吧。' },
      { title: '政策', content: '支持免费取消和延迟入住确认。' },
      { title: '评价', content: '睡眠体验口碑优于同价位。' },
      { title: '图片', content: '夜景房更有氛围，适合短暂停留。' },
    ],
  },
  {
    id: 'suite',
    planId: 'plan-quality',
    name: '北京御景套房酒店',
    cover: '/hotel-images/hotel-suite.avif',
    gallery: [
      '/hotel-images/hotel-suite.avif',
      '/hotel-images/hotel-atrium.jpg',
      '/hotel-images/hotel-bath.jpg',
    ],
    fitReason: '房间更完整，适合重要会面前休息',
    tags: ['房间更大', '含早餐', '服务稳定'],
    timeToPlace: '到国贸 18 分钟',
    totalCost: '总成本 ¥768 起',
    score: '4.9 分',
    risk: '价格更高',
    roomSummary: '推荐房型：行政大床房',
    roomPrice: '¥728 起',
    address: '北京市朝阳区景辉街 2 号',
    arrivalTip: '礼宾和叫车响应快，适合接待',
    locationInsight: '不是最近，但休息和会客体验明显更好',
    suitableTitle: '适合需要体面和稳定的这次出差',
    suitableSummary: '房间更完整、早餐更稳、服务更成熟，适合高强度行程。',
    suitableTags: ['到国贸 18 分钟', '含早餐', '房间更大'],
    benefits: ['睡眠与办公更舒服', '早餐和服务更稳', '会客更体面'],
    acceptances: ['整体预算更高', '不是最快到会场'],
    reviews: [
      { scene: '商务', quote: '会客和休息都更体面，适合重要行程。' },
      { scene: '早餐', quote: '早餐品质稳定，早会前很省心。' },
      { scene: '服务', quote: '叫车和礼宾都比较专业。' },
    ],
    detailSections: [
      { title: '设施', content: '行政酒廊、会议室、健身房、礼宾服务。' },
      { title: '政策', content: '支持免费取消房型有限，但高价房更稳。' },
      { title: '评价', content: '体面度和稳定性评价高。' },
      { title: '图片', content: '房间尺度和材质感更好。' },
    ],
  },
  {
    id: 'quiet',
    planId: 'plan-quality',
    name: '北京静安逸酒店',
    cover: '/hotel-images/hotel-bed.jpg',
    gallery: [
      '/hotel-images/hotel-bed.jpg',
      '/hotel-images/hotel-window.jpg',
      '/hotel-images/hotel-bath.jpg',
    ],
    fitReason: '更安静，适合第二天需要高强度输出',
    tags: ['更安静', '免费取消', '早餐完整'],
    timeToPlace: '到国贸 20 分钟',
    totalCost: '总成本 ¥726 起',
    score: '4.8 分',
    risk: '周边更安静，夜间便利性一般',
    roomSummary: '推荐房型：静享大床房',
    roomPrice: '¥688 起',
    address: '北京市朝阳区东三环北路 19 号',
    arrivalTip: '夜间环境安静，适合优先休息',
    locationInsight: '更像是把“睡个好觉”放在第一位',
    suitableTitle: '适合想把休息质量拉满的人',
    suitableSummary: '如果第二天行程强度高，这家能把噪音和打扰降到更低。',
    suitableTags: ['更安静', '免费取消', '早餐完整'],
    benefits: ['睡眠质量更稳', '早餐更完整', '取消规则更灵活'],
    acceptances: ['夜间便利性一般', '体面感不如套房酒店'],
    reviews: [
      { scene: '休息', quote: '晚上很安静，适合第二天开整天会。' },
      { scene: '规则', quote: '可退房型让临时改计划没那么焦虑。' },
      { scene: '早餐', quote: '早餐更像正经商务酒店的配置。' },
    ],
    detailSections: [
      { title: '设施', content: '静音楼层、早餐厅、夜间茶饮。' },
      { title: '政策', content: '多数房型可免费取消。' },
      { title: '评价', content: '重视休息质量的人群评价高。' },
      { title: '图片', content: '整体更温和克制，适合短暂停靠。' },
    ],
  },
  {
    id: 'premium',
    planId: 'plan-quality',
    name: '北京雅汇国际酒店',
    cover: '/hotel-images/hotel-bath.jpg',
    gallery: [
      '/hotel-images/hotel-bath.jpg',
      '/hotel-images/hotel-atrium.jpg',
      '/hotel-images/hotel-room.jpg',
    ],
    fitReason: '综合体验均衡，适合想住得更完整一点',
    tags: ['服务稳定', '房型更全', '含早餐'],
    timeToPlace: '到国贸 19 分钟',
    totalCost: '总成本 ¥738 起',
    score: '4.7 分',
    risk: '价格不低',
    roomSummary: '推荐房型：尊享大床房',
    roomPrice: '¥698 起',
    address: '北京市朝阳区光华路 12 号',
    arrivalTip: '接待和叫车体验较完整，适合商务接洽',
    locationInsight: '像是距离、品质、体面之间的中高配平衡解',
    suitableTitle: '适合想住得更完整但不想太张扬的人',
    suitableSummary: '整体更均衡，适合大多数高标准出差场景。',
    suitableTags: ['到国贸 19 分钟', '房型更全', '服务稳定'],
    benefits: ['综合体验均衡', '房型选择更丰富', '服务流程更成熟'],
    acceptances: ['预算更高', '亮点没有套房型那么突出'],
    reviews: [
      { scene: '综合', quote: '没有短板，整体很稳。' },
      { scene: '接待', quote: '接待客户前住这里更踏实。' },
      { scene: '房型', quote: '选择多，比较好挑到合适的。' },
    ],
    detailSections: [
      { title: '设施', content: '礼宾、早餐厅、商务中心、洗衣服务。' },
      { title: '政策', content: '可退与不可退房型都较全。' },
      { title: '评价', content: '综合型口碑稳定，没有明显短板。' },
      { title: '图片', content: '房型尺度和卫浴感受更完整。' },
    ],
  },
]

export const rooms: RoomOption[] = [
  {
    id: 'atrium-best',
    hotelId: 'atrium',
    badge: '最适合这次',
    name: '高级大床房',
    delta: '比最低价贵 38 元，但支持免费取消。',
    breakfast: '不含早餐',
    bed: '1.8m 大床 / 28㎡',
    cancelRule: '入住前 18:00 可免费取消',
    price: '¥588',
    note: '晚到更稳，价格也合适',
    alternateRates: [
      { label: '不可退优惠价', price: '¥550', breakfast: '不含早餐', cancelRule: '不可取消' },
      { label: '含早灵活价', price: '¥628', breakfast: '含 1 份早餐', cancelRule: '入住前 18:00 可免费取消' },
    ],
  },
  {
    id: 'atrium-low',
    hotelId: 'atrium',
    badge: '最便宜',
    name: '精选大床房',
    delta: '当前最低价，但不可退。',
    breakfast: '不含早餐',
    bed: '1.5m 大床 / 24㎡',
    cancelRule: '不可取消',
    price: '¥550',
    note: '适合确认行程不会变时',
  },
  {
    id: 'atrium-safe',
    hotelId: 'atrium',
    badge: '最稳妥',
    name: '行政大床房',
    delta: '比最适合这次贵 82 元，含早餐且规则更灵活。',
    breakfast: '含 1 份早餐',
    bed: '1.8m 大床 / 32㎡',
    cancelRule: '入住当天 18:00 前可免费取消',
    price: '¥670',
    note: '支持更灵活取消，早餐也更省事',
  },
  {
    id: 'atrium-comfy',
    hotelId: 'atrium',
    badge: '更舒服一点',
    name: '景观大床房',
    delta: '加 108 元换更高楼层和更好景观。',
    breakfast: '含 1 份早餐',
    bed: '1.8m 大床 / 34㎡',
    cancelRule: '入住前 18:00 可免费取消',
    price: '¥696',
    note: '适合想住得更舒展一点',
  },
  {
    id: 'suite-best',
    hotelId: 'suite',
    badge: '最适合这次',
    name: '行政大床房',
    delta: '更适合这次高强度行程，早餐和办公区都更完整。',
    breakfast: '含 1 份早餐',
    bed: '1.8m 大床 / 38㎡',
    cancelRule: '入住前 18:00 可免费取消',
    price: '¥728',
    note: '房间更完整，适合高标准出差',
  },
  {
    id: 'suite-low',
    hotelId: 'suite',
    badge: '最便宜',
    name: '尊贵大床房',
    delta: '当前最低价，但取消规则更紧。',
    breakfast: '不含早餐',
    bed: '1.8m 大床 / 34㎡',
    cancelRule: '入住前 48 小时可免费取消',
    price: '¥688',
    note: '适合已确认行程',
  },
  {
    id: 'suite-safe',
    hotelId: 'suite',
    badge: '最稳妥',
    name: '行政礼遇房',
    delta: '支持更晚取消，含早餐与礼宾。',
    breakfast: '含 2 份早餐',
    bed: '1.8m 大床 / 40㎡',
    cancelRule: '入住当天 18:00 前可免费取消',
    price: '¥768',
    note: '适合要接待或行程易变的人',
  },
  {
    id: 'suite-comfy',
    hotelId: 'suite',
    badge: '更舒服一点',
    name: '套房',
    delta: '再加 120 元，空间和会客体验明显更好。',
    breakfast: '含 2 份早餐',
    bed: '1.8m 大床 / 52㎡',
    cancelRule: '入住前 18:00 可免费取消',
    price: '¥848',
    note: '适合需要更体面和更舒展空间的场景',
  },
]

export const planComparison = [
  {
    title: '去关键地点',
    values: [
      { planId: 'plan-close', value: '12 分钟', tag: '更适合这次', note: '每天少赶路约 20 分钟' },
      { planId: 'plan-value', value: '22 分钟', tag: '更省钱', note: '通勤更久，但预算更稳' },
      { planId: 'plan-quality', value: '18 分钟', tag: '更舒服', note: '距离可接受，换来更好的休息质量' },
    ],
  },
  {
    title: '总成本',
    values: [
      { planId: 'plan-close', value: '¥620 起', tag: '效率优先', note: '时间成本低，总价略高' },
      { planId: 'plan-value', value: '¥498 起', tag: '更省钱', note: '房费与交通总成本最低' },
      { planId: 'plan-quality', value: '¥768 起', tag: '更舒服', note: '整体预算最高' },
    ],
  },
  {
    title: '入住与取消',
    values: [
      { planId: 'plan-close', value: '多数可免费取消', tag: '更适合这次', note: '晚到和改行程都比较稳' },
      { planId: 'plan-value', value: '可退房型更多', tag: '更省钱', note: '预算压低但规则保住了' },
      { planId: 'plan-quality', value: '灵活房型更贵', tag: '更舒服', note: '稳妥方案集中在高价房型' },
    ],
  },
  {
    title: '房间体验',
    values: [
      { planId: 'plan-close', value: '够用、偏紧凑', tag: '更适合这次', note: '效率优先，空间不算大' },
      { planId: 'plan-value', value: '基础够用', tag: '更省钱', note: '公共区和品牌感一般' },
      { planId: 'plan-quality', value: '更完整', tag: '更舒服', note: '更适合高强度行程后休息' },
    ],
  },
]

export const hotelComparison = [
  {
    title: '去关键地点',
    aValue: '12 分钟',
    bValue: '15 分钟',
    tag: 'A 更适合这次',
    note: '选 A 每天少赶路约 12 分钟。',
  },
  {
    title: '总成本',
    aValue: '¥620 起',
    bValue: '¥648 起',
    tag: 'A 更省一点',
    note: 'A 总成本略低，差旅单价更友好。',
  },
  {
    title: '房间体验',
    aValue: '偏紧凑但更新',
    bValue: '更完整但高峰更忙',
    tag: '看取舍',
    note: 'A 适合效率，B 适合更完整早餐和会客需求。',
  },
  {
    title: '入住与取消',
    aValue: '免费取消房型更多',
    bValue: '大多数可取消',
    tag: 'A 更稳',
    note: 'A 的灵活性略好，临时变动更安心。',
  },
]

export const directSearchHotels = [
  { id: 'search-1', name: '北京国贸雅致酒店', score: '4.8', location: '国贸 · 步行 6 分钟', tags: ['近地铁', '免费取消'], price: '¥588 起', cover: '/hotel-images/hotel-atrium.jpg' },
  { id: 'search-2', name: '北京御景套房酒店', score: '4.9', location: '国贸 · 打车 10 分钟', tags: ['含早餐', '房间更大'], price: '¥728 起', cover: '/hotel-images/hotel-suite.avif' },
  { id: 'search-3', name: '北京双井简宿酒店', score: '4.5', location: '双井 · 地铁 2 站', tags: ['预算友好', '免费取消'], price: '¥468 起', cover: '/hotel-images/hotel-room.jpg' },
]

export const fallbackAlternatives = [
  { title: '再省一点', delta: '-¥120', target: 'plan-value' },
  { title: '更近一点', delta: '+¥32', target: 'plan-close' },
]

export const getHotelsByPlan = (planId: string) => hotels.filter((hotel) => hotel.planId === planId)

export const getHotelById = (hotelId: string) => hotels.find((hotel) => hotel.id === hotelId) ?? hotels[0]

export const getPlanById = (planId: string) => stayPlans.find((plan) => plan.id === planId) ?? stayPlans[0]

export const getRoomsByHotel = (hotelId: string) => {
  const roomGroup = rooms.filter((room) => room.hotelId === hotelId)
  return roomGroup.length > 0 ? roomGroup : rooms.filter((room) => room.hotelId === 'atrium')
}
