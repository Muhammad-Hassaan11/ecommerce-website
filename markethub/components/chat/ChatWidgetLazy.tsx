'use client'

import dynamic from 'next/dynamic'

// The chat widget is below-the-fold, interaction-only UI — load it after
// hydration instead of shipping it in the initial bundle.
const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false })

export default function ChatWidgetLazy() {
  return <ChatWidget />
}
