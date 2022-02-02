import { SocketConnection } from '@/services/socket.service'
import { useEffect } from 'react'
import { useMemo } from 'react'

export function useSocket() {
  const socket = useMemo(() => {
    return new SocketConnection()
  }, [])

  useEffect(() => {
    if (
      socket.io.readyState === WebSocket.CLOSED ||
      socket.io.readyState === WebSocket.CLOSING
    ) {
      socket.connect()
    }

    return () => {
      socket.removeListeners()
      socket.close()
    }
  }, [socket])

  return socket
}
