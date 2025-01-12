

import  { useState, useEffect } from 'react'
import { UserGroup } from './UserGroup'
import { SearchBar } from '../SearchBar'
import { fetchUsers } from '../../utils/api'
import { IUsers } from '../../types/types'




export function CollapsibleTreeView() {
  
  const [leftData, setLeftData] = useState<IUsers[]>([])
  const [rightData, setRightData] = useState<IUsers[]>([])
  const [searchTerm, setSearchTerm] = useState('')


  useEffect(() => {
    const splitUsers = async () => {
      const users = await fetchUsers({ limit: 10 })
      
      setLeftData(users.slice(0, Math.floor(users.length / 2)))
      setRightData(users.slice(Math.floor(users.length / 2)))
    }

    splitUsers()
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const filterData = (data: IUsers[], term: string) => {
    return data.filter(user =>
      Object.values(user).some(value =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    )
  }


  const groupData = (data: IUsers[]) => {
    return data.reduce((acc, user) => {
      const firstName = user.firstName
      if (!acc[firstName]) {
        acc[firstName] = []
      }
      acc[firstName].push(user)
      return acc
    }, {} as Record<string, IUsers[]>)
  }

  const filteredLeftData = filterData(leftData, searchTerm)
  const filteredRightData = filterData(rightData, searchTerm)

  const groupedLeftData = groupData(filteredLeftData)
  const groupedRightData = groupData(filteredRightData)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Data Collapsible Tree View</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="mt-4 flex">
        <div className="w-1/2 pr-2">
         
          {Object.entries(groupedLeftData).map(([firstName, users]) => (
            <UserGroup
              key={firstName}
              firstName={firstName}
              users={users}
              searchTerm={searchTerm}
            />
          ))}
        </div>
        <div className="w-1/2 pl-2">
         
          {Object.entries(groupedRightData).map(([firstName, users]) => (
            <UserGroup
              key={firstName}
              firstName={firstName}
              users={users}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

