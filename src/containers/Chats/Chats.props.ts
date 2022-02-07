export interface IActionSheet {
  visible: boolean
  message: string
  title: string
  onAccept: () => void
  onReject: () => void
}
