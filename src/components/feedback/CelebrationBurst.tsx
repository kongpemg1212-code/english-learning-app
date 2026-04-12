type CelebrationBurstProps = {
  active: boolean
}

export function CelebrationBurst({ active }: CelebrationBurstProps) {
  if (!active) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className="animate-pop"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(circle at 20% 20%, rgba(255,230,109,0.42), transparent 18%), radial-gradient(circle at 80% 25%, rgba(78,205,196,0.36), transparent 16%), radial-gradient(circle at 50% 75%, rgba(255,107,107,0.3), transparent 20%)',
      }}
    />
  )
}
