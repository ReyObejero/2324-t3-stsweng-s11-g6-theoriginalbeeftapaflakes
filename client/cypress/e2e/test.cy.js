describe('Register Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register'); 
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
     
     cy.wait(500);

    
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



describe('Login Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login'); 
    
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
        cy.url().should('include', '/'); 
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
      cy.url().should('eq', 'http://localhost:3000/'); 
    });
  
    it('should navigate to the register page when clicking the create account button', () => {
      cy.get('.create-account-button').click();
      cy.url().should('include', '/register');
    });
  });
  

describe('Product List and Product Page', () => {
  beforeEach(() => {
      cy.intercept('GET', 'http://localhost:8080/products', {
          statusCode: 200,
          body: {
              data: {
                  items: [
                      {
                          id: '1',
                          name: 'Sub-Reseller Package',
                          imageUrl: 'https://res.cloudinary.com/dqfjotjba/image/upload/v1721909946/the_original_beef_tapa_flakes/products/sub-reseller-package.jpg',
                          packages: [
                              { price: 1975.00 },
                              { price: 3075.00 }
                          ]
                      },
                      {
                          id: '2',
                          name: 'Reseller Package',
                          imageUrl: 'https://res.cloudinary.com/dqfjotjba/image/upload/v1721910044/the_original_beef_tapa_flakes/products/reseller-package.jpg',
                          packages: [
                              { price: 3950.00 },
                              { price: 6150.00 }
                          ]
                      },
                      {
                          id: '3',
                          name: 'The Original Beef Tapa Flakes (330g)',
                          imageUrl: 'https://res.cloudinary.com/dqfjotjba/image/upload/v1721910049/the_original_beef_tapa_flakes/products/the-original-beef-tapa-flakes-330g.jpg',
                          packages: [
                              { price: 215.00 }
                          ]
                      }
                  ]
              }
          }
      }).as('getProducts');

      cy.intercept('GET', 'http://localhost:8080/products/*', {
          statusCode: 200,
          body: {
              data: {
                  id: '1',
                  name: 'Sub-Reseller Package',
                  imageUrl: 'https://res.cloudinary.com/dqfjotjba/image/upload/v1721909946/the_original_beef_tapa_flakes/products/sub-reseller-package.jpg',
                  description: 'This is a sample product description.',
                  ingredients: 'Beef, Soy Sauce, Sugar, Garlic, Pepper',
                  packages: [
                      {
                          id: '1',
                          name: 'Package A',
                          price: 1975.00,
                          items: [
                              {
                                  flavor: { name: 'Original' },
                                  flavorVariant: { size: '330g' },
                                  quantity: 3
                              }
                          ]
                      },
                      {
                          id: '2',
                          name: 'Package B',
                          price: 3075.00,
                          items: [
                              {
                                  flavor: { name: 'Spicy' },
                                  flavorVariant: { size: '330g' },
                                  quantity: 5
                              }
                          ]
                      }
                  ]
              }
          }
      }).as('getProduct');

      cy.intercept('POST', 'http://localhost:8080/carts/items', {
          statusCode: 200,
          body: {
              message: 'Product added to cart successfully!'
          }
      }).as('addToCart');

      cy.visit('http://localhost:3000/products');
  });

  it('should display the product list', () => {
      cy.wait('@getProducts');

      cy.get('h1').contains('PRODUCT LIST');

      cy.get('.productlist-image-container').should('have.length', 3);

      cy.get('.productlist-image-container').eq(0).within(() => {
          cy.get('img').should('have.attr', 'src').and('include', 'sub-reseller-package.jpg');
          cy.get('h3').contains('Sub-Reseller Package');
          cy.get('.product-price').contains('₱1,975.00 - ₱3,075.00');
      });

      cy.get('.productlist-image-container').eq(1).within(() => {
          cy.get('img').should('have.attr', 'src').and('include', 'reseller-package.jpg');
          cy.get('h3').contains('Reseller Package');
          cy.get('.product-price').contains('₱3,950.00 - ₱6,150.00');
      });

      cy.get('.productlist-image-container').eq(2).within(() => {
          cy.get('img').should('have.attr', 'src').and('include', 'the-original-beef-tapa-flakes-330g.jpg');
          cy.get('h3').contains('The Original Beef Tapa Flakes (330g)');
          cy.get('.product-price').contains('₱215.00');
      });
  });

  it('should navigate to a product page and display product details', () => {
      cy.wait('@getProducts');

      cy.get('.productlist-image-container').eq(0).click();

      cy.wait('@getProduct');

      cy.get('h1').contains('Sub-Reseller Package');
      cy.get('.p-details-container img').should('have.attr', 'src').and('include', 'sub-reseller-package.jpg');
      cy.get('.p-product-description').contains('This is a sample product description.');
      cy.get('.p-quantity-selector input').should('have.value', '1');
      cy.get('.p-package-button').should('have.length', 2);
  });

  it('should display package details when a package is selected', () => {
      cy.wait('@getProducts');

      cy.get('.productlist-image-container').eq(0).click();

      cy.wait('@getProduct');

      cy.get('.p-package-button').contains('Package A').click();

      cy.get('.p-price').contains('₱1,975.00');
      cy.get('ul').contains('Original (330g): 3');

      cy.get('.p-package-button').contains('Package B').click();

      cy.get('.p-price').contains('₱3,075.00');
      cy.get('ul').contains('Spicy (330g): 5');
  });

  it('should display a warning message if no package is selected when adding to cart', () => {
      cy.wait('@getProducts');

      cy.get('.productlist-image-container').eq(0).click();

      cy.wait('@getProduct');

      cy.get('.p-add-to-cart').click();

      cy.get('.p-error-bubble').contains('Please select a package').should('be.visible');
  });

  it('should add product to cart successfully when a package is selected', () => {
      cy.wait('@getProducts');

      cy.get('.productlist-image-container').eq(0).click();

      cy.wait('@getProduct');

      cy.get('.p-package-button').contains('Package A').click();

      cy.get('.p-add-to-cart').click();

      cy.wait('@addToCart');

      cy.get('.p-success-message').contains('Product added to cart successfully!').should('be.visible');
  });
  it('should successfully checkout and confirmed in cart', () => {
    cy.visit('http://localhost:3000/products');
    cy.get('.user-img').click();
    cy.get('.dropdown-menu-icon > :nth-child(1)').click();
    cy.get('input#username').type('admin');
    cy.get('input#password').type('admin123');
    cy.get('.login-button').click();
    cy.wait(5000); // Waits for 5 seconds
    cy.get('.nav-menu > :nth-child(2)').click();
    cy.get(':nth-child(1) > :nth-child(1) > .productlist-image').click();
    cy.get('.product-details > :nth-child(4) > :nth-child(1)').click();
    cy.get('.p-add-to-cart').click();
    cy.wait(5000); // Waits for 5 seconds
    cy.get('.cart-img').click();

  });

});


