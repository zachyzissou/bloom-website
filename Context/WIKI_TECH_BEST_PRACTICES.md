# Wiki Alignment Update: Technology Best Practices Research

**Research Date**: 2025-11-02
**Purpose**: Comprehensive best practices for implementing the wiki synchronization pipeline (Steps.md tasks S001-S035)

---

## 1. @gitbeaker/rest (v40.x) Best Practices

### Official Documentation
- **Primary Package**: `@gitbeaker/rest` (v40.x+)
- **Repository**: https://github.com/jdalrymple/gitbeaker
- **Authority**: Official GitLab SDK maintained by jdalrymple

### Authentication Best Practices

**Must Have**:
```typescript
import { Gitlab } from '@gitbeaker/rest'

const api = new Gitlab({
  host: 'https://gitlab.com', // or your self-hosted instance
  token: process.env.GITLAB_TOKEN, // Personal Access Token
})
```

**Key Points**:
- **NEVER hardcode tokens** - Always use environment variables
- Use **Personal Access Tokens** from GitLab profile settings
- Token requires `api` scope for full API access
- Token requires `read_repository` scope minimum for wiki access

**Security Configuration**:
```typescript
const api = new Gitlab({
  host: 'https://gitlab.com',
  token: process.env.GITLAB_TOKEN,
  rejectUnauthorized: true, // Default - enforce SSL validation
  queryTimeout: 30000, // 30 seconds default, adjust as needed
})
```

**Optional - Sudo for Impersonation**:
```typescript
const api = new Gitlab({
  host: 'https://gitlab.com',
  token: process.env.GITLAB_TOKEN,
  sudo: 'username-or-id', // Only if you need to impersonate
})
```

**AVOID**: Setting `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` in production

### Error Handling Patterns

**Custom Error Type**:
```typescript
class GitbeakerError extends Error {
  constructor(
    message: string,
    options?: {
      cause: {
        description: string
        request: Request
        response: Response
      }
    }
  ) {
    super(message, options)
    this.name = 'GitbeakerError'
  }
}
```

**Recommended Error Handling Pattern**:
```typescript
async function fetchWikiPage(projectId: number, slug: string) {
  try {
    const page = await api.Wikis.show(projectId, slug)
    return page
  } catch (error) {
    if (error instanceof Error && error.name === 'GitbeakerError') {
      // Access detailed error information
      const cause = (error as any).cause

      if (cause?.response?.status === 404) {
        console.warn(`Wiki page not found: ${slug}`)
        return null
      }

      if (cause?.response?.status === 429) {
        // Rate limit - handled by retry logic
        throw error
      }

      console.error('GitLab API Error:', {
        message: error.message,
        statusText: cause?.response?.statusText,
        request: cause?.request?.url,
      })
      throw error
    }

    // Unknown error type
    throw error
  }
}
```

**Error Handling Best Practices**:
- **Check for specific error types** before handling
- **Log detailed error context** including request URL and status
- **Handle 404 gracefully** - pages may not exist
- **Re-throw critical errors** to prevent silent failures
- **Include context** in error messages for debugging

### Rate Limiting & Retry Logic

**GitLab Rate Limits** (as of 2024):
- **Authenticated requests**: 600-2000 requests per minute (depends on endpoint)
- **Projects/Groups/Users APIs**: Stricter limits announced May 2024
- **Wiki endpoints**: Subject to project API limits (typically 600/min)
- **Large file operations** (>10 MB): 5 calls per minute per object

**Rate Limit Headers**:
```typescript
// GitLab returns these headers in responses
interface RateLimitHeaders {
  'RateLimit-Limit': string        // Max requests allowed
  'RateLimit-Observed': string     // Current request count
  'RateLimit-Remaining': string    // Requests left
  'RateLimit-Reset': string        // Unix timestamp when limit resets
  'Retry-After': string            // Seconds to wait (on 429 responses)
}
```

**Recommended Retry Strategy**:
```typescript
interface RetryConfig {
  maxRetries: number
  baseDelay: number
  maxDelay: number
}

async function fetchWithRetry<T>(
  apiCall: () => Promise<T>,
  config: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
  }
): Promise<T> {
  let attempt = 0

  while (attempt <= config.maxRetries) {
    try {
      return await apiCall()
    } catch (error: any) {
      const cause = error?.cause
      const status = cause?.response?.status
      const headers = cause?.response?.headers

      // Handle rate limiting (429)
      if (status === 429) {
        const retryAfter = headers?.get('Retry-After')
        const waitTime = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.min(config.baseDelay * Math.pow(2, attempt), config.maxDelay)

        console.warn(`Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${config.maxRetries}`)
        await sleep(waitTime)
        attempt++
        continue
      }

      // Handle transient errors (500, 502, 503, 504, 520-530)
      const isTransientError = [500, 502, 503, 504].includes(status)
        || (status >= 520 && status <= 530)

      if (isTransientError && attempt < config.maxRetries) {
        const waitTime = Math.min(
          config.baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
          config.maxDelay
        )

        console.warn(`Transient error ${status}. Retrying in ${waitTime}ms (attempt ${attempt + 1}/${config.maxRetries})`)
        await sleep(waitTime)
        attempt++
        continue
      }

      // Non-retryable error or max retries exceeded
      throw error
    }
  }

  throw new Error(`Max retries (${config.maxRetries}) exceeded`)
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

**Proactive Rate Limit Monitoring**:
```typescript
async function fetchWithRateLimitCheck<T>(
  api: Gitlab,
  apiCall: () => Promise<T>
): Promise<T> {
  // Check rate limit before making request
  const rateLimitStatus = await checkRateLimitStatus(api)

  if (rateLimitStatus.remaining <= 5) {
    const waitTime = rateLimitStatus.resetTime - Date.now() + 1000 // +1s buffer
    console.warn(`Approaching rate limit. Waiting ${waitTime}ms`)
    await sleep(waitTime)
  }

  return await apiCall()
}

