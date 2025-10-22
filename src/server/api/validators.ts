import type { Response, Request, NextFunction } from "express";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id); 

    if(!id || isNaN(id)) return res.status(400).json({ message: 'Invalid id' })

    next();
}