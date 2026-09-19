export type SummarySection = {
  title: string
  paragraphs: string[]
  bullets?: string[]
  code?: string
}

export type SummaryResult = {
  title: string
  source: string
  sourceType: 'url' | 'text'
  oneLiner: string
  readingTime: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  concepts: string[]
  sections: SummarySection[]
  quickStart?: string
  caveats?: string[]
  generatedAt: string
}

export type SummarizeRequest =
  | { type: 'url'; value: string }
  | { type: 'text'; value: string }

export type Mode = 'url' | 'text'
