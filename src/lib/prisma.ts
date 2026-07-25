// Prisma client - will be available after running prisma generate
// For now, using a mock implementation for demo mode

let PrismaClient: any;

try {
  const prismaModule = require('@prisma/client');
  PrismaClient = prismaModule.PrismaClient;
} catch (error) {
  // Prisma not initialized - use mock
  PrismaClient = class MockPrismaClient {
    constructor() {}
    // Add mock methods as needed
  };
}

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
