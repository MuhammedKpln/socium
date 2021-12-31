import { INotification, NotificationType } from '@/Types/notification.type'

export class NotificationHelper {
  public notificationText: string = ''

  constructor(notification: INotification) {
    if (notification.notificationType === NotificationType.Follow) {
      this.notificationText = '{0} adlı kullanıcı sizi takip etmeye başladı.'
    }
    if (notification.notificationType === NotificationType.PostComment) {
      this.notificationText = '{0} adlı kullanıcı gönderinize yorum yaptı.'
    }
  }

  public renderText(user: string, actor: string) {
    const text = this.notificationText.replace('{0}', actor)

    if (this.notificationText.includes('{1}')) {
      text.replace('{1}', user)
    }

    return text
  }
}
