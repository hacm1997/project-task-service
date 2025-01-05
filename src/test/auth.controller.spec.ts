import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../Models/Auth/controller/auth.controller';
import { AuthService } from '../Models/Auth/service/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a JWT token when credentials are valid', async () => {
      const mockUser = {
        email: 'user@example.com',
        password: 'password',
      };
      const mockResponse = {
        access_token: 'jwt_token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(mockResponse);

      const result = await authController.login({ body: mockUser });
      expect(result).toEqual(mockResponse);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const mockUser = {
        email: 'user@example.com',
        password: 'wrong_password',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.login({ body: mockUser })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return the user profile when authenticated', () => {
      const mockRequest = { user: { email: 'user@example.com' } };

      const result = authController.getProfile(mockRequest);
      expect(result).toEqual(mockRequest.user);
    });
  });
});
