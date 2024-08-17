import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {
    //estatico porque no requiere ser instanciado
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        //Asigna manager
        project.manager = req.user.id
        console.log(req.user)
        
        //OPCIÓN CON INSTANCIA
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
            const projects = await Project.find({
                //Solo proyectos de quien esta autenticado
                $or: [
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })
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

            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error("Acción no válida")
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

            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error("Solo el manager puede actualizar un proyecto")
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

            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error("Solo el manager puede eliminar un proyecto")
                return res.status(404).json({error: error.message})
            }
            
            await project.deleteOne()
            res.send("Proyecto eliminado ")
        } catch (error) {
            console.log(error)
        }
    }
}

