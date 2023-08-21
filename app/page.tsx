'use client'

import React from 'react'
import { useWallpaper } from '@/hooks/use-wallpaper'
import { DownloadCloud, RefreshCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'

const RootPage = () => {
  const $canvas = React.useRef<HTMLCanvasElement>(null)

  const { generateWallpaper, url } = useWallpaper($canvas)

  React.useEffect(() => {
    generateWallpaper()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.download = 'wallpaper.png'

    if ($canvas.current) {
      link.href = $canvas.current.toDataURL('image/png')
      link.click()
    }

    link.remove()
  }

  return (
    <>
      <canvas
        ref={$canvas}
        className="h-full max-h-screen w-full"
        width={3840}
        height={2160}
      />

      <div className="absolute inset-x-4 bottom-4">
        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleDownload}>
            <DownloadCloud size={15} />
          </Button>

          <Button onClick={generateWallpaper}>
            <RefreshCcw size={15} />
          </Button>
        </div>
      </div>
    </>
  )
}

export default RootPage
