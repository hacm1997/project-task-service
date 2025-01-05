import { UserBase } from '../Models/Users/service/user.base';

describe('UserBase', () => {
  let user: UserBase;

  beforeEach(() => {
    user = new UserBase(
      'Test User',
      'test@example.com',
      'usuario estándar',
      'password123',
      {},
    );
  });

  it('debería generar un ID automáticamente', () => {
    expect(user.getId).toBeDefined();
  });

  it('debería tener un nombre asignado correctamente', () => {
    expect(user.getName).toBe('Test User');
  });

  it('debería tener un email asignado correctamente', () => {
    expect(user.getEmail).toBe('test@example.com');
  });

  it('debería tener una contraseña asignada correctamente', () => {
    expect(user.getPassword).toBe('password123');
  });

  it('debería tener el rol asignado correctamente', () => {
    expect(user.getRole).toBe('usuario estándar');
  });

  it('debería inicializar details como un objeto vacío', () => {
    expect(user.getDetails).toEqual({});
  });

  it('debería inicializar reputationPoints en 0', () => {
    expect(user.getReputationPoints).toBe(0);
  });

  it('debería aumentar la reputación', () => {
    user.addReputation(10);
    expect(user.getReputationPoints).toBe(10);
  });

  it('debería disminuir la reputación, no debe bajar de 0', () => {
    user.subtractReputation(5);
    expect(user.getReputationPoints).toBe(0); // No menor que 0
  });

  it('debería reducir la reputación correctamente', () => {
    user.addReputation(10);
    user.subtractReputation(5);
    expect(user.getReputationPoints).toBe(5);
  });
});
