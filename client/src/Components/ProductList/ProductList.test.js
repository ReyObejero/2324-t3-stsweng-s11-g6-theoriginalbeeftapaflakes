import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axiosInstance from '../../API/axiosInstance';
import ProductList from './ProductList';

jest.mock('../../API/axiosInstance');

describe('ProductList Component', () => {
    const mockProducts = [
        {
            id: '1',
            name: 'Product 1',
            imageUrl: 'http://example.com/product1.jpg',
            packages: [
                { price: 100 },
                { price: 200 },
            ],
        },
        {
            id: '2',
            name: 'Product 2',
            imageUrl: 'http://example.com/product2.jpg',
            packages: [
                { price: 300 },
                { price: 400 },
            ],
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('fetches and displays products', async () => {
        axiosInstance.get.mockResolvedValue({
            data: {
                data: {
                    items: mockProducts,
                },
            },
        });

        render(
            <Router>
                <ProductList />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });

        mockProducts.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
            expect(screen.getByAltText(product.name)).toHaveAttribute('src', product.imageUrl);
        });

        expect(screen.getByText('₱100.00 - ₱200.00')).toBeInTheDocument();
        expect(screen.getByText('₱300.00 - ₱400.00')).toBeInTheDocument();
    });

    test('displays error message on fetch failure', async () => {
        axiosInstance.get.mockRejectedValue(new Error('Error fetching products'));

        render(
            <Router>
                <ProductList />
            </Router>
        );

        await waitFor(() => {
            expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
            expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
        });
    });
});
