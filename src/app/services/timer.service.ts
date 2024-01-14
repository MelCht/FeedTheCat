import { Injectable } from '@angular/core'
import { BehaviorSubject, interval, Subscription } from 'rxjs'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private startTime: Date = new Date(0)
  private subscription: Subscription = undefined!
  private remainingTimeSubject = new BehaviorSubject<number>(0)
  remainingTime$ = this.remainingTimeSubject.asObservable()
  remainingTime: number = 0 // Ajoutez cette ligne

  constructor (private localNotifications: LocalNotifications) {}

  startTimer () {
    const currentTime = new Date()
    const targetTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      21,
      0,
      0
    )

    // Si currentTime est déjà après 21h, ajuster pour le prochain jour
    if (currentTime.getTime() > targetTime.getTime()) {
      targetTime.setDate(targetTime.getDate() + 1)
    }

    // Calculer le temps jusqu'à 21h00
    const timeUntil21h = targetTime.getTime() - currentTime.getTime()

    // Calculer le temps jusqu'au prochain intervalle
    const intervalDuration = timeUntil21h / 15 // Diviser le temps jusqu'à 21h par le nombre d'intervalles

    // Ajuster startTime pour refléter le début de l'intervalle actuel
    this.startTime = new Date(targetTime.getTime() - timeUntil21h)

    // Ajuster remainingTime pour refléter correctement le temps restant jusqu'au prochain intervalle
    this.remainingTime =
      intervalDuration -
      ((currentTime.getTime() - this.startTime.getTime()) % intervalDuration)

    // Ajuster remainingTime pour qu'il ne dépasse pas la durée totale
    this.remainingTime = Math.min(this.remainingTime, intervalDuration)

    this.remainingTimeSubject.next(this.remainingTime)

    this.subscription = interval(1000).subscribe(() => {
      this.checkTime()
    })
  }

  stopTimer () {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe()
    }

    // Réinitialisez les valeurs au besoin (à adapter selon votre logique)
    this.startTime = new Date(0)
    this.remainingTime = 0
    this.remainingTimeSubject.next(this.remainingTime)
  }

  checkTime () {
    this.remainingTime -= 1000

    if (this.remainingTime <= 0) {
      this.subscription.unsubscribe()
      console.log('Minuteur terminé !')
      return
    }

    const currentTime = new Date()
    const targetTime = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      21,
      0,
      0
    )

    // Si currentTime est déjà après 21h, ajuster pour le prochain jour
    if (currentTime.getTime() > targetTime.getTime()) {
      targetTime.setDate(targetTime.getDate() + 1)
    }

    // Calculer le temps jusqu'à 21h00
    const timeUntil21h = targetTime.getTime() - currentTime.getTime()

    // Calculer le temps jusqu'au prochain intervalle
    const intervalDuration = timeUntil21h / 15 // Diviser le temps jusqu'à 21h par le nombre d'intervalles

    // Si vous voulez une approximation en minutes, vous pouvez utiliser Math.floor
    const intervalDurationMinutes = Math.floor(intervalDuration / (60 * 1000))

    // Calculer le nombre d'itérations passées
    const passedSections = Math.floor(
      (currentTime.getTime() - this.startTime.getTime()) / intervalDuration
    )

    this.remainingTime =
      intervalDuration -
      ((currentTime.getTime() - this.startTime.getTime()) % intervalDuration)
    this.startTime = currentTime

    console.log(`Temps restant : ${this.remainingTime / (60 * 1000)} minutes`)
    console.log(`Sections passées : ${passedSections}`)
    console.log(
      `Prochaine section dans : ${this.remainingTime / 1000} secondes`
    )
    console.log(`Minutes dans l'intervalle actuel : ${intervalDurationMinutes}`)
    console.log(`Intervalle actuel : ${passedSections + 1} sur 15`)

    // Ajoutez ici la logique pour les notifications push
    // Utilisez this.localNotifications pour envoyer une notification

    // Mettez à jour le BehaviorSubject avec la nouvelle valeur
    this.remainingTimeSubject.next(this.remainingTime)
  }
}
