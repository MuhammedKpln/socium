import socketService from '@/services/socket.service'
import { useMemo } from 'react'

export function useSocket() {
  const socket = useMemo(() => {
    return socketService
  }, [])

  return socket
}
