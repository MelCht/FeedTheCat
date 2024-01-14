import { Component, OnDestroy } from '@angular/core'
import { TimerService } from '../services/timer.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnDestroy {
  isTimerRunning = false
  remainingTime: number = 0
  private timerSubscription: Subscription

  constructor (private timerService: TimerService) {
    this.timerSubscription = this.timerService.remainingTime$.subscribe(
      time => {
        this.remainingTime = time
      }
    )
  }

  startTimer () {
    this.timerService.startTimer()
    this.isTimerRunning = true
  }

  stopTimer () {
    this.timerService.stopTimer()
    this.isTimerRunning = false
  }

  ngOnDestroy () {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
  }
}
