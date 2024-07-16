import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";

const router = Router()

router.post("/",
    body("projectName").notEmpty().withMessage("El nombre del Proyecto es Obligatorio"),
    body("clientName").notEmpty().withMessage("El nombre del Cliente es Obligatorio"),
    body("description").notEmpty().withMessage("La descripción del Proyecto es Obligatoria"),
    handleInputErrors,
    ProjectController.createProject)

router.get("/", ProjectController.getAllProjects)
router.get("/:id", 
    param("id").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    ProjectController.getProjectById)

router.put("/:id", 
    param("id").isMongoId().withMessage("ID no válido"),
    body("projectName").notEmpty().withMessage("El nombre del Proyecto es Obligatorio"),
    body("clientName").notEmpty().withMessage("El nombre del Cliente es Obligatorio"),
    body("description").notEmpty().withMessage("La descripción del Proyecto es Obligatoria"),
    handleInputErrors,
    ProjectController.updateProject)

router.delete("/:id", 
        param("id").isMongoId().withMessage("ID no válido"),
        handleInputErrors,
        ProjectController.deleteProject)

//Rutas para las tareas

//Optimizacion del codigo, ejecuta validateProjectExists siempre que exista projectId y se ejecuta siempre de primero
router.param("projectId", projectExists)

router.post("/:projectId/tasks",
    body("name").notEmpty().withMessage("El nombre de la Tarea es Obligatorio"),
    body("description").notEmpty().withMessage("La descripción de la Tarea es Obligatoria"),
    handleInputErrors,
    TaskController.createTask )

router.get("/:projectId/tasks",
    TaskController.getProjectTasks
)

router.param("taskId", taskExists)
router.param("taskId", taskBelongsToProject)
router.get("/:projectId/tasks/:taskId",
    param("taskId").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    TaskController.getTaskById
)

router.put("/:projectId/tasks/:taskId",
    param("taskId").isMongoId().withMessage("ID no válido"),
    body("name").notEmpty().withMessage("El nombre de la Tarea es Obligatorio"),
    body("description").notEmpty().withMessage("La descripción de la Tarea es Obligatoria"),
    handleInputErrors,
    TaskController.updateTask
)

router.delete("/:projectId/tasks/:taskId",
    param("taskId").isMongoId().withMessage("ID no válido"),
    handleInputErrors,
    TaskController.deleteTask
)

router.post("/:projectId/tasks/:taskId/status",
    param("taskId").isMongoId().withMessage("ID no válido"),
    body("status").notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)


export default router