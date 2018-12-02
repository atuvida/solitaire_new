import { trigger, style, transition, animate, keyframes, query, stagger, state } from '@angular/animations';

export let wasteAnimation = 
trigger('wasteFlip',[
  transition('*=>*', [
    query(':enter', stagger('50ms', [
      animate('0.9s ease-in', keyframes([
        style({opacity: 0, zIndex: 2000, offset: 0.0}),
        style({opacity: 0, transform: 'translateX(80%)', offset: 0.20}),
        style({opacity: 0, transform: 'translateY(-50%)', offset: 0.30}),
        style({opacity: 1, transform: 'rotateY(180deg)', offset: 0.35}),
        style({opacity: 1, transform: 'rotateZ(-2deg)', offset: 0.70}),
        style({opacity: 1, transform: 'rotateZ(1deg)', offset: 0.95}),
        style({opacity: 1, transform: 'translateX(0)', offset: 1 })
      ]))
    ]), {optional: true}),
    query(':leave', stagger('30ms', [
      animate('.3s ease-in', keyframes([
        style({opacity: 1, zIndex: 2000, offset: 0.0}),
        style({opacity: 1, transform: 'rotateZ(20deg)', offset: 0.20}),
        style({opacity: 1, transform: 'rotateY(360deg)', offset: 0.50}),

      ]))
    ]), {optional: true})
  ])
])

export let talonAnimation = 
trigger('talonFlip',[
  transition('*=>*', [
    query(':leave', stagger('30ms', [
      animate('.3s ease-in', keyframes([
        style({opacity: 1, zIndex: 2000, offset: 0.0}),
        style({opacity: 1, transform: 'rotateZ(20deg)', offset: 0.10}),
        style({opacity: 1, transform: 'translate(10%,-20%)', offset: 0.30}),
        style({opacity: 1, transform: 'rotateY(180deg)', offset: 0.40}),
        style({opacity: 1, transform: 'translate(25%,-30%)', offset: 0.80}),
        style({opacity: 0, offset: 1.0}),

      ]))
    ]), {optional: true}),
    query(':enter', stagger('50ms', [
      animate('2s ease-out', keyframes([
        style({opacity: 0, zIndex: 3000, transform: 'translate(-30%,-50%)', offset: 0.0}),
        style({opacity: 1, transform: 'translate(10%,-20%) rotateY(180deg)', offset: 0.10}),
        style({opacity: 1, transform: 'translate(0%,0%)', offset: 0.20}),
        style({opacity: 1, transform: 'rotateZ(10deg)', offset: 0.40}),
        style({opacity: 1, transform: 'rotateZ(5deg)', offset: 0.60}),
        style({opacity: 1, transform: 'rotateZ(-5deg)', offset: 0.90}),
        style({opacity: 1, transform: 'rotateZ(0deg)', offset: 1.0}),
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
    query(':enter', stagger('50ms', [
      animate('0.8s ease-in', keyframes([
        style({opacity: 1, transform: 'rotateZ(1deg)', offset: 0.30}),
        style({opacity: 1, transform: 'rotateZ(-1deg)', offset: 0.60}),
        style({opacity: 1, transform: 'rotateZ(0deg)', offset: 1})
      ]))
    ]), {optional: true}),
    query(':leave', stagger('30ms', [
      animate('.6s ease-in', keyframes([
        style({opacity: 1, zIndex: 2000, offset: 0.0}),
        style({opacity: 1, transform: 'rotateZ(20deg)', offset: 0.20}),
        style({opacity: 1, transform: 'rotateY(360deg)', offset: 0.50}),
      ]))
    ]), {optional: true})
  ])
])

export let menuAnimation = 
trigger('menuSlide',[
  transition('*=>*', [
    query(':leave', stagger('1000ms', [
      animate('2s ease-in', keyframes([
        style({opacity: 1, transform: 'rotateZ(10deg)', offset: 0.10}),
        style({opacity: 1, transform: 'rotateZ(-15deg)', offset: 0.20}),
        style({opacity: 1, transform: 'rotateX(180deg)', offset: 0.30}),
        style({opacity: 1, transform: 'translate(150%,25%)', offset: 1.0}),
      ]))
    ]), {optional: true})
  ])
])