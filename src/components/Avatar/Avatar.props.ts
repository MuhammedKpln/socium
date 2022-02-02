import { IBadgeProps } from '../Badge/Badge.props'

export interface IAvatarProps {
  userAvatar: string
  size?: number
  showBadge?: boolean
  badgeProps?: IBadgeProps
  onPress?: () => void
}
