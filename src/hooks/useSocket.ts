import { SocketConnection } from '@/services/socket.service'
import { useCallback } from 'react'
import { useEffect } from 'react'

const socket = new SocketConnection()

export function useSocket() {
  const connect = useCallback((): Promise<unknown> | undefined => {
    if (socket.io.readyState !== WebSocket.OPEN) {
      return socket.connect()
    }
  }, [])

  useEffect(() => {
    if (socket.io.readyState === WebSocket.CLOSED) {
      connect()
    }
  }, [connect])

  return { socket, connect }
}
