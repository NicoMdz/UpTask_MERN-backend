import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {
    //estatico porque no requiere ser instanciado
    static createProject = async (req: Request, res: Response) => {
        //OPCIÓN CON INSTANCIA
        const project = new Project(req.body)
        try {
            await project.save()
            res.send("Proyecto Creado Correctamente")
        } catch (error) {
            console.log("Error...")
        }

        /** OPCION SIN INSTANCIA
        try {
            await Project.create(req.body)
            res.send("Proyecto Creado Correctamente")
        } catch (error) {
            console.log("Error...")
        }**/
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({})
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const {id} = req.params
        
        try {
            const project = await Project.findById(id).populate("tasks")
            if (!project) {
                const error = new Error("Proyecto no encontrado")
                return res.status(404).json({error: error.message})
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const {id} = req.params
        
        try {
            const project = await Project.findById(id)

            if (!project) {
                const error = new Error("Proyecto no encontrado")
                return res.status(404).json({error: error.message})
            }
            project.projectName = req.body.projectName
            project.clientName = req.body.clientName
            project.description = req.body.description
            await project.save()
            res.send("Proyecto actualizado ")
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const {id} = req.params
        
        try {
            const project = await Project.findById(id)

            if (!project) {
                const error = new Error("Proyecto no encontrado")
                return res.status(404).json({error: error.message})
            }
            
            await project.deleteOne()
            res.send("Proyecto eliminado ")
        } catch (error) {
            console.log(error)
        }
    }
}

