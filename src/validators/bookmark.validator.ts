import { body } from 'express-validator'

export const bookmarkValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),

  body('url')
    .notEmpty()
    .withMessage('url is required')
    .isURL()
    .withMessage('Please enter a valid url')
]
