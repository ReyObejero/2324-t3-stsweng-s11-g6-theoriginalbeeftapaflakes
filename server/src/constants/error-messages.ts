import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from './validation-rules';

export const errorMessages = {
    ACCESS_DENIED: 'Access is denied.',
    CART_ALREADY_EXISTS: 'Cart already exists for this user.',
    CART_ID_INVALID: 'Cart ID is invalid.',
    CART_ITEM_ID_INVALID: 'Cart item ID is invalid.',
    EMAIL_ALREADY_IN_USE: 'Email is already in use.',
    EMAIL_INVALID: 'Email is invalid.',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    PASSWORD_INVALID: 'Password is invalid.',
    PASSWORD_TOO_SHORT: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    PACKAGE_ID_INVALID: 'Package ID is invalid.',
    PRODUCT_ID_INVALID: 'Product ID is invalid.',
    QUANTITY_INVALID: 'Quantity is invalid.',
    RESOURCE_NOT_FOUND: 'Resource not found.',
    TOKEN_NOT_FOUND: 'Token not found.',
    TOKEN_INVALID: 'Token is invalid.',
    USER_ID_INVALID: 'User ID is invalid.',
    USERNAME_ALREADY_IN_USE: 'Username is already in use.',
    USERNAME_INVALID: 'Username is invalid.',
    USERNAME_TOO_SHORT: `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`,
};
