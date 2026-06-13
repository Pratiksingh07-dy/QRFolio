import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react'

const quickPrompts = [
  "What are my Python skills?",
  "Show my machine learning projects",
  "Summarize my work experience",
  "Am I a good fit for backend roles?",
  "What certifications do I have?"
]

export default function ChatPage() {

  const { user } = useAuth()

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your AI portfolio assistant. I know everything about ${user?.name || 'you'}. Ask me anything about skills, projects, experience, education, or fit for specific roles!`
    }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEnd = useRef(null)

  useEffect(() => {

    messagesEnd.current?.scrollIntoView({
      behavior: 'smooth'
    })

  }, [messages])


  const sendMessage = async (text = input) => {

  if (!text.trim() || loading) return

  const userMsg = {
    role: 'user',
    content: text
  }

  setMessages(prev => [...prev, userMsg])

  setInput('')
  setLoading(true)

  try {

    console.log("Sending request...")

    const { data } = await api.post('/api/chat/', {
      message: text,
      history: messages,
      portfolio_username: user.username
    })

    console.log("Response:", data)

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: data.reply
      }
    ])

  } catch (err) {

    console.log("ERROR:", err)

    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: "I'm having trouble connecting right now."
      }
    ])

  } finally {

    setLoading(false)

  }
}


  return (
    <div className="min-h-screen bg-dark-500 flex flex-col">

      <Navbar />

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-8">

        <div className="mb-6">
          <h1 className="section-title flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-400" />
            AI Portfolio Assistant
          </h1>

          <p className="section-sub">
            AI-Powered Portfolio Assistant • Ask anything about your portfolio
          </p>

        </div>

        <div className="flex-1 card p-4 overflow-y-auto mb-4 space-y-4">

          {messages.map((msg, i) => (

            <div
              key={i}
              className={`flex gap-3 ${
                msg.role === 'user'
                  ? 'flex-row-reverse'
                  : ''
              }`}
            >

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${
                  msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-primary-500 to-teal-400'
                  : 'bg-dark-300 border border-white/14'
                }`}
              >

                {msg.role === 'assistant'
                  ? <Bot size={16} className="text-white"/>
                  : <UserIcon size={16}/>
                }

              </div>

              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                ${
                  msg.role === 'assistant'
                  ? 'bg-dark-300 border border-white/8 rounded-tl-sm'
                  : 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white rounded-tr-sm'
                }`}
              >

                {msg.content}

              </div>

            </div>

          ))}

          {loading && (

            <div className="flex gap-3">

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-teal-400 flex items-center justify-center">
                <Bot size={16} className="text-white"/>
              </div>

              <div className="bg-dark-300 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">

                <div className="flex gap-1">

                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>

                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>

                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>

                </div>

              </div>

            </div>

          )}

          <div ref={messagesEnd} />

        </div>

        <div className="flex flex-wrap gap-2 mb-3">

          {quickPrompts.map(prompt => (

            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-dark-300 border border-white/8 text-gray-300 hover:text-white"
            >

              {prompt}

            </button>

          ))}

        </div>

        <div className="flex gap-2">

          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=>e.key==="Enter" && sendMessage()}
            placeholder="Ask about skills, projects, experience..."
            className="input flex-1"
            disabled={loading}
          />

          <button
            onClick={()=>sendMessage()}
            disabled={loading || !input.trim()}
            className="btn-primary"
          >

            <Send size={15}/>

          </button>

        </div>

      </main>

    </div>
  )
}