import { Request, Response } from 'express'

let tasks: any[] = []

export const getTasks = (_req: Request, res: Response) => {
    res.json(tasks)
}

export const createTask = (req: Request, res: Response) => {
    const task = {
        id: Date.now(),
        title: req.body.title,
        completed: false,
    }
    tasks.push(task)
    res.status(201).json(task)
}
export const updateTask = (req: Request, res: Response) => {
    const { id } = req.params
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id))

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' })
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body }
    res.json(tasks[taskIndex])
}