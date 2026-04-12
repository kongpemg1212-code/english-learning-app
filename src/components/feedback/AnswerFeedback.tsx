type AnswerFeedbackState = 'correct' | 'wrong-soft' | 'combo' | 'complete'

type AnswerFeedbackProps = {
  state: AnswerFeedbackState
  message: string
}

const stateStyles: Record<AnswerFeedbackState, React.CSSProperties> = {
  correct: {
    background: 'rgba(81, 207, 102, 0.16)',
    color: '#206335',
  },
  'wrong-soft': {
    background: 'rgba(255, 179, 71, 0.2)',
    color: '#7c4a08',
  },
  combo: {
    background: 'rgba(255, 230, 109, 0.28)',
    color: '#6e5a00',
  },
  complete: {
    background: 'linear-gradient(135deg, rgba(255,107,107,0.18), rgba(78,205,196,0.18))',
    color: '#4b3940',
  },
}

export function AnswerFeedback({ state, message }: AnswerFeedbackProps) {
  return (
    <div
      role="status"
      className="animate-float-up"
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: 'var(--radius-pill)',
        fontWeight: 800,
        textAlign: 'center',
        ...stateStyles[state],
      }}
    >
      {message}
    </div>
  )
}
