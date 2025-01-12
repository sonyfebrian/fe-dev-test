import Swal from 'sweetalert2'

export const fetchUsers = async ({ limit }: { limit: number }) => {
  try {
    const response = await fetch(`https://dummyjson.com/users?limit=${limit}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    return data.users
  } catch (error) {
    console.error(error)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'error fetch data',
    })
    throw error
  }
}

