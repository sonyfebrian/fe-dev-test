import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IUsers } from '../../types/types'



interface TransferListProps {
  leftItems: IUsers[]
  rightItems: IUsers[]
  onTransfer: (from: 'left' | 'right', to: 'left' | 'right', items: IUsers[]) => void
}

export function TransferList({ leftItems, rightItems, onTransfer }: TransferListProps) {
  const [leftSelected, setLeftSelected] = useState<number[]>([])
  const [rightSelected, setRightSelected] = useState<number[]>([])

  const handleTransfer = (from: 'left' | 'right', to: 'left' | 'right') => {
    const selectedItems = from === 'left' ? 
      leftItems.filter(item => leftSelected.includes(item.id)) :
      rightItems.filter(item => rightSelected.includes(item.id))
    
    onTransfer(from, to, selectedItems)
    
    if (from === 'left') {
      setLeftSelected([])
    } else {
      setRightSelected([])
    }
  }

  const renderList = (items: IUsers[], selected: number[], setSelected: React.Dispatch<React.SetStateAction<number[]>>) => (
    <div className="border rounded-md h-48 overflow-y-auto">
      {items.map(item => (
        <div key={item.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100">
          <input type="checkbox"
            checked={selected.includes(item.id)}
            onChange={(e) => {
              setSelected(prev => 
                e.target.checked ? [...prev, item.id] : prev.filter(id => id !== item.id)
              )
            }}
          />
          <span>{item.firstName} {item.lastName}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex space-x-4 my-4">
      <div className="w-1/2">
        {leftItems.length === 0 ? (
          <p className="text-center text-gray-600">Users not found</p>
        ) : (
          renderList(leftItems, leftSelected, setLeftSelected)
        )}
      </div>
      <div className="flex flex-col justify-center space-y-2">
        <button
         className="p-2 rounded-full bg-white/90 hover:bg-white transform transition-transform duration-300 hover:scale-110 shadow-lg"
          onClick={() => handleTransfer('left', 'right')}
          disabled={leftSelected.length === 0}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
         className="p-2 rounded-full bg-white/90 hover:bg-white transform transition-transform duration-300 hover:scale-110 shadow-lg"
          onClick={() => handleTransfer('right', 'left')}
          disabled={rightSelected.length === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="w-1/2">
      {rightItems.length === 0 ? (
          <p className="text-center text-gray-600">Users not found</p>
        ) : (
          renderList(rightItems, rightSelected, setRightSelected)
        )}
      
      </div>
    </div>
  )
}

