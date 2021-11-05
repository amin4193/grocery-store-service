/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import Boom   from '@hapi/boom'
import config from '../configs'
import * as Node from '../models/node'

const { admin, employee, manager } = config.roleTypes

const exportResult = {

  // Create new Node
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body: Node.INode = req.body
      const actorId = req.user ? req.user.id : 'admin'
      body.createdBy = actorId
      body.managedBy = actorId
      const node = await Node.init(body)
      res.result = node
      next(res)
    } catch (err) { next(err) }
  },

  // List all Node
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: Node.IQueryData = req.query as Node.IQueryData
      const role: string = req.user.role
      // if(role === employee)
      const result = await Node.list(query)
      res.result = result
      next(res)
    }
    catch (err) { next(err) }
  },

  // Show Node Profile
  async details(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const nodeId: string = req.params.nodeId
      const node = await Node.getByID(nodeId)
      res.result = node
      next(res)
    }
    catch (err) { next(err) }
  },

  // Update Node Profile
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const nodeId = req.params.nodeId
      const managerId: string = req.user ? req.user.id : 'admin'
      const node = await Node.updateById(nodeId, req.body, managerId)
      res.result = node
      next(res)
    }
    catch (err) { next(err) }
  },

  // Delete Node [Soft delete]
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const nodeId: string = req.params.nodeId
      const managerId: string = req.user ? req.user.id : 'admin'
      const node = await Node.archive(nodeId, managerId)
      res.result = node
      next(res)
    }
    catch (err) { next(err) }
  },

}

export default exportResult