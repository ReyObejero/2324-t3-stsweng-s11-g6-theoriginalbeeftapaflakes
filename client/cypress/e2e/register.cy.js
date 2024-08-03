describe('Register Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register'); // Adjust the URL path as needed
  });

  it('should display the registration form', () => {
    cy.get('form').should('be.visible');
  });

  it('should allow the user to type in the email, username, and password', () => {
    cy.get('input#email').type('testuser@example.com');
    cy.get('input#username').type('testuser');
    cy.get('input#password').type('password');
    cy.get('input#confirmPassword').type('password');
    cy.get('input#email').should('have.value', 'testuser@example.com');
    cy.get('input#username').should('have.value', 'testuser');
    cy.get('input#password').should('have.value', 'password');
    cy.get('input#confirmPassword').should('have.value', 'password');
  });

  it('should display an error message for invalid email', () => {
    cy.get('input#email').type('invalidemail');
    cy.get('input#username').type('testuser');
    cy.get('input#password').type('password');
    cy.get('input#confirmPassword').type('password');
    cy.get('button[type="submit"]').click();
     // Debugging: Check if the error message exists
     cy.wait(500);

    // Check the error message content
    cy.get('.p-error-bubble').should('contain', 'Please enter a valid email address');
  
  });

  it('should submit the form and display a success message', () => {
    cy.get('input#email').type('testuser@example.com');
    cy.get('input#username').type('testuser');
    cy.get('input#password').type('password');
    cy.get('input#confirmPassword').type('password');
    cy.intercept('POST', '**/register', {
      statusCode: 201,
      body: { message: 'Registration successful' },
    }).as('registerRequest');
    cy.get('button[type="submit"]').click();
    cy.wait('@registerRequest');
    cy.get('.p-success-message').should('contain', 'Registration successful');
    cy.url().should('include', '/login');
  });

  it('should navigate to login page when clicking "Already have an account?"', () => {
    cy.get('a.login').click();
    cy.url().should('include', '/login');
  });
});
