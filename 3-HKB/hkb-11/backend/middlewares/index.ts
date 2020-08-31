import { NextFunction, Request, Response } from 'express'
export function needAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) {
    return res.status(401).end()
  }
  next()
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  req.auth = null
  if (req.token) {
    const obj = JSON.parse(req.token)
    if ('id' in obj) {
      req.auth = {
        id: obj.id,
      }
    }
  }
  next()
}
