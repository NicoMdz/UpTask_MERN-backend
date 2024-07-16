import { type Request, type Response, type NextFunction, request } from "express";
import Project, { IProject } from "../models/Project";

//Resscribiendo el scope global de Request desde este modulo
declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export async function projectExists(req: Request, res: Response, next: NextFunction) {
    //Obtenemos el id del proyecto y verificamos que exista
    try {
        const {projectId} = req.params
        const project = await Project.findById(projectId)
        if (!project) {
            const error = new Error("Proyecto no encontrado")
            return res.status(404).json({error: error.message})
        }
        req.project = project
        next()
    } catch (error) {
        res.status(500).json({error: "Hubo un error"})
    }
}