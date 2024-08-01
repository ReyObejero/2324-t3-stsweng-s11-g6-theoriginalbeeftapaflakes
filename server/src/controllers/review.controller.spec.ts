import { Request, Response, NextFunction } from 'express';
import { reviewController } from '@/controllers/review.controller';
import { reviewService } from '@/services';
import { statusCodes } from '@/constants';
import { sendResponse } from '@/utils/send-response';

jest.mock('@/services/review.service');
jest.mock('@/utils/send-response', () => ({
    sendResponse: jest.fn()
}));



describe('Review Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            jwtPayload: {
                userId: 1, // Assume the userId is a number
                role: 'USER' // Add role property
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn() as NextFunction;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createReview', () => {
        it('should create a review', async () => {
            const review = { id: 1, productId: 1, userId: 1, rating: 5, comment: 'Great product!' };
            req.params = { productId: '1' };
            req.body = { rating: 5, comment: 'Great product!' };

            (reviewService.createReview as jest.Mock).mockResolvedValue(review);

            await reviewController.createReview(req as Request, res as Response, next);

            expect(reviewService.createReview).toHaveBeenCalledWith(1, 1, 5, 'Great product!');
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.CREATED, { data: review });
        });
    });

    describe('getReviews', () => {
        it('should get all reviews', async () => {
            const reviews = [{ id: 1, productId: 1, userId: 1, rating: 5, comment: 'Great product!' }];

            (reviewService.getReviews as jest.Mock).mockResolvedValue(reviews);

            await reviewController.getReviews(req as Request, res as Response, next);

            expect(reviewService.getReviews).toHaveBeenCalled();
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.CREATED, { data: { items: reviews } });
        });
    });

    describe('updateReview', () => {
        it('should update a review', async () => {
            const review = { id: 1, productId: 1, userId: 1, rating: 4, comment: 'Good product!' };
            req.params = { reviewId: '1' };
            req.body = { rating: 4, comment: 'Good product!' };

            (reviewService.updateReview as jest.Mock).mockResolvedValue(review);

            await reviewController.updateReview(req as Request, res as Response, next);

            expect(reviewService.updateReview).toHaveBeenCalledWith(1, 4, 'Good product!');
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: review });
        });
    });

    describe('deleteReview', () => {
        it('should delete a review', async () => {
            const review = { id: 1, productId: 1, userId: 1, rating: 5, comment: 'Great product!' };
            req.params = { reviewId: '1' };

            (reviewService.deleteReview as jest.Mock).mockResolvedValue(review);

            await reviewController.deleteReview(req as Request, res as Response, next);

            expect(reviewService.deleteReview).toHaveBeenCalledWith(1, 1);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: review });
        });
    });
});
