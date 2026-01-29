import { body } from 'express-validator'

export const registerValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('name').trim().notEmpty().withMessage('Name is required')
]

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('password').notEmpty().withMessage('Password is required')
]