async function checkRateLimitStatus(api: Gitlab) {
  // Make a lightweight request to check headers
  try {
    const response = await api.Users.current()
    // Extract rate limit headers from response
    // Note: GitBeaker may not expose headers directly
    return {
      remaining: 100, // Parse from headers
      resetTime: Date.now() + 60000, // Parse from headers
    }
  } catch (error) {
    // Fallback if headers unavailable
    return { remaining: 100, resetTime: Date.now() + 60000 }
  }
}
```

**Best Practices Summary**:
- ✅ **Implement exponential backoff** with jitter for transient errors
- ✅ **Respect Retry-After header** on 429 responses
- ✅ **Set reasonable max retries** (3-5 attempts recommended)
- ✅ **Add random jitter** to prevent thundering herd
- ✅ **Monitor rate limit headers** proactively (check when remaining ≤ 5)
- ✅ **Log retry attempts** for debugging and monitoring
- ⚠️ **AVOID infinite retries** - always set a maximum
- ⚠️ **AVOID aggressive retry intervals** on non-transient errors

### Pagination Best Practices

**GitBeaker Pagination API**:
```typescript
// Fetch all users with pagination
const allUsers = await api.Users.all({
  maxPages: 10,      // Limit to 10 pages (prevents runaway)
  perPage: 100,      // Items per page (max 100 for most endpoints)
  showExpanded: true // Include additional details
})

// Manual pagination for fine-grained control
let page = 1
const perPage = 100
let hasMore = true

const allItems = []

while (hasMore) {
  const items = await api.Projects.all({
    page,
    perPage,
  })

  allItems.push(...items)

  // GitLab returns fewer items on last page
  hasMore = items.length === perPage
  page++

  // Safety limit
  if (page > 50) {
    console.warn('Pagination safety limit reached')
    break
  }
}
```

**Best Practices**:
- ✅ **Always set maxPages** to prevent infinite loops
- ✅ **Use perPage: 100** for efficiency (GitLab's max)
- ✅ **Implement safety limits** for manual pagination
- ✅ **Track pagination progress** in logs
- ⚠️ **AVOID fetching unlimited pages** without limits

---

## 2. remark + unified Ecosystem Best Practices

### Official Documentation
- **remark**: https://github.com/remarkjs/remark (v15.x)
- **unified**: https://unifiedjs.com/
- **remark-gfm**: https://github.com/remarkjs/remark-gfm
- **Authority**: Official unified collective, fully typed TypeScript

### Modern Markdown Parsing Patterns (v15.x)

**Recommended Setup**:
```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { read } from 'to-vfile'

// Parse markdown to AST
const processor = unified()
  .use(remarkParse)      // Parse markdown to mdast
  .use(remarkGfm)        // Enable GFM (tables, strikethrough, etc.)
  // Add other plugins here
  .use(remarkStringify)  // Serialize mdast back to markdown

async function parseMarkdown(filePath: string) {
  const file = await read(filePath)
  const ast = await processor.parse(file)
  return ast
}
```

**Key Architecture Components**:
- **remark-parse**: Converts markdown text → mdast (markdown AST)
- **remark-gfm**: Adds GitHub Flavored Markdown support
- **remark-stringify**: Converts mdast → markdown text
- **unified**: Pipeline orchestration

**When to Use What**:
- ✅ **Use remark** for markdown syntax transformations
- ✅ **Use rehype** for HTML transformations
- ✅ **Use remark-gfm** for tables, strikethrough, task lists
- ⚠️ **Use micromark directly** only for custom syntax (advanced)

**TypeScript Best Practices**:
```typescript
import type { Root, Table, TableRow, TableCell } from 'mdast'

// Properly type your AST transformations
function extractTables(ast: Root): Table[] {
  const tables: Table[] = []

  // Type-safe AST traversal
  visit(ast, 'table', (node: Table) => {
    tables.push(node)
  })

  return tables
}
```

### Extracting Data from Markdown Tables (remark-gfm)

**Table AST Structure** (mdast):
```typescript
interface Table extends Node {
  type: 'table'
  align?: Array<'left' | 'right' | 'center' | null>
  children: TableRow[]
}

interface TableRow extends Node {
  type: 'tableRow'
  children: TableCell[]
}

interface TableCell extends Node {
  type: 'tableCell'
  children: Array<Text | Emphasis | Strong | InlineCode | Link>
}
```

**Recommended Table Extraction Pattern**:
```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import type { Root, Table, TableRow, Text } from 'mdast'

interface ParsedTable {
  headers: string[]
  rows: string[][]
  align?: Array<'left' | 'right' | 'center' | null>
}

function extractTablesFromMarkdown(markdown: string): ParsedTable[] {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)

  const ast = processor.parse(markdown) as Root
  const tables: ParsedTable[] = []

  visit(ast, 'table', (node: Table) => {
    const [headerRow, ...dataRows] = node.children

    // Extract headers
    const headers = headerRow.children.map(cell =>
      extractTextFromCell(cell)
    )

    // Extract data rows
    const rows = dataRows.map(row =>
      row.children.map(cell => extractTextFromCell(cell))
    )

    tables.push({
      headers,
      rows,
      align: node.align,
    })
  })

  return tables
}

function extractTextFromCell(cell: TableCell): string {
  let text = ''

  visit(cell, 'text', (node: Text) => {
    text += node.value
  })

  // Handle emphasis, strong, inline code, etc.
  visit(cell, ['emphasis', 'strong', 'inlineCode'], (node: any) => {
    if (node.type === 'inlineCode') {
      text += node.value
    }
  })

  return text.trim()
}
```

**Complex Table Cell Extraction** (with formatting):
```typescript
import type { PhrasingContent } from 'mdast'

interface FormattedCell {
  text: string
  hasEmphasis: boolean
  hasStrong: boolean
  hasCode: boolean
  links: string[]
}

