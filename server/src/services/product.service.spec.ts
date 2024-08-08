// productService.test.ts

import { productService, detailedProductQueryArgs, detailedPackageQueryArgs } from './product.service';
import { prismaClient } from '@/database';
import { reviewService } from './review.service';
import createError from 'http-errors';
import { statusCodes, errorMessages } from '@/constants';


jest.mock('@/database', () => ({
    prismaClient: {
        product: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
        },
        package: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

jest.mock('./review.service', () => ({
    reviewService: {
        getReviews: jest.fn(),
    },
}));

describe('productService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('deletePackage', () => {
        it('should throw an error if productId is not provided', async () => {
            await expect(productService.deletePackage(null as any, 1)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID)
            );
        });

        it('should throw an error if packageId is not provided', async () => {
            await expect(productService.deletePackage(1, null as any)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID)
            );
        });

        it('should throw an error if product does not exist', async () => {
            (prismaClient.product.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(productService.deletePackage(1, 1)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID)
            );
        });

        it('should delete the package and return it', async () => {
            const mockProduct = { id: 1, packages: [{ id: 1 }] };
            const mockPackage = { id: 1, productId: 1 };

            (prismaClient.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
            (prismaClient.package.findUnique as jest.Mock).mockResolvedValue(mockPackage);

            const result = await productService.deletePackage(1, 1);

            expect(prismaClient.package.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockPackage);
        });
    });

    describe('deleteProduct', () => {
        it('should throw an error if productId is not provided', async () => {
            await expect(productService.deleteProduct(null as any)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID)
            );
        });

        it('should throw an error if product does not exist', async () => {
            (prismaClient.product.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(productService.deleteProduct(1)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID)
            );
        });

        it('should delete the product and return it', async () => {
            const mockProduct = { id: 1 };

            (prismaClient.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

            const result = await productService.deleteProduct(1);

            expect(prismaClient.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockProduct);
        });
    });

    describe('updateProductAverageRating', () => {
        it('should throw an error if productId is not provided', async () => {
            await expect(productService.updateProductAverageRating(null as any)).rejects.toThrow(
                createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID)
            );
        });

        it('should update the product average rating', async () => {
            const mockReviews = [{ rating: 4 }, { rating: 5 }];
            const mockProduct = { id: 1, averageRating: 4.5 };

            (reviewService.getReviews as jest.Mock).mockResolvedValue(mockReviews);
            (prismaClient.product.update as jest.Mock).mockResolvedValue(mockProduct);

            const result = await productService.updateProductAverageRating(1);

            expect(prismaClient.product.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { averageRating: 4.5 },
                ...detailedProductQueryArgs,
            });
            expect(result).toEqual(mockProduct);
        });
    });
});
