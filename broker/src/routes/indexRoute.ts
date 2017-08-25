import { NextFunction, Request, Response, Router } from "express";

export class IndexRoute {
    public static create(router: Router) {
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            new IndexRoute().index(req, res, next);
        })
    }
    
    public index(req: Request, res: Response, next: NextFunction) {
        res.sendFile("index.html", { root: __dirname })
    }
}