function extractFormattedCell(cell: TableCell): FormattedCell {
  const result: FormattedCell = {
    text: '',
    hasEmphasis: false,
    hasStrong: false,
    hasCode: false,
    links: [],
  }

  visit(cell, (node) => {
    switch (node.type) {
      case 'text':
        result.text += node.value
        break
      case 'emphasis':
        result.hasEmphasis = true
        break
      case 'strong':
        result.hasStrong = true
        break
      case 'inlineCode':
        result.hasCode = true
        result.text += node.value
        break
      case 'link':
        result.links.push(node.url)
        break
    }
  })

  result.text = result.text.trim()
  return result
}
```

**Best Practices**:
- ✅ **Use remark-gfm** for table parsing (don't reinvent)
- ✅ **Visit with type guards** for type safety
- ✅ **Handle nested formatting** (emphasis, strong, code, links)
- ✅ **Preserve alignment information** from table AST
- ✅ **Validate table structure** before processing
- ⚠️ **AVOID assuming uniform column counts** across rows
- ⚠️ **AVOID direct string manipulation** - use AST utilities

### AST Traversal Patterns (unist-util-visit)

**Basic Traversal**:
```typescript
import { visit, CONTINUE, SKIP, EXIT } from 'unist-util-visit'
import type { Root, Node } from 'mdast'

// Visit all nodes of a specific type
visit(ast, 'heading', (node, index, parent) => {
  console.log('Found heading:', node.depth, node.children)
})

// Visit multiple types
visit(ast, ['heading', 'paragraph'], (node, index, parent) => {
  if (node.type === 'heading') {
    // Handle heading
  } else if (node.type === 'paragraph') {
    // Handle paragraph
  }
})

// Visit all nodes
visit(ast, (node, index, parent) => {
  console.log('Node type:', node.type)
})
```

**Traversal Control**:
```typescript
visit(ast, 'heading', (node, index, parent) => {
  if (node.depth === 1) {
    // Stop traversing entirely
    return EXIT
  }

  if (node.depth === 2) {
    // Skip children of this node
    return SKIP
  }

  // Continue normally (default)
  return CONTINUE
})
```

**Safe Mutation Pattern**:
```typescript
import type { Root, Heading } from 'mdast'

// Mutate nodes safely
visit(ast, 'heading', (node: Heading, index, parent) => {
  // Transform node in place
  node.depth = Math.min(node.depth + 1, 6)

  // Or replace in parent
  if (parent && typeof index === 'number') {
    parent.children[index] = {
      ...node,
      depth: Math.min(node.depth + 1, 6),
    }
  }
})
```

**Finding Specific Content**:
```typescript
function findFirstTable(ast: Root): Table | null {
  let foundTable: Table | null = null

  visit(ast, 'table', (node) => {
    foundTable = node
    return EXIT // Stop after first match
  })

  return foundTable
}

function findHeadingByText(ast: Root, text: string): Heading | null {
  let foundHeading: Heading | null = null

  visit(ast, 'heading', (node: Heading) => {
    const headingText = node.children
      .filter((child): child is Text => child.type === 'text')
      .map(child => child.value)
      .join('')

    if (headingText.includes(text)) {
      foundHeading = node
      return EXIT
    }
  })

  return foundHeading
}
```

**Best Practices**:
- ✅ **Use SKIP to improve performance** (don't traverse unnecessary children)
- ✅ **Use EXIT when you found what you need** (early termination)
- ✅ **Type your visitor functions** with specific node types
- ✅ **Check parent and index** before mutating
- ✅ **Use type guards** for node.type checks
- ⚠️ **AVOID mutating while iterating** without parent/index context
- ⚠️ **AVOID side effects** in visitor functions when possible

### Plugin Development Pattern

**Custom Plugin Template**:
```typescript
import type { Plugin } from 'unified'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

const remarkCustomPlugin: Plugin<[], Root> = () => {
  return (tree, file) => {
    // Your transformation logic
    visit(tree, 'table', (node) => {
      // Process tables
    })
  }
}

export default remarkCustomPlugin

// Usage
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkCustomPlugin)
  .use(remarkStringify)
```

**Best Practices**:
- ✅ **Type your plugins** with Plugin<Options[], Root>
- ✅ **Return transformer function** from plugin
- ✅ **Use file.message()** for warnings
- ✅ **Use file.fail()** for errors
- ✅ **Document plugin options** with TypeScript interfaces

---

## 3. microdiff + string-similarity Best Practices

### microdiff: Object Comparison

**Official Documentation**:
- **Repository**: https://github.com/AsyncBanana/microdiff
- **NPM**: https://www.npmjs.com/package/microdiff
- **Authority**: AsyncBanana, highly performant (<1KB)

**Basic Usage**:
```typescript
import { diff } from 'microdiff'

interface DesignToken {
  name: string
  value: string
  type: 'color' | 'spacing' | 'typography'
}

const oldTokens: DesignToken[] = [
  { name: 'primary', value: '#0066CC', type: 'color' },
  { name: 'spacing-sm', value: '8px', type: 'spacing' },
]

const newTokens: DesignToken[] = [
  { name: 'primary', value: '#0073E6', type: 'color' }, // Changed
  { name: 'spacing-sm', value: '8px', type: 'spacing' }, // Same
  { name: 'spacing-md', value: '16px', type: 'spacing' }, // New
]

const changes = diff(oldTokens, newTokens)
console.log(changes)
/* Output:
[
  { type: 'CHANGE', path: ['0', 'value'], value: '#0073E6', oldValue: '#0066CC' },
  { type: 'CREATE', path: ['2'], value: { name: 'spacing-md', value: '16px', type: 'spacing' } }
]
*/
```

**Diff Output Types**:
```typescript
type DiffChange =
  | { type: 'CREATE', path: (string | number)[], value: any }
  | { type: 'REMOVE', path: (string | number)[], oldValue: any }
  | { type: 'CHANGE', path: (string | number)[], value: any, oldValue: any }
```

**Effective Object Comparison Strategies**:

**1. Comparing Token Objects**:
```typescript
function compareTokens(
  oldTokens: DesignToken[],
  newTokens: DesignToken[]
): {
  added: DesignToken[]
  modified: DesignToken[]
  removed: DesignToken[]
} {
  const changes = diff(oldTokens, newTokens)

  const added: DesignToken[] = []
  const modified: DesignToken[] = []
  const removed: DesignToken[] = []

  for (const change of changes) {
    if (change.type === 'CREATE') {
      // New token added
      if (change.path.length === 1) {
        added.push(change.value)
      }
    } else if (change.type === 'REMOVE') {
      // Token removed
      if (change.path.length === 1) {
        removed.push(change.oldValue)
      }
    } else if (change.type === 'CHANGE') {
      // Token property changed
      const tokenIndex = parseInt(change.path[0] as string, 10)
      if (!isNaN(tokenIndex)) {
        modified.push(newTokens[tokenIndex])
      }
    }
  }

  return { added, modified, removed }
}
```

**2. Deep Object Comparison**:
```typescript
function hasChanged(oldObj: any, newObj: any): boolean {
  const changes = diff(oldObj, newObj)
  return changes.length > 0
}

