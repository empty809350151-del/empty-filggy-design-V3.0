import { expect, test } from '@playwright/test'

async function expectNoHorizontalOverflow(page: Parameters<typeof test>[1]['page']) {
  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    root: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }))

  expect(overflow.root).toBeLessThanOrEqual(overflow.viewport)
  expect(overflow.body).toBeLessThanOrEqual(overflow.viewport)
}

test.describe('住法移动端链路', () => {
  test('首页到下单的关键链路可用', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: '选住法，住得更对味' })).toBeVisible()
    await expect(page.getByRole('button', { name: '出差高效住 赶路少，第二天更省心' })).toBeVisible()
    await expectNoHorizontalOverflow(page)

    await page.getByRole('button', { name: '出差高效住 赶路少，第二天更省心' }).click()
    await expect(page.getByText('北京 · 今晚住 1 晚，主要去国贸，更想赶路少')).toBeVisible()
    await expect(page.getByRole('button', { name: '出差高效住' })).toBeVisible()
    await expect(page.getByText('基础信息')).toBeVisible()
    await expect(page.getByRole('button', { name: '生成 3 种住法' })).toBeVisible()
    await expectNoHorizontalOverflow(page)

    await page.getByRole('button', { name: '生成 3 种住法' }).click()
    await expect(page.getByRole('heading', { name: '你的住法' })).toBeVisible()
    await expect(page.getByRole('button', { name: '比较已选住法' })).toBeVisible()
    await expectNoHorizontalOverflow(page)

    await page.getByRole('button', { name: '比较已选住法' }).click()
    await expect(page.getByText('系统建议')).toBeVisible()
    await expect(page.getByRole('button', { name: '继续看「赶路少」' })).toBeVisible()
    await expectNoHorizontalOverflow(page)

    await page.getByRole('button', { name: '继续看「赶路少」' }).click()
    await expect(page.getByText('当前住法', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: '比较这两家' })).toBeVisible()
    await expectNoHorizontalOverflow(page)

    await page.getByRole('button', { name: '北京国贸雅致酒店 离国贸更近，晚到更稳' }).click()
    await page.waitForURL(/\/hotel\/.+/)
    await expect(page.getByRole('heading', { name: '北京国贸雅致酒店' })).toBeVisible()
    await expect(page.getByRole('button', { name: '选房型' }).first()).toBeVisible()
    await expectNoHorizontalOverflow(page)

    await page.getByRole('button', { name: '选房型' }).first().click()
    await expect(page.getByRole('heading', { name: '选这间房' })).toBeVisible()
    await expect(page.getByRole('button', { name: '选择这个房型' }).first()).toBeVisible()
    await page.getByRole('button', { name: '选择这个房型' }).first().click()
    await page.getByRole('button', { name: '确认这个房型' }).click()

    await expect(page.getByRole('heading', { name: '确认预订' })).toBeVisible()
    await expect(page.getByRole('button', { name: '提交订单' })).toBeVisible()
    await page.getByRole('button', { name: '提交订单' }).click()
    await expect(page.getByText('请输入手机号')).toBeVisible()
    await expect(page.getByText('请选择到店时间')).toBeVisible()

    await page.getByPlaceholder('请输入手机号').fill('13800138000')
    await page.getByRole('button', { name: '22:00 后' }).click()
    await page.getByRole('button', { name: '提交订单' }).click()

    await expect(page.getByText('订单已提交（模拟）')).toBeVisible()
    await expectNoHorizontalOverflow(page)
  })

  test('住法结果页横滑默认居中且支持循环', async ({ page }) => {
    await page.goto('/plans')
    await page.waitForTimeout(600)

    const initialState = await page.evaluate(() => {
      const rail = document.querySelector<HTMLElement>('.plan-swipe-track')
      const cards = [...document.querySelectorAll<HTMLElement>('[data-plan-card]')]
      if (!rail || cards.length === 0) {
        return null
      }

      const focusX = rail.getBoundingClientRect().left + rail.getBoundingClientRect().width / 2
      const nearest = cards
        .map((card) => ({
          id: card.dataset.planId ?? '',
          seq: Number(card.dataset.planSeqIndex ?? '0'),
          distance: Math.abs(card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2 - focusX),
        }))
        .sort((a, b) => a.distance - b.distance)[0]

      return { nearest, scrollLeft: rail.scrollLeft }
    })

    expect(initialState).not.toBeNull()
    expect(initialState?.nearest.id).toBe('plan-close')
    expect(initialState?.nearest.seq).toBeGreaterThanOrEqual(3)
    expect(initialState?.nearest.seq).toBeLessThanOrEqual(5)
    expect(initialState?.scrollLeft).toBeGreaterThan(0)

    const loopedState = await page.evaluate(async () => {
      const rail = document.querySelector<HTMLElement>('.plan-swipe-track')
      const cards = [...document.querySelectorAll<HTMLElement>('[data-plan-card]')]
      if (!rail || cards.length === 0) {
        return null
      }

      rail.scrollLeft = rail.scrollWidth
      await new Promise((resolve) => window.setTimeout(resolve, 500))

      const focusX = rail.getBoundingClientRect().left + rail.getBoundingClientRect().width / 2
      const nearest = cards
        .map((card) => ({
          id: card.dataset.planId ?? '',
          seq: Number(card.dataset.planSeqIndex ?? '0'),
          distance: Math.abs(card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2 - focusX),
        }))
        .sort((a, b) => a.distance - b.distance)[0]

      return {
        nearest,
        scrollLeft: rail.scrollLeft,
        maxScrollLeft: rail.scrollWidth - rail.clientWidth,
      }
    })

    expect(loopedState).not.toBeNull()
    expect(loopedState?.nearest.id).toBeTruthy()
    expect(loopedState?.scrollLeft).toBeGreaterThan(0)
    expect(loopedState?.scrollLeft).toBeLessThan(loopedState?.maxScrollLeft ?? 0)
  })

  test('直接搜索兜底页保留住法入口', async ({ page }) => {
    await page.goto('/search')

    await expect(page.getByRole('button', { name: '试试住法' })).toBeVisible()
    await expect(page.getByText('不想自己慢慢挑？')).toBeVisible()
    await expectNoHorizontalOverflow(page)
  })

  test('酒店详情页图片横滑卡片会撑满滑块', async ({ page }) => {
    await page.goto('/hotel/atrium')

    const slide = page.locator('.gallery-slide').first()
    const image = slide.locator('img')

    await expect(page.getByText('1/3')).toBeVisible()
    await expect(slide).toBeVisible()
    await expect(image).toBeVisible()

    const slideBox = await slide.boundingBox()
    const imageBox = await image.boundingBox()

    expect(slideBox).not.toBeNull()
    expect(imageBox).not.toBeNull()
    expect(Math.abs((slideBox?.width ?? 0) - (imageBox?.width ?? 0))).toBeLessThanOrEqual(1)
    await expectNoHorizontalOverflow(page)
  })
})
