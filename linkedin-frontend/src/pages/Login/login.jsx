import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GoogleLogin from '../../components/GoogleLogin/googleLogin'
import { apiRequest } from '../../utils/api'
import { useAuth } from '../../context/useAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const onSubmit = async () => {
    try {
      setLoading(true); setError('')
      const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } })
      login({ user: data.user, token: data.token })
      window.location.href = '/posts'
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className="text-4xl mb-5">Welcome Back</div>
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-sm box p-10">
        <div className='flex flex-col gap-4'>
          <div>
            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" id="email" className="w-full text-xl border-2 rounded-lg px-5 py-1" placeholder="Email" />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" id="password" className="w-full text-xl border-2 rounded-lg px-5 py-1" placeholder="Password" />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button onClick={onSubmit} disabled={loading} className="w-full bg-blue-600 text-white rounded-full py-2 text-xl mt-4 hover:bg-blue-700 disabled:opacity-50">{loading ? 'Signing in...' : 'Sign in'}</button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div><span className="mx-4 text-gray-500">or</span><div className="flex-grow border-t border-gray-300"></div>
          </div>

          <GoogleLogin />

        </div>
      </div>
      <div className="mt-4 mb-10">New to LinkedIn? <Link to="/signUp" className="text-blue-800 cursor-pointer">Join now</Link></div>
    </div>
  )
}

export default Login