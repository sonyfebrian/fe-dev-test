

import  { useState, useEffect } from 'react'
import { SearchBar } from '../SearchBar'
import { TransferList } from './TransferList'
import { fetchUsers } from '../../utils/api'
import { IUsers } from '../../types/types'



export function TransferListView() {
  
  const [leftData, setLeftData] = useState<IUsers[]>([])
  const [rightData, setRightData] = useState<IUsers[]>([])
  const [searchTerm, setSearchTerm] = useState('')

 

  useEffect(() => {
    
      const splitUsers = async () => {
        const users = await fetchUsers({ limit: 50 })
        
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

  const handleTransfer = (from: 'left' | 'right', to: 'left' | 'right', items: IUsers[]) => {
    if (from === 'left' && to === 'right') {
      setLeftData(prev => prev.filter(user => !items.some(item => item.id === user.id)))
      setRightData(prev => [...prev, ...items])
    } else if (from === 'right' && to === 'left') {
      setRightData(prev => prev.filter(user => !items.some(item => item.id === user.id)))
      setLeftData(prev => [...prev, ...items])
    }
  }



  const filteredLeftData = filterData(leftData, searchTerm)
  const filteredRightData = filterData(rightData, searchTerm)

 

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Data Transfer List View</h1>
      <SearchBar onSearch={handleSearch} />
      <TransferList
        leftItems={filteredLeftData}
        rightItems={filteredRightData}
        onTransfer={handleTransfer}
      />
     
    </div>
  )
}

