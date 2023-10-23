import { nanoid } from 'nanoid'

// CONSTANTS
export const API = {
  INITIAL_BOARD_COLUMNS: [
    { name: 'Todo', tasks: [], id: nanoid(), color: '#49C4E5' },
    { name: 'Doing', tasks: [], id: nanoid(), color: '#8471F2' },
    { name: 'Done', tasks: [], id: nanoid(), color: '#67E2AE' }

  ]

}
