import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// INITIALIZE FIREABASE
export function useFirebase (): any {
  const firebaseConfig = {
    apiKey: 'AIzaSyAkfLE2SMm3Tms3HAAGgJry1dq1hVr1ohE',
    authDomain: 'kanban-task-management-c2c46.firebaseapp.com',
    projectId: 'kanban-task-management-c2c46',
    storageBucket: 'kanban-task-management-c2c46.appspot.com',
    messagingSenderId: '779642578343',
    appId: '1:779642578343:web:292387274e01a02d53c282'
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const auth = getAuth()
  return { app, auth, db }
}

// VALIDATE THE INPUTS
export function showValidationErrors (name: string): string {
  const removingWhiteSpaces = name.replace(/\s+/g, '')
  switch (removingWhiteSpaces) {
    case '' : return "Can't be empty"
    default : return ''
  }
}

// REMOVE THE OPACITY CLASS FROM THE ELEMENT
export function removeOpacityClass (id: string): void {
  const container = document.querySelector(`${id}`) as HTMLElement
  container?.classList.remove('task')
}

// CHANGE MAIN PAGE POINTER EVENTS
export function mainPointerEvents (s: string): void {
  const mainPage = document.querySelector('#main-page') as HTMLElement
  mainPage.style.pointerEvents = s
}

// CHANGE COLUMN COLOR
export function getColor (s: string): string {
  switch (s.toLowerCase()) {
    case 'todo' : return '#49C4E5'
    case 'doing' : return '#8471F2'
    case 'done' : return '#67E2AE'
    default : return Math.floor(Math.random() * (0xffffff - 0x100000) + 0x100000).toString(16).padEnd(6, '0')
  }
}
