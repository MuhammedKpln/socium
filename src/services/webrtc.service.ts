import {
  mediaDevices,
  MediaStream,
  MediaStreamConstraints,
  RTCPeerConnection,
  RTCPeerConnectionConfiguration,
  RTCSessionDescriptionType,
} from 'react-native-webrtc'

export class PeerConnection {
  peerConnection: RTCPeerConnection
  localStream: MediaStream | null = null
  private config: RTCPeerConnectionConfiguration = {
    iceServers: [{ url: 'stun:stun.l.google.com:19302' }],
  }

  constructor() {
    this.peerConnection = new RTCPeerConnection(this.config)
  }

  async getUserMedia(options: MediaStreamConstraints) {
    this.localStream = await mediaDevices.getUserMedia(options)

    return this.localStream
  }

  addStream(stream: MediaStream) {
    return this.peerConnection.addStream(stream)
  }

  async createOffer(): Promise<RTCSessionDescriptionType> {
    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)

    return offer
  }

  async createAnswer(
    offer: RTCSessionDescriptionType,
  ): Promise<RTCSessionDescriptionType> {
    await this.peerConnection.setRemoteDescription(offer)
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)

    return answer
  }

  async setRemoteDescription(answer: RTCSessionDescriptionType) {
    await this.peerConnection.setRemoteDescription(answer)
  }

  close() {
    this.peerConnection.close()
    this.peerConnection = new RTCPeerConnection(this.config)
  }
}