describe('Create Admin', () => {
  beforeEach(() => {
      cy.intercept('POST', 'http://localhost:8080/auth/register/admin', (req) => {
          const { email, username, password, confirmPassword } = req.body;
      
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
              req.reply({
                  statusCode: 400,
                  body: {
                      message: 'Please enter a valid email address',
                      errorOption: 'email'
                  }
              });
              return;
          }
      
          if (password !== confirmPassword) {
              req.reply({
                  statusCode: 400,
                  body: {
                      message: 'Passwords do not match',
                      errorOption: 'password'
                  }
              });
              return;
          }
      
          req.reply({
              statusCode: 201,
              body: {
                  message: 'Admin account created successfully!'
              }
          });
      }).as('createAdmin');

      cy.visit('http://localhost:3000/createadmin');
  });

  it('should display the form correctly', () => {
      cy.get('h2').contains('CREATE YOUR ADMIN ACCOUNT');
      cy.get('input#email').should('be.visible');
      cy.get('input#username').should('be.visible');
      cy.get('input#password').should('be.visible');
      cy.get('input#confirmPassword').should('be.visible');
      cy.get('button').contains('CREATE ADMIN ACCOUNT').should('be.visible');
  });

  it('should show error message for invalid email', () => {
      cy.get('input#email').type('invalid-email');
      cy.get('input#username').type('testuser');
      cy.get('input#password').type('password');
      cy.get('input#confirmPassword').type('password');
      cy.get('button').contains('CREATE ADMIN ACCOUNT').click();

      cy.get('.p-error-bubble').contains('Please enter a valid email address').should('be.visible');
  });

  it('should show error message for mismatched passwords', () => {
      cy.get('input#email').type('test@example.com');
      cy.get('input#username').type('testuser');
      cy.get('input#password').type('password');
      cy.get('input#confirmPassword').type('differentpassword');
      cy.get('button').contains('CREATE ADMIN ACCOUNT').click();

      cy.get('.p-error-bubble').contains('Passwords do not match').should('be.visible');
  });

  it('should show success message on successful submission', () => {
      cy.get('input#email').type('test@example.com');
      cy.get('input#username').type('testuser');
      cy.get('input#password').type('password');
      cy.get('input#confirmPassword').type('password');
      cy.get('button').contains('CREATE ADMIN ACCOUNT').click();

      cy.wait('@createAdmin');

      cy.get('.p-success-message').contains('Admin account created successfully!').should('be.visible');
  });
});
