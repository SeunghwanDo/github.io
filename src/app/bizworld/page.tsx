'use client'

import { WorldProvider } from '@/stores/worldStore'
import TownMap from '@/components/world/TownMap'

export default function BizWorldPage() {
  return (
    <WorldProvider>
      <TownMap />
    </WorldProvider>
  )
}