function getChangedProperties(oldObj: any, newObj: any): string[] {
  const changes = diff(oldObj, newObj)
  const changedProps = new Set<string>()

  for (const change of changes) {
    // Get top-level property from path
    const topLevelProp = change.path[0]
    if (typeof topLevelProp === 'string') {
      changedProps.add(topLevelProp)
    }
  }

  return Array.from(changedProps)
}
```

**3. Comparing Arrays by Key**:
```typescript
function compareTokensByName(
  oldTokens: DesignToken[],
  newTokens: DesignToken[]
): {
  added: DesignToken[]
  modified: Array<{ old: DesignToken, new: DesignToken }>
  removed: DesignToken[]
  unchanged: DesignToken[]
} {
  const oldMap = new Map(oldTokens.map(t => [t.name, t]))
  const newMap = new Map(newTokens.map(t => [t.name, t]))

  const added: DesignToken[] = []
  const modified: Array<{ old: DesignToken, new: DesignToken }> = []
  const removed: DesignToken[] = []
  const unchanged: DesignToken[] = []

  // Find added and modified
  for (const [name, newToken] of newMap) {
    const oldToken = oldMap.get(name)

    if (!oldToken) {
      added.push(newToken)
    } else {
      const changes = diff(oldToken, newToken)
      if (changes.length > 0) {
        modified.push({ old: oldToken, new: newToken })
      } else {
        unchanged.push(newToken)
      }
    }
  }

  // Find removed
  for (const [name, oldToken] of oldMap) {
    if (!newMap.has(name)) {
      removed.push(oldToken)
    }
  }

  return { added, modified, removed, unchanged }
}
```

**Best Practices**:
- ✅ **Use microdiff for structural changes** (CREATE, REMOVE, CHANGE)
- ✅ **Compare by unique keys** for better change tracking
- ✅ **Filter by change type** for targeted handling
- ✅ **Handle nested paths** carefully (arrays vs objects)
- ✅ **Optimize for performance** - microdiff is very fast (<1KB)
- ⚠️ **AVOID comparing functions** - microdiff doesn't diff function logic
- ⚠️ **AVOID circular references** - can cause infinite loops
- ⚠️ **AVOID Date/RegExp issues** - microdiff handles these correctly

### string-similarity: Text Comparison

**Algorithm Selection Guide**:

| Use Case | Algorithm | Threshold | Notes |
|----------|-----------|-----------|-------|
| Typo detection | Levenshtein | 0.80-0.90 | Character-level edits |
| Short strings (names) | Jaro-Winkler | 0.85-0.95 | Prefix-weighted |
| Long texts (descriptions) | Cosine Similarity | 0.70-0.85 | Token-based |
| Exact matching | Exact string equality | 1.0 | Fast, no fuzzy |

**Recommended Library** (string-similarity npm package):
```typescript
import { compareTwoStrings, findBestMatch } from 'string-similarity'

// Compare two strings (Dice coefficient)
const similarity = compareTwoStrings('wiki color', 'wiki-color')
console.log(similarity) // 0.8 (80% similar)

// Find best match from array
const { bestMatch, ratings } = findBestMatch('primary-color', [
  'primary-color',
  'primary_color',
  'primaryColor',
  'secondary-color',
])
console.log(bestMatch.target) // 'primary-color'
console.log(bestMatch.rating) // 1.0 (exact match)
```

**Threshold Selection Strategy**:
```typescript
interface SimilarityThresholds {
  exact: 1.0              // Exact match
  veryHigh: 0.90          // Nearly identical (minor typo)
  high: 0.80              // Similar with typos
  medium: 0.70            // Somewhat similar
  low: 0.60               // Distantly related
}

function categorizeStringSimilarity(
  str1: string,
  str2: string
): 'exact' | 'veryHigh' | 'high' | 'medium' | 'low' | 'none' {
  const similarity = compareTwoStrings(str1, str2)

  if (similarity >= 1.0) return 'exact'
  if (similarity >= 0.90) return 'veryHigh'
  if (similarity >= 0.80) return 'high'
  if (similarity >= 0.70) return 'medium'
  if (similarity >= 0.60) return 'low'
  return 'none'
}
```

**Text Normalization Best Practices**:
```typescript
function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()                  // Case insensitive
    .replace(/[_-]/g, ' ')          // Normalize separators
    .replace(/\s+/g, ' ')           // Collapse whitespace
    .trim()                         // Remove leading/trailing
}

function compareNormalized(str1: string, str2: string): number {
  const normalized1 = normalizeForComparison(str1)
  const normalized2 = normalizeForComparison(str2)
  return compareTwoStrings(normalized1, normalized2)
}

