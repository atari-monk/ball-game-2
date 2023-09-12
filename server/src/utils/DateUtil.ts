export class DateUtil {
  static formatDateTime(date: Date): string {
    const fdate = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }

    return fdate.toLocaleString('pl-PL', options)
  }

  static formatTime(date: number): string {
    const fdate = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }

    return fdate.toLocaleString('pl-PL', options)
  }
}
