export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export function showNotification(options: NotificationOptions): boolean {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted')
    return false
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/icon.png',
      badge: options.badge || '/favicon-16x16.png',
      tag: options.tag || 'scanweb-notification',
      requireInteraction: true,
    })

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close()
    }, 10000)

    // Handle click on notification
    notification.onclick = () => {
      notification.close()
      window.focus()
    }

    return true
  } catch (error) {
    console.error('Error showing notification:', error)
    return false
  }
}

export function showScanCompleteNotification(scanUrl: string, vulnerabilityCount: number): boolean {
  const title = 'ScanWeb Scan Complete!'
  const body = vulnerabilityCount > 0 
    ? `Found ${vulnerabilityCount} ${vulnerabilityCount === 1 ? 'vulnerability' : 'vulnerabilities'} - View results now`
    : 'No vulnerabilities found - Your site looks secure!'
  
  return showNotification({
    title,
    body,
    icon: '/icon.png',
    tag: 'scan-complete',
  })
}

export async function setupScanNotifications(): Promise<boolean> {
  const hasPermission = await requestNotificationPermission()
  
  if (hasPermission) {
    console.log('✅ Notifications enabled for scan completion alerts')
  } else {
    console.log('❌ Notifications denied or not supported')
  }
  
  return hasPermission
}
