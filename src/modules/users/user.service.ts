import argon2 from 'argon2'
import { z } from 'zod'
import { InvalidInputError } from '~/class/Error'
import { uploadFile } from '~/database/objectStorage'
import prisma from '~/database/prisma'
import {
  createUniqueUserSchema,
  findManyUsersSchema,
  lookupManyUsersSchema,
  updateUniqueUserSchema,
} from '~/modules/users/user.schema'
import { encodeFilename } from '~/utils/methods/common/encoder'

export const createUser = async (
  body: z.infer<typeof createUniqueUserSchema.body> & {
    isVerified?: boolean
    googleId?: string
    googleMetadata?: string
    facebookId?: string
    facebookMetadata?: string
    imgUrl?: string
  },
) => {
  const { username, password, img, ...rest } = body
  const hashedPassword = await hashPassword(password)
  const data = {
    ...rest,
    username,
    password: hashedPassword,
    isVerified: true,
  }
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
  const user = await prisma.user.create({
    data,
    select: {
      userId: true,
    },
  })
  return user
}

export const findUserByUsername = async (username: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  })
  return user
}

export const findUserByUserId = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      userId,
    },
  })
  return user
}

export const findManyUsers = async (
  query: z.infer<typeof findManyUsersSchema.querystring> & {
    deletedAt?: any
    googleId?: string
    facebookId?: string
    username?: string
  },
) => {
  const { role, skip, take, search } = query
  const where: any = { deletedAt: null }
  if (role)
    where.role = {
      in: role.split(','),
    }
  if (search) {
    where.OR = [
      {
        username: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        firstNameTH: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        lastNameTH: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        firstNameEN: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        lastNameEN: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ]
  }
  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take,
    }),
    prisma.user.count({ where }),
  ])
  return { data, total }
}

export const lookupManyUsers = async (query: z.infer<typeof lookupManyUsersSchema.querystring>) => {}

export const deleteUserByUserId = async (userId: string) => {
  await prisma.user.delete({
    where: {
      userId,
    },
  })
}

export const updateUser = async (
  userId: string,
  body: z.infer<typeof updateUniqueUserSchema.body> & {
    verifyToken?: string | null
    isVerified?: boolean
    googleId?: string
    googleMetadata?: string
    facebookId?: string
    facebookMetadata?: string
    imgUrl?: string
    password?: string
    isProfileOnBoarded?: string
  },
) => {
  const { img, password, ...res } = body
  const data: any = { ...res }
  if (password) {
    const hashedPassword = await hashPassword(password)
    data.password = hashedPassword
  }
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
  await prisma.user.update({
    where: {
      userId,
    },
    data,
    select: {
      userId: true,
    },
  })
}

export const comparePassword = async (password1: string, password2: string) => {
  return await argon2.verify(password1, password2)
}

export const hashPassword = async (password: string) => {
  return await argon2.hash(password)
}

export const findUniqueUser = async (query: { userId?: string; username?: string }) => {
  const { userId, username } = query
  if (userId) {
    return await prisma.user.findUnique({
      where: {
        userId,
      },
    })
  }
  if (username)
    return await prisma.user.findUnique({
      where: {
        username,
      },
    })

  return null
}
