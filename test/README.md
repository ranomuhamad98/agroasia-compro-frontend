# Testing Documentation

This project uses a comprehensive testing strategy with multiple types of tests to ensure reliability and quality.

## 🧪 Testing Stack

- **Vitest**: Unit and integration testing framework
- **@vue/test-utils**: Vue component testing utilities
- **Playwright**: End-to-end testing
- **MSW (Mock Service Worker)**: API mocking
- **Happy DOM**: Lightweight DOM environment for tests

## 📁 Test Structure

```
test/
├── unit/                   # Unit tests
│   ├── composables/        # Composable tests
│   └── stores/             # Pinia store tests
├── integration/            # Integration tests
│   └── api/                # API integration tests
├── e2e/                    # End-to-end tests
├── fixtures/               # Test data fixtures
├── utils/                  # Test utilities
├── setup.ts               # Global test setup
└── README.md              # This file
```

## 🚀 Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### All Tests
```bash
# Run all tests
npm test
```

## 📋 Test Categories

### Unit Tests
- **API Client Tests**: Test retry logic, error handling, timeout
- **Composable Tests**: Test `useHomeApi` functionality
- **Store Tests**: Test Pinia store actions, getters, mutations

### Integration Tests
- **API Endpoint Tests**: Test actual API responses
- **Data Validation**: Validate API response structure
- **Performance Tests**: Response time and payload size

### E2E Tests
- **Page Loading**: Test home page loading and rendering
- **Error Handling**: Test error states and recovery
- **User Interactions**: Test retry buttons and navigation
- **Responsive Design**: Test mobile and desktop views

## 🛠️ Test Utilities

### Setup File (`test/setup.ts`)
- MSW server configuration
- Mock API responses
- Global test setup

### Test Helpers (`test/utils/test-helpers.ts`)
- Composable wrapper creation
- Wait utilities
- Console mocking
- Promise flushing

### Fixtures (`test/fixtures/api-responses.ts`)
- Mock data structures
- API response fixtures
- Error response samples

## 🎯 Best Practices

### Unit Tests
- Test one function/method at a time
- Mock external dependencies
- Use descriptive test names
- Test both success and error cases

### Integration Tests
- Test real API endpoints
- Validate response structures
- Test error scenarios
- Check performance metrics

### E2E Tests
- Test user workflows
- Use page object patterns
- Test responsive design
- Validate console logs

## 📊 Coverage

Coverage reports are generated automatically and include:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

Reports are available in:
- Terminal output
- HTML format (`coverage/index.html`)
- JSON format (`coverage/coverage.json`)

## 🐛 Debugging Tests

### Unit/Integration Tests
```bash
# Debug with Vitest UI
npx vitest --ui

# Debug specific test
npx vitest run specific-test.test.ts
```

### E2E Tests
```bash
# Debug with Playwright UI
npm run test:e2e:ui

# Run with debug mode
npx playwright test --debug
```

## 🔧 Configuration

### Vitest Config (`vitest.config.ts`)
- Nuxt environment setup
- Coverage configuration
- Test file patterns

### Playwright Config (`playwright.config.ts`)
- Browser configurations
- Test timeouts
- Reporting setup

## 🚨 CI/CD Integration

Tests are configured to run in CI environments with:
- Headless browser mode
- Retry strategies
- Artifact collection
- Coverage reporting

## ⚡ Performance

### Test Performance Tips
- Use `beforeEach` for common setup
- Mock expensive operations
- Use `test.concurrent` for independent tests
- Optimize fixture data size

### API Mocking
- Use MSW for consistent API mocking
- Implement realistic delays
- Test various response scenarios
- Mock error conditions

## 📝 Writing New Tests

### Unit Test Template
```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup code
  })

  it('should do something specific', () => {
    // Test implementation
    expect(result).toBe(expected)
  })
})
```

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should perform user action', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('element')).toBeVisible()
  })
})
```

## 🔍 Troubleshooting

Common issues and solutions:

1. **MSW not intercepting requests**: Check server setup in `beforeAll`
2. **Async tests failing**: Use proper `await` and timeouts
3. **Component mounting errors**: Ensure proper Pinia setup
4. **E2E tests timing out**: Increase timeout or add proper waits

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Nuxt Testing](https://nuxt.com/docs/getting-started/testing) 