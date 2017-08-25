import { NextFunction, Request, Response, Router } from "express";

export class StatusRoute {
    public static create(router: Router) {
        router.get("/status", (req: Request, res: Response, next: NextFunction) => {
            new StatusRoute().index(req, res, next);
        })
    }

    public index(req: Request, res: Response, next: NextFunction) {
        res.status(200).send("Name: Kaptaind Broker. <br> Status: Running")
    }
}