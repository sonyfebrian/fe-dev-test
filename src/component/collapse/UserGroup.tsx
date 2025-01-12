import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { TreeNode } from './TreeNode'
import { IUserGroupProps } from '../../types/types'



export function UserGroup({ firstName, users, searchTerm }: IUserGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const highlightText = (text: string) => {
    if (!searchTerm) return text

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} className="bg-yellow-200">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <div className="mb-2">
      <div
        className="flex items-center cursor-pointer bg-gray-100 p-2 rounded"
        onClick={toggleExpand}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 mr-2" />
        ) : (
          <ChevronRight className="w-4 h-4 mr-2" />
        )}
        <span className="font-semibold">
          {highlightText(firstName)}
        </span>
      </div>
      {isExpanded && (
        <div className="ml-4 mt-2">
          {users.map(user => (
            <TreeNode key={user.id} data={user} searchTerm={searchTerm} />
          ))}
        </div>
      )}
    </div>
  )
}

