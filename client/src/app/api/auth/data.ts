// In-memory user database (for demo purposes)
// In a real application, this would be replaced with a proper database

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  company?: string;
  country?: string;
  avatar?: string;
  createdAt: Date;
}

export const users: User[] = [
  {
    id: '1',
    email: 'demo@veblyss.com',
    password: 'demo123',
    name: 'Demo User',
    phone: '+1234567890',
    company: 'VeBlyss Global',
    country: 'IN',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Smith',
    phone: '+1987654321',
    company: 'Global Trade Co.',
    country: 'US',
    createdAt: new Date('2024-01-15'),
  },
];

// Helper function to generate unique ID
export function generateUserId(): string {
  return (users.length + 1).toString();
}

// Helper function to find user by ID
export function findUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

// Helper function to find user by email
export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email);
}

// Helper function to create new user
export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...userData,
    id: generateUserId(),
    createdAt: new Date(),
  };
  users.push(newUser);
  return newUser;
}

// Helper function to update user
export function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): User | null {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return null;
  }
  
  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
}
