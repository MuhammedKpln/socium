import {
  RTCPeerConnection,
  RTCPeerConnectionConfiguration,
  RTCSessionDescription,
  RTCSessionDescriptionType,
  mediaDevices,
  MediaStream,
  MediaStreamConstraints,
} from 'react-native-webrtc'

export class PeerConnection {
  peerConnection: RTCPeerConnection
  private config: RTCPeerConnectionConfiguration = {
    iceServers: [{ url: 'stun:stun.l.google.com:19302' }],
  }

  constructor() {
    this.peerConnection = new RTCPeerConnection(this.config)
  }

  async getUserMedia(options: MediaStreamConstraints) {
    return await mediaDevices.getUserMedia(options)
  }

  addStream(stream: MediaStream) {
    return this.peerConnection.addStream(stream)
  }

  async createOffer(): Promise<RTCSessionDescriptionType> {
    const offer = await this.peerConnection.createOffer()
    this.peerConnection.setLocalDescription(new RTCSessionDescription(offer))

    return offer
  }

  async createAnswer(
    offer: RTCSessionDescriptionType,
  ): Promise<RTCSessionDescriptionType> {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer),
    )
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(
      new RTCSessionDescription(answer),
    )

    return answer
  }

  async setRemoteDescription(answer: RTCSessionDescriptionType) {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer),
    )
  }
}
