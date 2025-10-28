import { describe, it, expect } from 'vitest'
import { analyze } from './TextAnalyzer.jsx'

describe('analyze()', () => {
  it('handles empty input', () => {
    const s = analyze('')
    expect(s.wordCount).toBe(0)
    expect(s.paragraphCount).toBe(0)
    expect(s.sentenceCount).toBe(0)
    expect(s.mostFrequentWord).toBe('—')
    expect(s.longestWord).toBe('—')
  })

  it('counts words and sentences', () => {
    const s = analyze('Hello world! Hello?')
    expect(s.wordCount).toBe(3)
    expect(s.sentenceCount).toBe(2)
    expect(s.mostFrequentWord).toBe('hello')
  })

  it('paragraphs split by blank line', () => {
    const s = analyze('One line.\n\nSecond para.')
    expect(s.paragraphCount).toBe(2)
  })
})
