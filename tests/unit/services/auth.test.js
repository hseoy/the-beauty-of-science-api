import createHttpError from 'http-errors';
import AuthService from '@/services/auth';

describe('Auth service unit tests', () => {
  const mockAccessToken = 'ACCESS';
  const mockRefreshToken = 'REFRESH';
  const mockUser = {
    id: 1,
    username: 'bruno',
    email: 'bruno@foo.com',
    password: 'pwforbruno',
  };

  describe('AuthService constructor tests', () => {
    const authServiceInstance = new AuthService();

    it('<AuthService.constructor> properties are undefined', () => {
      expect(authServiceInstance.authHelper).toBeUndefined();
      expect(authServiceInstance.userModel).toBeUndefined();
      expect(authServiceInstance.userLoginiModel).toBeUndefined();
    });
  });

  describe('AuthService.Signup method tests', () => {
    const model = {
      transaction: jest.fn(),
      transactionStartWithTrx: jest.fn(),
      transactionCommit: jest.fn(),
      transactionRollback: jest.fn(),
      create: jest.fn(),
    };
    const authHelper = {
      generateHash: jest.fn(),
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      storeRefreshToken: jest.fn(),
    };
    const authServiceInstance = new AuthService({
      userModel: model,
      userLoginModel: model,
      authHelper,
    });

    it('<AuthService.SignUp> returns token object', async () => {
      authHelper.generateAccessToken.mockReturnValueOnce(mockAccessToken);
      authHelper.generateRefreshToken.mockReturnValueOnce(mockRefreshToken);
      model.create.mockResolvedValue([{}]);

      const res = await authServiceInstance.SignUp(mockUser);
      expect(res).toEqual({
        access: mockAccessToken,
        refresh: mockRefreshToken,
      });
    });

    it('<AuthService.SignUp> throw http error(unable to signup)', async () => {
      model.create.mockRejectedValue(new Error('ERROR'));
      await expect(authServiceInstance.SignUp(mockUser)).rejects.toThrow(
        createHttpError(400, 'unable to signup'),
      );
    });
  });

  describe('AuthService.SignIn method tests', () => {
    const model = {
      findBy: jest.fn().mockResolvedValue([mockUser]),
    };
    const authHelper = {
      comparePassword: jest.fn(),
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      storeRefreshToken: jest.fn(),
    };
    const authServiceInstance = new AuthService({
      userModel: model,
      userLoginModel: model,
      authHelper,
    });

    beforeEach(() => {
      authHelper.generateAccessToken.mockReturnValueOnce(mockAccessToken);
      authHelper.generateRefreshToken.mockReturnValueOnce(mockRefreshToken);
    });

    it('<AuthService.SignIn> returns token object', async () => {
      authHelper.comparePassword.mockReturnValueOnce(true);

      const res = await authServiceInstance.SignIn(
        mockUser.email,
        mockUser.password,
      );
      expect(res).toEqual({
        access: mockAccessToken,
        refresh: mockRefreshToken,
      });
    });

    it('<AuthService.SignIn> returns null', async () => {
      authHelper.comparePassword.mockReturnValueOnce(false);

      const res = await authServiceInstance.SignIn(
        mockUser.email,
        mockUser.password,
      );
      expect(res).toBeNull();
    });

    it('<AuthService.SignIn> throw http error(unable to signin)', async () => {
      authHelper.comparePassword.mockReturnValueOnce(true);
      authHelper.storeRefreshToken.mockRejectedValue(new Error('ERROR'));

      await expect(
        authServiceInstance.SignIn(mockUser.email, mockUser.password),
      ).rejects.toThrow(createHttpError(400, 'unable to signin'));
    });
  });

  describe('AuthService.SignOut method tests', () => {
    const authHelper = {
      deleteRefreshToken: jest.fn(),
    };
    const authServiceInstance = new AuthService({ authHelper });

    it('<AuthService.SignOut> does not return', async () => {
      const res = await authServiceInstance.SignOut('token');
      expect(res).toBeUndefined();
    });

    it('<AuthService.SignOut> throw http error(unable to signout)', async () => {
      authHelper.deleteRefreshToken.mockRejectedValue(new Error('ERROR'));
      await expect(authServiceInstance.SignOut('token')).rejects.toThrow(
        createHttpError(400, 'unable to signout'),
      );
    });
  });

  describe('AuthService.RefreshAccessToken method tests', () => {
    const userModel = {
      findBy: jest.fn().mockResolvedValue([mockUser]),
    };
    const authHelper = {
      decodeAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
      generateAccessToken: jest.fn(),
    };
    const authServiceInstance = new AuthService({ userModel, authHelper });

    beforeEach(() => {
      authHelper.decodeAccessToken.mockReturnValueOnce({ id: mockUser.id });
      authHelper.generateAccessToken.mockReturnValueOnce(mockAccessToken);
    });

    it('<AuthService.RefreshAccessToken> returns access token object', async () => {
      authHelper.verifyRefreshToken.mockReturnValueOnce(true);
      const res = await authServiceInstance.RefreshAccessToken(
        mockRefreshToken,
        mockAccessToken,
      );
      expect(res).toEqual({ access: mockAccessToken });
    });

    it('<AuthService.RefreshAccessToken> throw http error(Unauthorized)', async () => {
      authHelper.verifyRefreshToken.mockReturnValueOnce(false);
      await expect(
        authServiceInstance.RefreshAccessToken(
          mockRefreshToken,
          mockAccessToken,
        ),
      ).rejects.toThrow(createHttpError(401, 'Unauthorized'));
    });

    it('<AuthService.RefreshAccessToken> throw http error(Unauthorized)', async () => {
      userModel.findBy.mockRejectedValue(new Error('ERROR'));
      await expect(
        authServiceInstance.RefreshAccessToken(
          mockRefreshToken,
          mockAccessToken,
        ),
      ).rejects.toThrow(createHttpError(401, 'Unauthorized'));
    });
  });
});
