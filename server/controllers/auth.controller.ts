// server/controllers/auth.controller.ts
// server/controllers/auth.controller.ts
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_vibe_code';
export const userAuthentication = async (req: Request, res: Response) => {

};



