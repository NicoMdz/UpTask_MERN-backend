import {
  type Request,
  type Response,
  type NextFunction,
  request,
} from "express";
import Task, { ITask } from "../models/Task";

//Resscribiendo el scope global de Request desde este modulo
declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function taskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //Obtenemos el id del proyecto y verificamos que exista
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      const error = new Error("Tarea no encontrada");
      return res.status(404).json({ error: error.message });
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}

export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //Verificamos que la tarea de la url pertenezca al proeycto de la url:
  //To string porque si no se lo ponemos, task.project aparece como "new ObjectId(###...)"
  if (req.task.project.toString() !== req.project.id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(400).json({ error: error.message });
  }
  next()
}
