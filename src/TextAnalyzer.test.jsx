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

  it('handles punctuation without creating extra tokens', () => {
    const s = analyze("Hello, world! This is great... Right?")
    // tokens: hello, world, this, is, great, right
    expect(s.wordCount).toBe(6)
    expect(s.sentenceCount).toBeGreaterThanOrEqual(2)
    expect(s.mostFrequentWord).toBe('hello' || 'world')
  })

  it('ignores numeric-only tokens when determining most frequent word', () => {
    const s = analyze('123 123 test test test')
    expect(s.wordCount).toBe(5)
    expect(s.mostFrequentWord).toBe('test')
  })

  it('handles large input quickly (basic performance smoke test)', () => {
    const big = Array.from({length:5000}, () => 'hey').join(' ')
    const s = analyze(big)
    expect(s.wordCount).toBe(5000)
    expect(s.longestWord).toBe('hey')
  })
})
