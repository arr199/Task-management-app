describe('User visit the page , create a board, create a new task and modify the task', () => {
  it('should render the page', () => {
    cy.visit('http://localhost:5173/')
    // INPUT EMAIL
    cy.get('[data-id = "email-input"] ').type('test@test.com')
    // INPUT PASSWORD
    cy.get('[data-id = "password-input"]').type('test123')
    // CLICK LOGIN
    cy.get("[data-id = 'login-button']").click()

    // CREATE BOARD
    cy.get('[data-id="create-board-button"]').click()
    // SET THE NAME FOR THE NEW BOARD
    cy.get('[ data-id = "new-board-name-input"]').type('NewBoard')
    // ADD NEW BOARD
    cy.get('[data-id = "create-board-form-button"]').click()
    // ADD NEW TASK
    cy.get('[data-id = "add-new-task"]').click()
    // TASK TITLE
    cy.get('[data-id = "add-task-title"]').type('Learn React')
    // TASK DESCRIPTION
    cy.get('[data-id = "add-task-description"]').type('learning react in order the get a job')
    // ADD  SUBTASK
    cy.get('button').contains('Add New Subtask').click().click().click()
    // SET THE SUBTASKS NAMES
    cy.get('[data-id = "add-task-subtask"]').eq(2).type('Functional components')
    cy.get('[data-id = "add-task-subtask"]').eq(0).type('Class components')
    cy.get('[data-id = "add-task-subtask"]').eq(1).type('Context API')
    cy.get('[data-id = "add-task-subtask"]').eq(3).type('Conditional Rendering')
    // CREATE TASK
    cy.get('button').contains('Create Task').click()
    // CLICK THE TASK
    cy.contains('Learn React').click()
    // CHECK FOR PARAMS IN THE URL
    cy.url().should('include', 'column=0&task=0')
    // CHECK SUBTASK 0 AND 3
    cy.get('input[type="checkbox"] ').eq(0).check()
    cy.get('input[type="checkbox"] ').eq(3).check()
    // SAVE THE CHANGES
    cy.get('button').contains('Save').click()
    // THE NUMBER OF COMPLETED SUBTASKS SHOULD CHANGE
    cy.get('.dragged-element').should('include.text', '2')
  })
})
