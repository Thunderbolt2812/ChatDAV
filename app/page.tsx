'use client'

import { useState, useEffect } from 'react'
import { useChat } from 'ai/react'
import SignIn from './SignIn'
import SignUp from './SignUp'

export default function Chat() {
  const [view, setView] = useState<'signin' | 'signup' | 'chat'>('signin')
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setView('chat')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setView('signin')
  }

  if (view === 'signin') {
    return (
      <SignIn 
        onSignInSuccess={() => setView('chat')}
        onGotoSignUp={() => setView('signup')} 
      />
    )
  }

  if (view === 'signup') {
    return (
      <SignUp 
        onSignUpSuccess={() => setView('chat')}
        onGotoSignIn={() => setView('signin')} 
      />
    )
  }

  // If we are here, the view is 'chat', user is authenticated
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-opacity-80 backdrop-blur-lg">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white truncate flex items-center">
            Chat
          </h2>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-4 rounded-lg ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-right w-40 lg:w-2/5'
                    : 'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-200 via-violet-600 to-sky-900 text-left w-40 lg:w-2/5'
                }`}
              >
                <div className="rounded-lg">
                  <span className="font-medium">{m.role === 'user' ? 'You' : 'AI'}</span>: {m.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Input */}
      <form onSubmit={handleSubmit} className="flex items-center px-4 py-3 bg-gray-800">
        <input
          className="flex-1 px-4 py-2 text-white bg-gray-700 bg-opacity-60 border rounded-full placeholder-white::placeholder focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          type="text"
          placeholder="Say something..."
          value={input}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="ml-4 p-2 text-blue-400 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}
