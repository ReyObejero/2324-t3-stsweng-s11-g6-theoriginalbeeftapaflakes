describe('Login Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login'); // Adjust the URL path as needed
    });
  
    it('should display the login form', () => {
      cy.get('form').should('be.visible');
    });
  
    it('should allow the user to type in the username and password', () => {
      cy.get('input#username').type('testuser');
      cy.get('input#password').type('password');
      cy.get('input#username').should('have.value', 'testuser');
      cy.get('input#password').should('have.value', 'password');
    });

    it('should navigate to home page on successful login', () => {
        cy.get('input#username').type('user1@gmail.com');
        cy.get('input#password').type('$argon2id$v=19$m=65536,t=3,p=4$cXYgdcWefrAPDlCiRRHtFA$k4PvNFwkgwOpmFJRJrtKzGS5CuNsBUCPqE4hROCUahU');
    
        cy.intercept('POST', '**/login', {
          statusCode: 200,
          body: { message: 'Login successful!' },
        }).as('loginRequest');
    
        cy.intercept('GET', '**/me', {
          statusCode: 200,
          body: { data: { user: { id: 1, username: 'user1@gmail.com' } } },
        }).as('userRequest');
    
        cy.get('button[type="submit"]').click();
    
        cy.wait('@loginRequest');
        cy.wait('@userRequest');
    
        cy.get('.p-success-message').should('contain', 'Login successful! Retrieving user information...');
        cy.url().should('include', '/'); // Adjust based on your redirection logic
    });

    it('should display an error message for invalid credentials', () => {
      cy.get('input#username').type('wronguser');
      cy.get('input#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
  
      cy.intercept('POST', '**/login', {
        statusCode: 401,
        body: { message: 'Login failed. Please check your credentials.' },
      }).as('loginRequest');
  
      cy.get('.p-error-bubble').should('contain', 'Login failed. Please check your credentials.');
    });
  
    it('should navigate to home page on successful login', () => {
      cy.get('input#username').type('correctuser');
      cy.get('input#password').type('correctpassword');
  
      cy.intercept('POST', '**/login', {
        statusCode: 200,
        body: { message: 'Login successful!' },
      }).as('loginRequest');
  
      cy.intercept('GET', '**/me', {
        statusCode: 200,
        body: { data: { user: { id: 1, username: 'correctuser' } } },
      }).as('userRequest');
  
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest');
      cy.wait('@userRequest');
  
      cy.get('.p-success-message').should('contain', 'Login successful! Retrieving user information...');
      cy.url().should('eq', 'http://localhost:3000/'); // Ensure the URL is the homepage URL 
    });
  
    it('should navigate to the register page when clicking the create account button', () => {
      cy.get('.create-account-button').click();
      cy.url().should('include', '/register');
    });
  });
  
 