import { FastifyReply, FastifyRequest } from 'fastify'
import {
  createUniquePostSchema,
  deleteUniquePostSchema,
  findManyPostsSchema,
  findUniquePostSchema,
  updateUniquePostSchema,
} from '~/modules/posts/post.schema'
import { createPost, deletePost, findManyPosts, findPostByPostId, updatePost } from '~/modules/posts/post.service'
import { InferZodFastifySchema } from '~/utils/methods/common/zodSchema'

export const createPostController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof createUniquePostSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  const body = request.body
  try {
    const post = await createPost({ ...body, userId: request.session.user?.userId })
    return reply.status(201).send({ postId: post?.postId })
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const findManyPostsController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof findManyPostsSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { data, total } = await findManyPosts(request.query)
    return reply.status(200).send({
      data,
      total,
    })
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const findUniquePostController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof findUniquePostSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const post = await findPostByPostId(request.params.postId)
    return reply.status(200).send({
      data: post,
    })
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const deleteUniquePostController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof deleteUniquePostSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    await deletePost(request.params.postId)
    return reply.status(200).send()
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const updateUniquePostController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof updateUniquePostSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { postId } = request.params
    const body = request.body
    const foundPost = await findPostByPostId(postId)
    if (!foundPost) throw new Error('Post not found')
    await updatePost(postId, body)
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}
