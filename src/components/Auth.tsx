import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else if (mode === 'signup') {
      setDone(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="text-2xl font-semibold tracking-tight mb-1">
            one<span className="text-accent">in</span>oneout
          </div>
          <div className="text-sm text-muted">Your family's shared space</div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-7 shadow-sm">
          {done ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-3">📬</div>
              <div className="font-medium mb-1">Check your email</div>
              <div className="text-sm text-muted">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.</div>
              <button
                onClick={() => { setDone(false); setMode('signin') }}
                className="mt-5 text-[13px] text-accent hover:underline"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold mb-5">
                {mode === 'signin' ? 'Sign in' : 'Create family account'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-[13px] bg-bg focus:outline-none focus:border-accent focus:bg-white transition-colors"
                  />
                </div>

                {error && (
                  <div className="text-[12px] text-warn bg-warn-lt border border-warn/20 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-white py-2.5 rounded-lg text-[13px] font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError('') }}
                  className="text-[12px] text-muted hover:text-accent transition-colors"
                >
                  {mode === 'signin'
                    ? 'First time? Create your family account'
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </>
          )}
        </div>

        {mode === 'signin' && !done && (
          <p className="text-center text-[11px] text-muted mt-4">
            Share the same email & password with your partner so you both see the same data.
          </p>
        )}
      </div>
    </div>
  )
}
