import { InvalidInputError } from '~/class/Error'
import { uploadFile } from '~/database/objectStorage'
import prisma from '~/database/prisma'
import { encodeFilename } from '~/utils/methods/common/encoder'
import { customFileInterface } from '~/utils/methods/fastify/fastifyPlugin'

interface PostProps {
  title: string
  userId: string
  img: customFileInterface
}

export const createPost = async (body: PostProps) => {
  const { title, userId, img } = body
  const data: { title: string; userId: string; imgUrl?: string } = {
    title,
    userId,
  }

  if (img && typeof img !== 'string') {
    try {
      const filePath = `posts/${encodeFilename(img.filename, 'png')}`
      await uploadFile(img, filePath)
      data.imgUrl = `download/${filePath}`
    } catch (err) {
      console.log(err)
      throw new InvalidInputError('input `type` must be THUMBNAIL or MEDIA')
    }
  }

  const post = await prisma.post.create({
    data,
    select: {
      postId: true,
    },
  })
  return post
}

export const findPostByPostId = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      postId,
    },
  })
  return post
}

interface FindManyPostProps {
  skip?: number
  take?: number
  title?: string
}

export const findManyPosts = async (query: FindManyPostProps) => {
  const { skip, take, title } = query
  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
      skip,
      take,
    }),
    prisma.post.count({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
    }),
  ])
  return { data, total }
}

interface UpdatePostProps {
  title?: string
  img?: customFileInterface
}

export const updatePost = async (postId: string, body: UpdatePostProps) => {
  const { img, title } = body
  const data: any = { title }
  if (img && typeof img !== 'string') {
    try {
      const filePath = `profiles/${encodeFilename(img.filename, 'png')}`
      await uploadFile(img, filePath)
      data.imgUrl = `download/${filePath}`
    } catch (err) {
      console.log(err)
      throw new InvalidInputError('input `type` must be THUMBNAIL or MEDIA')
    }
  }
  await prisma.post.update({
    where: {
      postId,
    },
    data,
    select: {
      postId: true,
    },
  })
}

export const deletePost = async (postId: string) => {
  await prisma.post.delete({
    where: {
      postId,
    },
  })
}
