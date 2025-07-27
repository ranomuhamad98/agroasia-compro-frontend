import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load home page successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Agro Asia Berdikari/)
    
    // Check main content exists
    await expect(page.locator('main')).toBeVisible()
  })

  test('should display loading state initially', async ({ page }) => {
    // Intercept API call to simulate slow response
    await page.route('**/api/home', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      route.continue()
    })

    await page.goto('/')
    
    // Should show loading spinner
    await expect(page.locator('.spinner-border')).toBeVisible()
    
    // Loading should disappear after API response
    await expect(page.locator('.spinner-border')).not.toBeVisible({ timeout: 10000 })
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API call to simulate error
    await page.route('**/api/home', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ status: 500, message: 'Server Error' })
      })
    })

    await page.goto('/')
    
    // Should show error message
    await expect(page.locator('.alert-danger')).toBeVisible()
    await expect(page.locator('text=Unable to Load Content')).toBeVisible()
    
    // Should have retry button
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible()
  })

  test('should retry when retry button is clicked', async ({ page }) => {
    let requestCount = 0
    
    await page.route('**/api/home', route => {
      requestCount++
      if (requestCount === 1) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ status: 500, message: 'Server Error' })
        })
      } else {
        route.continue()
      }
    })

    await page.goto('/')
    
    // Should show error first
    await expect(page.locator('.alert-danger')).toBeVisible()
    
    // Click retry button
    await page.click('button:has-text("Try Again")')
    
    // Should load successfully on retry
    await expect(page.locator('.alert-danger')).not.toBeVisible({ timeout: 10000 })
    await expect(page.locator('main')).toBeVisible()
  })

  test('should display all main sections when data loads', async ({ page }) => {
    // Wait for content to load
    await expect(page.locator('.spinner-border')).not.toBeVisible({ timeout: 10000 })
    
    // Check all main sections are rendered
    const sections = [
      'home-hero',
      'home-about-us', 
      'home-category-list',
      'home-top-product',
      'home-programs',
      'home-spotlight',
      'home-testimoni',
      'home-faq'
    ]

    for (const section of sections) {
      await expect(page.locator(section)).toBeVisible()
    }
  })

  test('should pass data correctly to components', async ({ page }) => {
    // Wait for content to load
    await expect(page.locator('.spinner-border')).not.toBeVisible({ timeout: 10000 })
    
    // Check if components receive data (look for content that would only appear with real data)
    // This assumes the components render some identifiable content when they receive data
    
    // Check categories section has content
    await expect(page.locator('home-category-list')).toBeVisible()
    
    // Check products section has content  
    await expect(page.locator('home-top-product')).toBeVisible()
    
    // Check FAQ section has content
    await expect(page.locator('home-faq')).toBeVisible()
  })

  test('should handle network failures', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/home', route => route.abort())

    await page.goto('/')
    
    // Should show error message
    await expect(page.locator('.alert-danger')).toBeVisible({ timeout: 10000 })
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Wait for content to load
    await expect(page.locator('.spinner-border')).not.toBeVisible({ timeout: 10000 })
    
    // Check main content is still visible
    await expect(page.locator('main')).toBeVisible()
    
    // Check responsive classes are applied (if using Bootstrap)
    await expect(page.locator('.container')).toBeVisible()
  })

  test('should handle slow API responses', async ({ page }) => {
    // Simulate slow API response
    await page.route('**/api/home', async route => {
      await new Promise(resolve => setTimeout(resolve, 3000))
      route.continue()
    })

    await page.goto('/')
    
    // Should show loading for extended time
    await expect(page.locator('.spinner-border')).toBeVisible()
    
    // Should eventually load content
    await expect(page.locator('.spinner-border')).not.toBeVisible({ timeout: 15000 })
    await expect(page.locator('main')).toBeVisible()
  })

  test('should maintain page state during refresh', async ({ page }) => {
    // Wait for initial load
    await expect(page.locator('.spinner-border')).not.toBeVisible({ timeout: 10000 })
    
    // Refresh page
    await page.reload()
    
    // Should load again successfully
    await expect(page.locator('.spinner-border')).not.toBeVisible({ timeout: 10000 })
    await expect(page.locator('main')).toBeVisible()
  })

  test('should log success and error messages to console', async ({ page }) => {
    const consoleMessages: string[] = []
    
    page.on('console', msg => {
      consoleMessages.push(msg.text())
    })

    await page.goto('/')
    
    // Wait for content to load
    await expect(page.locator('.spinner-border')).not.toBeVisible({ timeout: 10000 })
    
    // Check for success log message
    expect(consoleMessages.some(msg => msg.includes('Home data loaded successfully'))).toBe(true)
  })
}) 