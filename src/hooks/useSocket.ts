import { SocketConnection } from '@/services/socket.service'

const socket = new SocketConnection()

export function useSocket() {
  return { socket }
}