// Example
console.log(compareNormalized('Primary-Color', 'primary_color')) // 1.0
```

**Fuzzy Matching Pattern**:
```typescript
function findSimilarTokens(
  targetName: string,
  candidateNames: string[],
  threshold: number = 0.80
): Array<{ name: string, similarity: number }> {
  const normalized = normalizeForComparison(targetName)

  return candidateNames
    .map(name => ({
      name,
      similarity: compareTwoStrings(normalized, normalizeForComparison(name)),
    }))
    .filter(result => result.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
}

// Usage
const similar = findSimilarTokens('primary-btn-color', [
  'primary-button-color',   // High match
  'primary-bg-color',       // Medium match
  'secondary-btn-color',    // Lower match
  'unrelated-token',        // No match
], 0.70)

console.log(similar)
// [
//   { name: 'primary-button-color', similarity: 0.88 },
//   { name: 'primary-bg-color', similarity: 0.76 },
// ]
```

**Manual Validation Workflow**:
```typescript
interface FuzzyMatch {
  wikiToken: string
  localToken: string
  similarity: number
  confidence: 'high' | 'medium' | 'low'
  requiresReview: boolean
}

function generateMatchReport(
  wikiTokens: string[],
  localTokens: string[],
  threshold: number = 0.80
): FuzzyMatch[] {
  const matches: FuzzyMatch[] = []

  for (const wikiToken of wikiTokens) {
    const similar = findSimilarTokens(wikiToken, localTokens, threshold)

    if (similar.length === 0) {
      // No match found
      matches.push({
        wikiToken,
        localToken: '',
        similarity: 0,
        confidence: 'low',
        requiresReview: true,
      })
    } else {
      const bestMatch = similar[0]
      matches.push({
        wikiToken,
        localToken: bestMatch.name,
        similarity: bestMatch.similarity,
        confidence: bestMatch.similarity >= 0.90 ? 'high'
          : bestMatch.similarity >= 0.80 ? 'medium'
          : 'low',
        requiresReview: bestMatch.similarity < 0.90,
      })
    }
  }

  return matches
}
```

**Best Practices**:
- ✅ **Normalize text before comparison** (case, punctuation, separators)
- ✅ **Set context-appropriate thresholds** (higher for critical data)
- ✅ **Manual validation for low confidence** matches (<0.90)
- ✅ **Use best match from array** for disambiguation
- ✅ **Combine algorithms** for better accuracy (character + token-based)
- ✅ **Log similarity scores** for threshold refinement
- ⚠️ **AVOID one-size-fits-all thresholds** - tune per use case
- ⚠️ **AVOID assuming high similarity = correct match** - validate semantically

**Empirical Threshold Recommendations** (from research):
- **0.863+**: High-quality matches after manual validation
- **0.90+**: Safe for automatic matching
- **0.80-0.89**: Requires review
- **<0.80**: Likely false positive

---

## 4. style-dictionary v4.x Best Practices

### Official Documentation
- **Website**: https://styledictionary.com/
- **Repository**: https://github.com/style-dictionary/style-dictionary
- **Authority**: Official Style Dictionary project, v4.0+ released Q2 2024

### Configuration Best Practices

**File Format Selection**:
```javascript
// sd.config.js (JavaScript - RECOMMENDED for flexibility)
import StyleDictionary from 'style-dictionary'

export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
      }],
    },
  },
}
```

**vs JSON Configuration**:
```json
// sd.config.json (JSON - simpler but limited)
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "src/styles/",
      "files": [{
        "destination": "tokens.css",
        "format": "css/variables"
      }]
    }
  }
}
```

**When to Use JavaScript Config**:
- ✅ **Custom transforms** - Need inline functions
- ✅ **Custom formats** - Complex output requirements
- ✅ **Dynamic logic** - Conditional platform configuration
- ✅ **Preprocessors** - Token manipulation before build

**DTCG Spec Adoption** (v4.0+):
```json
// tokens/colors.json (DTCG format)
{
  "color": {
    "primary": {
      "$type": "color",
      "$value": "#0066CC",
      "$description": "Primary brand color"
    },
    "secondary": {
      "$type": "color",
      "$value": "#FF6B00"
    }
  }
}
```

**Legacy Format** (still supported):
```json
{
  "color": {
    "primary": {
      "value": "#0066CC",
      "type": "color",
      "description": "Primary brand color"
    }
  }
}
```

**Best Practice**: Use DTCG spec ($type, $value) for forward compatibility

### Platform Configuration

**Multi-Platform Setup**:
```javascript
// sd.config.js
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    // Web: CSS Custom Properties
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: {
          outputReferences: true, // Preserve token references
        },
      }],
    },

    // Web: SCSS Variables
    scss: {
      transformGroup: 'scss',
      buildPath: 'src/styles/',
      files: [{
        destination: '_tokens.scss',
        format: 'scss/variables',
      }],
    },

    // Web: JavaScript/TypeScript
    js: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/module',
      }, {
        destination: 'tokens.d.ts',
        format: 'typescript/module-declarations',
      }],
    },

    // Tailwind Config
    tailwind: {
      transformGroup: 'js',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tailwind-tokens.js',
        format: 'javascript/module',
        filter: (token) => {
          // Only include specific token types
          return ['color', 'spacing', 'fontSize'].includes(token.type)
        },
      }],
    },
  },
}
```

**Platform Properties**:
```typescript
interface Platform {
  transforms?: string[]          // Array of transform names
  transformGroup?: string        // Predefined transform group
  buildPath: string              // Output directory (must end with /)
  files: FileConfig[]            // Output file configurations
  actions?: string[]             // Post-build actions
  prefix?: string                // Token name prefix
}

interface FileConfig {
  destination: string            // Output filename
  format: string                 // Format name
  filter?: (token: Token) => boolean  // Token filtering
  options?: {
    outputReferences?: boolean   // Preserve token references
    showFileHeader?: boolean     // Include header comment
  }
}
```

### Output Format Recommendations

**CSS Custom Properties** (Recommended for Web):
```javascript
// sd.config.js
export default {
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: {
          outputReferences: true,
          selector: ':root',
        },
      }],
    },
  },
}
```

**Output**:
```css
/* tokens.css */
:root {
  --color-primary: #0066CC;
  --color-secondary: var(--color-primary); /* Reference preserved */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --font-size-body: 16px;
}
```

**Tailwind Config Integration**:
```javascript
// sd.config.js
import { registerTransform } from 'style-dictionary'

// Custom transform for Tailwind format
registerTransform({
  name: 'tailwind/name',
  type: 'name',
  transformer: (token) => {
    // Convert token path to Tailwind key
    return token.path.join('-')
  },
})

export default {
  platforms: {
    tailwind: {
      transforms: ['tailwind/name', 'size/px', 'color/hex'],
      buildPath: 'src/styles/',
      files: [{
        destination: 'tailwind-tokens.js',
        format: 'javascript/module-flat',
      }],
    },
  },
}
```

**Output**:
```javascript
// tailwind-tokens.js
export default {
  'color-primary': '#0066CC',
  'color-secondary': '#FF6B00',
  'spacing-sm': '8px',
  'spacing-md': '16px',
}
```

**Import in tailwind.config.js**:
```javascript
import tokens from './styles/tailwind-tokens.js'

