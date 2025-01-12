import { useState } from 'react'
import { CollapsibleTreeView } from '../component/collapse/CollapseTreeView'
import { TransferListView } from '../component/Transfer List/TransferListView'
import Carousel from '../component/Carousel'
import Autocomplete from '../component/Autocomplete'
import { IUsers } from '../types/types'

const Home = () => {
  const [data, setData] = useState<IUsers[]>([]);
  const handleSelectUser = (user: IUsers) => {
    console.log('Selected user:', user);
    setData(prevData => [...prevData, user]);
    
  };
  return (
    <main className="min-h-screen bg-gradient-to-r from-violet-200 to-pink-200">
    <div className="container mx-auto py-8">
     
     <Carousel />
     <Autocomplete onSelect={handleSelectUser}/>
     <div className="border rounded-md ml-4 h-48 overflow-y-auto border-radius-md p-2 border-2 bg-gradient-to-r from-gray-100 to-gray-300  max-w-md ">
        {data.map(user => (
          <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100">
            <div className="flex flex-col">
              <span>{user.firstName} {user.lastName}</span>
              <span className="text-sm">{user.email}</span>
            </div>
            
          </div>
        ))}
    </div>
      <CollapsibleTreeView />
      <TransferListView />
    </div>
    
  </main>
  )
}

export default Home