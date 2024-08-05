// Register.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import Register from './Register';

jest.mock('axios');

describe('Register Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Register component', () => {
        render(
            <Router>
                <Register />
            </Router>
        );

        expect(screen.getByText(/CREATE YOUR ACCOUNT/i)).toBeInTheDocument();
    });

    test('handles input changes', () => {
        render(
            <Router>
                <Register />
            </Router>
        );

        const emailInput = screen.getByLabelText(/Email Address/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');

        const usernameInput = screen.getByLabelText(/Username/i);
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        expect(usernameInput.value).toBe('testuser');

        const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input#password' });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');

        const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        expect(confirmPasswordInput.value).toBe('password123');
    });

    test('displays error message for invalid email', async () => {
        render(
            <Router>
                <Register />
            </Router>
        );

        const emailInput = screen.getByLabelText(/Email Address/i);
        const submitButton = screen.getByText(/CREATE ACCOUNT/i);

        fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
        });
    });

    test('submits form successfully', async () => {
        axios.post.mockResolvedValue({
            status: 201,
            data: { message: 'Account created successfully' },
        });

        render(
            <Router>
                <Register />
            </Router>
        );

        const emailInput = screen.getByLabelText(/Email Address/i);
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input#password' });
        const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
        const submitButton = screen.getByText(/CREATE ACCOUNT/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Account created successfully')).toBeInTheDocument();
        });
    });

    test('displays error message on failed form submission', async () => {
        axios.post.mockRejectedValue(new Error('Network Error'));

        render(
            <Router>
                <Register />
            </Router>
        );

        const emailInput = screen.getByLabelText(/Email Address/i);
        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input#password' });
        const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
        const submitButton = screen.getByText(/CREATE ACCOUNT/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Network Error')).toBeInTheDocument();
        });
    });
});