export default {
  theme: {
    extend: {
      colors: {
        primary: tokens['color-primary'],
        secondary: tokens['color-secondary'],
      },
      spacing: {
        sm: tokens['spacing-sm'],
        md: tokens['spacing-md'],
      },
    },
  },
}
```

**TypeScript Declarations**:
```javascript
// sd.config.js
export default {
  platforms: {
    ts: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/module',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/module-declarations',
        },
      ],
    },
  },
}
```

**Output**:
```typescript
// tokens.d.ts
export interface DesignTokens {
  color: {
    primary: string
    secondary: string
  }
  spacing: {
    sm: string
    md: string
  }
}

declare const tokens: DesignTokens
export default tokens
```

### Token Expansion (Composite Tokens)

**DTCG Composite Token**:
```json
{
  "shadow": {
    "card": {
      "$type": "shadow",
      "$value": {
        "offsetX": "0px",
        "offsetY": "2px",
        "blur": "4px",
        "spread": "0px",
        "color": "#00000040"
      }
    }
  }
}
```

**Expansion Configuration**:
```javascript
// sd.config.js
export default {
  expand: {
    typesMap: {
      // Expand shadow into individual properties
      shadow: {
        offsetX: 'dimension',
        offsetY: 'dimension',
        blur: 'dimension',
        spread: 'dimension',
        color: 'color',
      },
    },
  },
  platforms: {
    css: {
      transformGroup: 'css',
      expand: true, // Enable expansion
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
      }],
    },
  },
}
```

**Output**:
```css
:root {
  --shadow-card-offset-x: 0px;
  --shadow-card-offset-y: 2px;
  --shadow-card-blur: 4px;
  --shadow-card-spread: 0px;
  --shadow-card-color: #00000040;
}
```

### File Organization Best Practices

**Recommended Token Structure**:
```
tokens/
├── core/
│   ├── colors.json          # Core brand colors
│   ├── typography.json      # Font families, sizes, weights
│   ├── spacing.json         # Spacing scale
│   └── shadows.json         # Shadow definitions
├── semantic/
│   ├── colors-semantic.json # Semantic color mappings
│   └── typography-semantic.json
└── component/
    ├── button.json          # Button-specific tokens
    ├── card.json            # Card-specific tokens
    └── input.json           # Input-specific tokens
```

**Token Filtering Strategy**:
```javascript
// sd.config.js
export default {
  platforms: {
    css: {
      transformGroup: 'css',
      files: [
        {
          destination: 'tokens-core.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('core/'),
        },
        {
          destination: 'tokens-semantic.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('semantic/'),
        },
        {
          destination: 'tokens-components.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('component/'),
        },
      ],
    },
  },
}
```

**Best Practices Summary**:
- ✅ **Use JavaScript config** for flexibility (custom transforms/formats)
- ✅ **Adopt DTCG spec** ($type, $value) for forward compatibility
- ✅ **Enable outputReferences** to preserve token relationships
- ✅ **Organize tokens by layer** (core → semantic → component)
- ✅ **Filter tokens per output** to reduce file sizes
- ✅ **Generate TypeScript declarations** for type safety
- ✅ **Set buildPath trailing slash** (required by Style Dictionary)
- ⚠️ **AVOID mixing DTCG and legacy formats** in same project
- ⚠️ **AVOID massive single token files** - split by domain

### Name Transform Changes (v3 → v4)

**Important Breaking Change**:
```javascript
// v3 (deprecated)
transforms: ['name/cti/kebab']

// v4 (current)
transforms: ['name/kebab']
```

**All /cti transforms removed** - update your configs accordingly.

---

## 5. Build-Time Data Fetching in Astro Best Practices

### Official Documentation
- **Astro Docs**: https://docs.astro.build/en/guides/data-fetching/
- **Authority**: Official Astro documentation (v4.x, updated 2024-2025)

### Core Concepts

**Build-Time vs Runtime Fetching**:

| Mode | When Data Fetched | Use Case | Performance |
|------|-------------------|----------|-------------|
| **Static (default)** | At build time (once) | Infrequently changing data | Fastest (pre-rendered) |
| **SSR** | On each request | Real-time data | Slower (server-side) |
| **Client-side** | In browser | User-specific data | Medium (client-side) |

**For Wiki Sync**: Use **static build-time fetching** ✅

### Best Practices for Fetching External Data During Build

**1. Top-Level Await Pattern** (Recommended):
```astro
---
// src/pages/design-tokens.astro
import { Gitlab } from '@gitbeaker/rest'

const api = new Gitlab({
  host: 'https://gitlab.com',
  token: import.meta.env.GITLAB_TOKEN,
})

// Fetch wiki data at build time
const wikiPage = await api.Wikis.show(123, 'Design-Tokens')
const tokens = parseWikiTokens(wikiPage.content)

function parseWikiTokens(markdown: string) {
  // Parse markdown tables into token data
  return []
}
---

<html>
  <head>
    <title>Design Tokens</title>
  </head>
  <body>
    <h1>Design Tokens from Wiki</h1>
    <ul>
      {tokens.map(token => (
        <li>{token.name}: {token.value}</li>
      ))}
    </ul>
  </body>
</html>
```

**2. Data Fetching Utility Module**:
```typescript
// src/utils/fetchWikiData.ts
import { Gitlab } from '@gitbeaker/rest'
import { parseWikiTables } from './parseMarkdown'

export interface WikiToken {
  name: string
  value: string
  type: string
  description?: string
}

const api = new Gitlab({
  host: 'https://gitlab.com',
  token: import.meta.env.GITLAB_TOKEN,
})

export async function fetchWikiTokens(
  projectId: number,
  wikiSlug: string
): Promise<WikiToken[]> {
  try {
    const page = await api.Wikis.show(projectId, wikiSlug)
    const tables = parseWikiTables(page.content)

    // Transform first table into tokens
    if (tables.length > 0) {
      const [headers, ...rows] = tables[0]
      return rows.map(row => ({
        name: row[0],
        value: row[1],
        type: row[2],
        description: row[3],
      }))
    }

    return []
  } catch (error) {
    console.error('Failed to fetch wiki tokens:', error)
    throw error
  }
}
```

**Usage in Page**:
```astro
---
// src/pages/tokens.astro
import { fetchWikiTokens } from '../utils/fetchWikiData'

