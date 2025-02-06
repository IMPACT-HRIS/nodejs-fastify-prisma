import { FastifyReply, FastifyRequest } from 'fastify'
import {
  createUniqueUserSchema,
  deleteUniqueUserSchema,
  findManyUsersSchema,
  findUniqueUserSchema,
  updateUniqueUserSchema,
} from '~/modules/users/user.schema'
import {
  createUser,
  deleteUserByUserId,
  findManyUsers,
  findUserByUserId,
  findUserByUsername,
  updateUser,
} from '~/modules/users/user.service'
import { InferZodFastifySchema } from '~/utils/methods/common/zodSchema'

export const createUserController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof createUniqueUserSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  const body = request.body
  try {
    const foundUser = await findUserByUsername(body.username)
    if (foundUser) throw new Error('User already exists')
    const user = await createUser(body)
    return reply.status(201).send({ userId: user?.userId })
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const findManyUsersController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof findManyUsersSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { data, total } = await findManyUsers(request.query)
    return reply.status(200).send({
      data,
      total,
    })
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const findUniqueUserController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof findUniqueUserSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const user = await findUserByUserId(request.params.userId)
    return reply.status(200).send({
      data: user,
    })
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const deleteUniqueUserController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof deleteUniqueUserSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    await deleteUserByUserId(request.params.userId)
    return reply.status(200).send()
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const updateUniqueUserController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof updateUniqueUserSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { userId } = request.params
    const body = request.body
    const foundUser = await findUserByUserId(userId)
    if (!foundUser) throw new Error('User not found')
    await updateUser(userId, body)
    // const user = await findUserByUserId(userId)
    // return reply.status(200).send({
    //   data: user,
    // })
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}
