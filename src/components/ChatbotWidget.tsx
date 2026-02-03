'use client'

import { useState, useRef, useEffect } from 'react'
import {
  MessageCircle, X, Send, Bot, User, Sparkles, Trash2,
  Plus, ChevronLeft, Loader2
} from 'lucide-react'
import { useChatbot } from '@/hooks/useChatbot'

export default function ChatbotWidget() {
  const {
    sessions,
    currentSession,
    isTyping,
    isOpen,
    setIsOpen,
    sendMessage,
    startNewSession,
    selectSession,
    deleteSession,
    getSuggestedQuestions,
  } = useChatbot()

  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession?.messages, isTyping])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    const message = input
    setInput('')
    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickQuestion = async (question: string) => {
    await sendMessage(question)
  }

  const suggestedQuestions = getSuggestedQuestions()

  return (
    <>
      {/* 플로팅 버튼 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-full shadow-lg shadow-fuchsia-500/30 flex items-center justify-center hover:scale-110 transition-transform group"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-12 right-0 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI 상담사에게 물어보세요!
          </span>
        </button>
      )}

      {/* 채팅 위젯 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showHistory ? (
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white">
                  {showHistory ? '대화 기록' : 'AI 상담사'}
                </h3>
                {!showHistory && (
                  <p className="text-white/70 text-xs">무엇이든 물어보세요</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!showHistory && (
                <>
                  <button
                    onClick={() => setShowHistory(true)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="대화 기록"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={startNewSession}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="새 대화"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 대화 기록 */}
          {showHistory ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">대화 기록이 없습니다</p>
                </div>
              ) : (
                sessions.map(session => (
                  <div
                    key={session.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      currentSession?.id === session.id
                        ? 'bg-fuchsia-500/20 border border-fuchsia-500/50'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    onClick={() => {
                      selectSession(session.id)
                      setShowHistory(false)
                    }}
                  >
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{session.title}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(session.updatedAt).toLocaleDateString()} · {session.messages.length}개 메시지
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(session.id)
                      }}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              {/* 메시지 영역 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!currentSession || currentSession.messages.length === 0 ? (
                  // 초기 화면
                  <div className="space-y-6">
                    <div className="text-center pt-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">안녕하세요!</h3>
                      <p className="text-slate-400 text-sm">무엇을 도와드릴까요?</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 px-1">자주 묻는 질문</p>
                      {suggestedQuestions.map((question, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickQuestion(question)}
                          className="w-full text-left px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-slate-300 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // 메시지 목록
                  <>
                    {currentSession.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        {/* 아바타 */}
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                          message.role === 'user'
                            ? 'bg-slate-700'
                            : 'bg-gradient-to-r from-fuchsia-500 to-purple-500'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-slate-300" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {/* 메시지 버블 */}
                        <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                          <div className={`px-4 py-3 rounded-2xl text-sm ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-tr-sm'
                              : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                          }`}>
                            <div className="whitespace-pre-wrap">
                              {message.content.split('\n').map((line, i) => {
                                // 마크다운 볼드 처리
                                const parts = line.split(/\*\*(.*?)\*\*/g)
                                return (
                                  <span key={i}>
                                    {parts.map((part, j) =>
                                      j % 2 === 1 ? (
                                        <strong key={j} className="font-semibold">{part}</strong>
                                      ) : part
                                    )}
                                    {i < message.content.split('\n').length - 1 && <br />}
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                          <p className={`text-xs text-slate-500 mt-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* 타이핑 인디케이터 */}
                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-fuchsia-500 to-purple-500">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="px-4 py-3 bg-slate-800 rounded-2xl rounded-tl-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* 입력 영역 */}
              <div className="p-4 border-t border-slate-800">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="메시지를 입력하세요..."
                      rows={1}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 resize-none max-h-32"
                      style={{ minHeight: '48px' }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={`p-3 rounded-xl transition-all ${
                      input.trim() && !isTyping
                        ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:shadow-lg hover:shadow-fuchsia-500/25'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isTyping ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  AI 상담사는 일반적인 안내를 제공합니다
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
