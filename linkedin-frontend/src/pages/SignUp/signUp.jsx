import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleLogin from '../../components/GoogleLogin/googleLogin'
import { apiRequest } from '../../utils/api'
import { useAuth } from '../../context/useAuth'

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: { name, email, password },
        authenticate: false
      });
      login({ user: data.user, token: data.token });
      navigate('/posts');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className="text-4xl mb-5">Make the most of your professional life</div>
      <form className="w-[85%] md:w-[28%] shadow-xl rounded-sm box p-10" onSubmit={handleRegister}>
        <div className='flex flex-col gap-4'>

          <div>
            <label htmlFor="fullname">Full Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} type="text" id="fullname" className="w-full text-xl border-2 rounded-lg px-5 py-1" placeholder="Full Name" required />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" id="email" className="w-full text-xl border-2 rounded-lg px-5 py-1" placeholder="Email" required />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" id="password" className="w-full text-xl border-2 rounded-lg px-5 py-1" placeholder="Password" required />
          </div>

          {!!error && <div className="text-red-600 text-sm">{error}</div>}

          <button disabled={submitting} className="w-full bg-blue-600 text-white rounded-full py-2 text-xl mt-4 hover:bg-blue-700 disabled:opacity-60">
            {submitting ? 'Registering...' : 'Register'}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div><span className="mx-4 text-gray-500">or</span><div className="flex-grow border-t border-gray-300"></div>
          </div>

          <GoogleLogin />

        </div>
        
      </form>
      <div className="mt-4 mb-10">Already on LinkedIn? <Link to="/login" className="text-blue-800 cursor-pointer">Sign in</Link></div>
    </div>
  )
}

export default SignUp