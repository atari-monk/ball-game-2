import { CounterEvent } from 'shared-api'

export class CounterDto {
  event: CounterEvent
  second: number
  message: string

  constructor(event: CounterEvent, second: number, message: string = '') {
    this.event = event
    this.second = second
    this.message = message
  }
}
