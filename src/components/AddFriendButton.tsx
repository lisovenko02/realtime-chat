'use client'

import React, { useState } from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// type AddFriendButtonProps = {}

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton = () => {
  const [showSuccessState, setShowSuccessState] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email })

      await axios.post('/api/friends/add', {
        email: validatedEmail,
      })

      setShowSuccessState(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('email', { message: error.message })
        return
      }

      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data })
        return
      }

      setError('email', { message: 'Something went wrong' })
    }
  }

  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by E-mail
      </label>

      <div className="mt-2 flex gap-4">
        <input
          {...register('email')}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 p-3"
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>

      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Friend request send</p>
      ) : null}
    </form>
  )
}

export default AddFriendButton
