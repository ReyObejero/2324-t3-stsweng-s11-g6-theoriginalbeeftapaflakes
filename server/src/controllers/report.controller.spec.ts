import { Request, Response, NextFunction } from 'express';
import { reportController } from '@/controllers/report.controller';
import { reportService } from '@/services';
import { statusCodes } from '@/constants';
import { sendResponse } from '@/utils/send-response';
import { OrderStatus } from '@prisma/client';

jest.mock('@/services/report.service');
jest.mock('@/utils/send-response', () => ({
    sendResponse: jest.fn()
}));


describe('Report Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            query: {}
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

    describe('getSales', () => {
        it('should get sales data', async () => {
            const sales = [{ id: 1, amount: 100 }];
            req.query = {
                productId: '1',
                packageId: '1',
                orderStatus: OrderStatus.CONFIRMED,
                startDate: '2023-01-01',
                endDate: '2023-12-31'
            };

            (reportService.getSales as jest.Mock).mockResolvedValue(sales);

            await reportController.getSales(req as Request, res as Response, next);

            expect(reportService.getSales).toHaveBeenCalledWith(
                1,
                1,
                OrderStatus.CONFIRMED,
                new Date('2023-01-01'),
                new Date('2023-12-31')
            );
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: { items: sales } });
        });

        it('should handle missing query parameters', async () => {
            const sales = [{ id: 1, amount: 100 }];
            req.query = {};

            (reportService.getSales as jest.Mock).mockResolvedValue(sales);

            await reportController.getSales(req as Request, res as Response, next);

            expect(reportService.getSales).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: { items: sales } });
        });
    });
});
