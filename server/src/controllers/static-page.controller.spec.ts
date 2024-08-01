import { Request, Response, NextFunction } from 'express';
import { staticPageController } from '@/controllers/static-page.controller';
import { staticPageService } from '@/services';
import { statusCodes } from '@/constants';
import { sendResponse } from '@/utils/send-response';

jest.mock('@/services/static-page.service');
jest.mock('@/utils/send-response', () => ({
    sendResponse: jest.fn()
}));


describe('Static Page Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            params: {},
            body: {}
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

    describe('createStaticPage', () => {
        it('should create a static page', async () => {
            const staticPage = { id: 1, title: 'Test Page' };
            req.body = { title: 'Test Page' };

            (staticPageService.createStaticPage as jest.Mock).mockResolvedValue(staticPage);

            await staticPageController.createStaticPage(req as Request, res as Response, next);

            expect(staticPageService.createStaticPage).toHaveBeenCalledWith('Test Page');
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.CREATED, { data: staticPage });
        });
    });

    describe('createStaticPageElement', () => {
        it('should create a static page element', async () => {
            const staticPageElement = { id: 1, title: 'Test Element', content: 'Test Content' };
            req.params = { staticPageSlug: 'test-page' };
            req.body = { title: 'Test Element', content: 'Test Content' };

            (staticPageService.createStaticPageElement as jest.Mock).mockResolvedValue(staticPageElement);

            await staticPageController.createStaticPageElement(req as Request, res as Response, next);

            expect(staticPageService.createStaticPageElement).toHaveBeenCalledWith('test-page', 'Test Element', 'Test Content');
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.CREATED, { data: staticPageElement });
        });
    });

    describe('getStaticPage', () => {
        it('should get a static page', async () => {
            const staticPage = { id: 1, title: 'Test Page' };
            req.params = { staticPageSlug: 'test-page' };

            (staticPageService.getStaticPageBySlug as jest.Mock).mockResolvedValue(staticPage);

            await staticPageController.getStaticPage(req as Request, res as Response, next);

            expect(staticPageService.getStaticPageBySlug).toHaveBeenCalledWith('test-page');
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: staticPage });
        });
    });

    describe('getStaticPages', () => {
        it('should get all static pages', async () => {
            const staticPages = [{ id: 1, title: 'Test Page' }];
            
            (staticPageService.getStaticPages as jest.Mock).mockResolvedValue(staticPages);

            await staticPageController.getStaticPages(req as Request, res as Response, next);

            expect(staticPageService.getStaticPages).toHaveBeenCalled();
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: { items: staticPages } });
        });
    });

    describe('updateStaticPageElement', () => {
        it('should update a static page element', async () => {
            const staticPageElement = { id: 1, title: 'Updated Element', content: 'Updated Content' };
            req.params = { staticPageElementId: '1' };
            req.body = { title: 'Updated Element', content: 'Updated Content' };

            (staticPageService.updateStaticPageElement as jest.Mock).mockResolvedValue(staticPageElement);

            await staticPageController.updateStaticPageElement(req as Request, res as Response, next);

            expect(staticPageService.updateStaticPageElement).toHaveBeenCalledWith(1, 'Updated Element', 'Updated Content');
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: staticPageElement });
        });
    });

    describe('deleteStaticPageElement', () => {
        it('should delete a static page element', async () => {
            const staticPageElement = { id: 1, title: 'Test Element', content: 'Test Content' };
            req.params = { staticPageElementId: '1' };

            (staticPageService.deleteStaticPageElement as jest.Mock).mockResolvedValue(staticPageElement);

            await staticPageController.deleteStaticPageElement(req as Request, res as Response, next);

            expect(staticPageService.deleteStaticPageElement).toHaveBeenCalledWith(1);
            expect(sendResponse).toHaveBeenCalledWith(res, statusCodes.successful.OK, { data: staticPageElement });
        });
    });
});