const tokens = await fetchWikiTokens(123, 'Design-Tokens')
---

<html>
  <!-- Render tokens -->
</html>
```

**3. Pass Data as Props** (Component Pattern):
```astro
---
// src/pages/index.astro
import TokenList from '../components/TokenList.astro'
import { fetchWikiTokens } from '../utils/fetchWikiData'

const tokens = await fetchWikiTokens(123, 'Design-Tokens')
---

<html>
  <body>
    <TokenList tokens={tokens} />
  </body>
</html>
```

```astro
---
// src/components/TokenList.astro
interface Props {
  tokens: Array<{ name: string; value: string }>
}

const { tokens } = Astro.props
---

<ul>
  {tokens.map(token => (
    <li>{token.name}: {token.value}</li>
  ))}
</ul>
```

### Caching Strategies for API Data

**1. In-Memory Cache (Simple)**:
```typescript
// src/utils/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>()

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 60000 // 1 minute default
): Promise<T> {
  const cached = cache.get(key)

  if (cached && Date.now() - cached.timestamp < ttl) {
    console.log(`Cache hit: ${key}`)
    return cached.data as T
  }

  console.log(`Cache miss: ${key}`)
  const data = await fetcher()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
```

**Usage**:
```typescript
// src/utils/fetchWikiData.ts
import { cachedFetch } from './cache'

export async function fetchWikiTokens(projectId: number, wikiSlug: string) {
  return cachedFetch(
    `wiki-${projectId}-${wikiSlug}`,
    async () => {
      const page = await api.Wikis.show(projectId, wikiSlug)
      return parseWikiTables(page.content)
    },
    300000 // 5 minute cache
  )
}
```

**2. File-Based Cache** (Persistent):
```typescript
// src/utils/fileCache.ts
import fs from 'node:fs/promises'
import path from 'node:path'

const CACHE_DIR = '.cache'

export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const cachePath = path.join(CACHE_DIR, `${key}.json`)
    const data = await fs.readFile(cachePath, 'utf-8')
    return JSON.parse(data) as T
  } catch {
    return null
  }
}

export async function saveToCache<T>(key: string, data: T): Promise<void> {
  const cachePath = path.join(CACHE_DIR, `${key}.json`)
  await fs.mkdir(CACHE_DIR, { recursive: true })
  await fs.writeFile(cachePath, JSON.stringify(data, null, 2))
}

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await getFromCache<T>(key)

  if (cached) {
    console.log(`File cache hit: ${key}`)
    return cached
  }

  console.log(`File cache miss: ${key}`)
  const data = await fetcher()
  await saveToCache(key, data)
  return data
}
```

**3. Build Script Pre-Fetch** (Recommended for CI/CD):
```json
// package.json
{
  "scripts": {
    "fetch-wiki": "node scripts/fetch-wiki-data.js",
    "build": "npm run fetch-wiki && astro build"
  }
}
```

```javascript
// scripts/fetch-wiki-data.js
import { Gitlab } from '@gitbeaker/rest'
import fs from 'node:fs/promises'

const api = new Gitlab({
  host: 'https://gitlab.com',
  token: process.env.GITLAB_TOKEN,
})

async function main() {
  console.log('Fetching wiki data...')

  const page = await api.Wikis.show(123, 'Design-Tokens')

  await fs.mkdir('src/data', { recursive: true })
  await fs.writeFile(
    'src/data/wiki-tokens.json',
    JSON.stringify(page, null, 2)
  )

  console.log('Wiki data cached to src/data/wiki-tokens.json')
}

main().catch(console.error)
```

**Load cached data in Astro**:
```astro
---
import wikiData from '../data/wiki-tokens.json'

const tokens = parseWikiTokens(wikiData.content)
---
```

**4. Astro Content Layer API** (Astro 5.0+):
```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import { gitlabLoader } from './src/loaders/gitlab'

export default defineConfig({
  experimental: {
    contentLayer: true,
  },
  content: {
    collections: {
      wikiPages: gitlabLoader({
        projectId: 123,
        token: process.env.GITLAB_TOKEN,
      }),
    },
  },
})
```

```typescript
// src/loaders/gitlab.ts
import { Gitlab } from '@gitbeaker/rest'

export function gitlabLoader(config: { projectId: number; token: string }) {
  return {
    async load() {
      const api = new Gitlab({
        host: 'https://gitlab.com',
        token: config.token,
      })

      const pages = await api.Wikis.all(config.projectId)

      return pages.map(page => ({
        id: page.slug,
        slug: page.slug,
        title: page.title,
        content: page.content,
      }))
    },
  }
}
```

**Built-in caching and incremental updates** - Astro 5.0+ feature ✅

### Error Handling in Build Scripts

**Graceful Degradation Pattern**:
```typescript
// src/utils/fetchWikiData.ts
import { cachedFetch } from './fileCache'

export async function fetchWikiTokens(
  projectId: number,
  wikiSlug: string
): Promise<WikiToken[]> {
  try {
    return await cachedFetch(`wiki-${projectId}-${wikiSlug}`, async () => {
      const page = await api.Wikis.show(projectId, wikiSlug)
      return parseWikiTables(page.content)
    })
  } catch (error) {
    console.error('Failed to fetch wiki tokens:', error)

    // Fallback to empty array or default tokens
    console.warn('Using fallback tokens')
    return []
  }
}
```

**Fail-Fast Pattern** (CI/CD):
```typescript
export async function fetchWikiTokens(
  projectId: number,
  wikiSlug: string
): Promise<WikiToken[]> {
  const page = await api.Wikis.show(projectId, wikiSlug)

  if (!page || !page.content) {
    throw new Error(`Wiki page not found: ${wikiSlug}`)
  }

  const tokens = parseWikiTables(page.content)

  if (tokens.length === 0) {
    throw new Error(`No tokens found in wiki page: ${wikiSlug}`)
  }

  return tokens
}
```

**Validation Pattern**:
```typescript
import { z } from 'zod'

const WikiTokenSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
  type: z.enum(['color', 'spacing', 'typography']),
  description: z.string().optional(),
})

const WikiTokensSchema = z.array(WikiTokenSchema)

export async function fetchWikiTokens(
  projectId: number,
  wikiSlug: string
): Promise<WikiToken[]> {
  const page = await api.Wikis.show(projectId, wikiSlug)
  const tables = parseWikiTables(page.content)

  // Transform and validate
  const tokens = tables[0]?.map(row => ({
    name: row[0],
    value: row[1],
    type: row[2],
    description: row[3],
  }))

  // Validate with Zod
  const result = WikiTokensSchema.safeParse(tokens)

  if (!result.success) {
    console.error('Token validation failed:', result.error)
    throw new Error('Invalid wiki token format')
  }

  return result.data
}
```

### Performance Optimization

**1. Parallel Fetching**:
```typescript
// src/utils/fetchAllWikiData.ts
export async function fetchAllWikiData(projectId: number) {
  const [tokens, guidelines, components] = await Promise.all([
    fetchWikiTokens(projectId, 'Design-Tokens'),
    fetchWikiTokens(projectId, 'Guidelines'),
    fetchWikiTokens(projectId, 'Components'),
  ])

  return { tokens, guidelines, components }
}
```

**2. Lazy Loading (Client-Side)**:
```astro
---
// Only fetch critical data at build time
const criticalTokens = await fetchWikiTokens(123, 'Design-Tokens')
---

<html>
  <body>
    <div id="tokens">
      <!-- Critical tokens rendered at build time -->
      {criticalTokens.map(token => <div>{token.name}</div>)}
    </div>

    <!-- Non-critical data loaded client-side -->
    <script>
      async function loadAdditionalTokens() {
        const response = await fetch('/api/additional-tokens')
        const tokens = await response.json()
        // Render additional tokens
      }

      // Load after page interactive
      if (document.readyState === 'complete') {
        loadAdditionalTokens()
      } else {
        window.addEventListener('load', loadAdditionalTokens)
      }
    </script>
  </body>
</html>
```

**3. Incremental Builds** (Astro 5.0+ Content Layer):
```typescript
// Automatically handles incremental updates
// Only re-fetches changed content
```

### Best Practices Summary

**Must Have**:
- ✅ **Use top-level await** in component scripts for build-time fetching
- ✅ **Implement file-based caching** for CI/CD environments
- ✅ **Add build script pre-fetch** (`npm run fetch-wiki && astro build`)
- ✅ **Validate fetched data** with schemas (Zod/TypeScript)
- ✅ **Handle errors gracefully** with fallbacks or fail-fast
- ✅ **Pass data as props** to child components (avoid re-fetching)

**Recommended**:
- ✅ **Use Promise.all()** for parallel fetching
- ✅ **Cache to `.cache/` directory** (gitignored)
- ✅ **Log cache hits/misses** for debugging
- ✅ **Set reasonable cache TTL** (5-10 minutes for development)
- ✅ **Leverage Astro Content Layer** (v5.0+) for automatic caching

**Avoid**:
- ⚠️ **DON'T fetch in client-side scripts** unless necessary (doubles requests)
- ⚠️ **DON'T re-fetch same data** multiple times per build
- ⚠️ **DON'T commit cached data** to git (add to .gitignore)
- ⚠️ **DON'T ignore errors silently** without logging
- ⚠️ **DON'T use SSR** for infrequently changing data (kills performance)

---

## Summary: Key Takeaways for Wiki Alignment Update

### 1. @gitbeaker/rest
- Use Personal Access Token authentication with `api` scope
- Implement exponential backoff with retry logic for 429 and 5xx errors
- Respect `Retry-After` header on rate limit responses
- Set `maxRetries: 3-5` to prevent infinite loops
- Proactively monitor rate limit headers (RateLimit-Remaining ≤ 5)

### 2. remark + unified
- Use `remark-gfm` for GitHub Flavored Markdown table parsing
- Leverage `unist-util-visit` for AST traversal with type safety
- Extract table data by visiting `'table'` nodes and iterating rows/cells
- Handle nested formatting (emphasis, strong, code, links) in cells
- Use SKIP/EXIT for efficient traversal

### 3. microdiff + string-similarity
- Use `microdiff` for structural object comparison (CREATE/REMOVE/CHANGE)
- Compare tokens by unique keys (e.g., name) for better change tracking
- Use `string-similarity` (Dice coefficient) for fuzzy name matching
- Set threshold ≥ 0.90 for automatic matching, 0.80-0.89 requires review
- Normalize text (lowercase, collapse whitespace) before comparison

### 4. style-dictionary v4.x
- Use JavaScript config for flexibility (custom transforms/formats)
- Adopt DTCG spec ($type, $value) for forward compatibility
- Configure multi-platform output (CSS, SCSS, Tailwind, TypeScript)
- Enable `outputReferences: true` to preserve token relationships
- Filter tokens per output file to reduce bloat

### 5. Astro Build-Time Fetching
- Use top-level `await` in component scripts for build-time data fetching
- Implement file-based caching (`.cache/` directory) for CI/CD
- Add build script pre-fetch: `"build": "npm run fetch-wiki && astro build"`
- Validate fetched data with Zod schemas
- Handle errors gracefully with fallbacks or fail-fast patterns
- Use `Promise.all()` for parallel API requests

---

**Next Steps**: Apply these best practices in Steps.md implementation (S001-S035)

**Questions to Address**:
1. Cache strategy: In-memory vs file-based? (Recommendation: file-based for CI/CD)
2. Error handling: Fail-fast vs graceful degradation? (Recommendation: fail-fast in CI, graceful in dev)
3. Token matching: Manual review threshold? (Recommendation: 0.80-0.89 requires review)
4. Style Dictionary: CSS variables vs Tailwind config? (Recommendation: both)

**References**:
- GitBeaker: https://github.com/jdalrymple/gitbeaker
- Remark: https://github.com/remarkjs/remark
- Style Dictionary: https://styledictionary.com/
- Astro Data Fetching: https://docs.astro.build/en/guides/data-fetching/
