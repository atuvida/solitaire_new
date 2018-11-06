import { trigger, style, transition, animate, keyframes, query, stagger, state } from '@angular/animations';

export let wasteAnimation = 
trigger('wasteFlip',[
  transition('*=>*', [
    query(':enter', style({opacity: 0}), {optional: true}),
    query(':enter', stagger('50ms', [
      animate('.4s ease-in', keyframes([
        style({opacity: 0.4, transform: 'translateX(150%)', offset: 0.20}),
        style({opacity: 1, transform: 'translateY(-50%)', offset: 0.30}),
        style({opacity: 1, transform: 'rotateY(180deg)', offset: 0.40}),
        style({opacity: 1, transform: 'translateX(0)', offset: 1 })

      ]))
    ]), {optional: true})
  ])
])

export let talonAnimation = 
trigger('talonFlip',[
  transition('*=>*', [
    query(':enter', style({opacity: 0}), {optional: true}),
    query(':enter', stagger('50ms', [
      animate('.3s ease-in', keyframes([
        style({opacity: 1, transform: 'translateX(-230%)', offset: 0.20}),
        style({opacity: 1, transform: 'translateY(-50%)', offset: 0.30}),
        style({opacity: 1, transform: 'rotateY(180deg)', offset: 0.40}),
        style({opacity: 1, transform: 'translateX(0%)', offset: 0.70 })

      ]))
    ]), {optional: true})
  ])
])


export let foundationAnim = 
trigger('foundationFlip',[
  transition('*=>*', [
    query(':enter', style({opacity: 0, zIndex: 1000}), {optional: true}),
    query(':enter', stagger('70ms', [
      animate('.6s ease-in', keyframes([
        style({opacity: 0, transform: 'translateX(150%)', offset: 0.20}),
        style({opacity: 1, transform: 'translateY(100%)', offset: 0.30}),
        style({opacity: 1, transform: 'rotateY(180deg)', offset: 0.40}),
        style({opacity: 1, transform: 'translateX(0)', offset: 1 })

      ]))
    ]), {optional: true}),
    query(':leave', style({opacity: 1, zIndex: 1000}), {optional: true}),
    query(':leave', stagger('30ms', [
      animate('.3s ease-in', keyframes([
        style({opacity: 1, transform: 'rotateY(180deg)', offset: 0.0}),
        style({opacity: 1, transform: 'translateX(-50%)', offset: 0.30}),
        style({opacity: 1, transform: 'translateY(50%)', offset: 0.40}),
        style({opacity: 1, transform: 'translateX(50%)', offset: 0.50}),
        style({opacity: 1, transform: 'translateY(100%)', offset: 0.80}),
        style({opacity: 0, transform: 'translateX(400%)', offset: 1 })

      ]))
    ]), {optional: true})
  ])
])

export let maneuverAnimation = 
trigger('maneuverFlip',[
  transition('*=>*', [
    query(':enter', style({opacity: 0}), {optional: true}),
    query(':enter', stagger('50ms', [
      animate('.3s ease-in', keyframes([
        style({opacity: 0, transform: 'rotateY(90deg)', offset: 0.30}),
        style({opacity: 1, transform: 'rotateY(90deg)', offset: 0.60}),
        style({opacity: 1, transform: 'rotateY(180deg)', offset: 1})
      ]))
    ]), {optional: true})
  ])
])

export let menuAnimation = 
trigger('menuSlide',[
  state('void', style({opacity: 0})),

  transition(':leave',[
    animate(1000)
  ])
])