import { PeerConnection } from '@/services/webrtc.service'
import { useEffect } from 'react'
import { useMemo } from 'react'

export function useWebrtc() {
  const peerConnection = useMemo(() => {
    return new PeerConnection()
  }, [])

  useEffect(() => {
    peerConnection.peerConnection.onconnectionstatechange = e => {
      console.log('connection state changed', e)
    }
  }, [peerConnection])

  return peerConnection
}
