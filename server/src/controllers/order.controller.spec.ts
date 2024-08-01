import { Request, Response, NextFunction } from 'express';
import { orderController } from './order.controller';
import { orderService } from '@/services';
import { sendResponse } from '@/utils/send-response';
import { statusCodes } from '@/constants';
import { UserRole } from '@prisma/client';

jest.mock('@/services');
jest.mock('@/utils/send-response');

describe('OrderController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockSendResponse: jest.Mock;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        productId: 1,
        packageId: 1,
        quantity: 1,
        price: 100,
        cardNumber: '1234567890123456',
        cardExpirationYear: 2024,
        cardExpirationMonth: 12,
        cardSecurityCode: '123',
      },
      jwtPayload: {
        userId: 1,
        role: UserRole.ADMIN
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockSendResponse = sendResponse as jest.Mock;
    mockSendResponse.mockClear();

    next = jest.fn(); // Define a mock next function
  });

  describe('createOrder', () => {
    it('should create an order and return a success message', async () => {
      const mockOrder = { id: 1, ...req.body };
      (orderService.createOrder as jest.Mock).mockResolvedValue(mockOrder);

      await orderController.createOrder(req as Request, res as Response, next);

      expect(orderService.createOrder).toHaveBeenCalledWith(
        req!.jwtPayload!.userId,
        req!.body.productId,
        req!.body.packageId,
        req!.body.quantity,
        req!.body.price,
        {
          number: req!.body.cardNumber,
          expiry: `${req!.body.cardExpirationYear}-${req!.body.cardExpirationMonth}`,
          security_code: req!.body.cardSecurityCode,
        }
      );

      expect(mockSendResponse).toHaveBeenCalledWith(res, statusCodes.successful.CREATED, { data: mockOrder });
    });
  });
});
