'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ChatBubbleLeftRightIcon, UserCircleIcon, PaperAirplaneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface Feedback {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState(''); // 机器人陷阱
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  async function fetchFeedbacks() {
    const { data } = await supabase
      .from('site_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50); // 限制显示数量，防止渲染过大
    
    if (data) setFeedbacks(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. 机器人检查 (Honeypot)
    if (honeypot) return;

    // 2. 基础验证
    if (!comment.trim() || comment.length < 5) {
      alert('Message is too short (min 5 chars).');
      return;
    }
    if (comment.length > 500) {
      alert('Message is too long (max 500 chars).');
      return;
    }

    // 3. 频率限制 (前端初步拦截)
    if (cooldown > 0) return;

    setIsSubmitting(true);
    const { error } = await supabase.from('site_feedback').insert([
      {
        user_name: name.trim().slice(0, 30) || 'Anonymous Explorer',
        content: comment.trim().slice(0, 500),
      }
    ]);

    if (!error) {
      setName('');
      setComment('');
      setCooldown(30); // 提交成功后冷却30秒
      fetchFeedbacks();
    } else {
      alert('Submission failed. Please try again later.');
    }
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[#0F1219] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight flex items-center justify-center gap-3">
            COMMUNITY <span className="text-blue-500">VOICE</span>
            <ShieldCheckIcon className="w-8 h-8 text-green-500/50" title="Secured by Supabase" />
          </h1>
          <p className="text-gray-400">Your feedback helps us evolve the future of GameVerse.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                Post Message
              </h2>
              
              <div className="space-y-4">
                {/* Honeypot Field - Hidden from Users */}
                <div className="hidden" aria-hidden="true">
                  <input value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={30}
                    placeholder="Optional"
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl py-2 px-4 text-sm focus:border-blue-500/50 outline-none transition-all text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Message ({comment.length}/500)</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Share your feedback..."
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl py-2 px-4 text-sm focus:border-blue-500/50 outline-none transition-all resize-none text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cooldown > 0}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Post Message'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
             {/* 留言列表同上... (保持之前代码逻辑) */}
             {feedbacks.map((item) => (
                <div key={item.id} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 hover:border-blue-900/30 transition-all">
                   <div className="flex items-start gap-4">
                      <UserCircleIcon className="w-10 h-10 text-gray-600" />
                      <div className="flex-1">
                         <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-400 text-sm">{item.user_name}</span>
                            <span className="text-[10px] text-gray-600">{new Date(item.created_at).toLocaleDateString()}</span>
                         </div>
                         <p className="text-gray-300 text-sm mt-1 leading-relaxed">{item.content}</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
