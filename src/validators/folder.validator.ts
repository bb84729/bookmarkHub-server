import { body } from 'express-validator'

export const folderValidator = [body('name').trim().notEmpty().withMessage('name is required')]
