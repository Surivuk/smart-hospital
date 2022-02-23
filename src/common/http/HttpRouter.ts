import { Router } from "express";

export default interface HttpRouter {
    router(): Router
}