
import  { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { ITreeNodeProps } from '../../types/types'



export function TreeNode({ data, searchTerm, level = 0 }: ITreeNodeProps) {
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

  const renderValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return <TreeNode data={value} searchTerm={searchTerm} level={level + 1} />
    }
    return <span className="ml-2">{highlightText(String(value))}</span>
  }

  return (
    <div className={`ml-${level * 4}`}>
      {Object.entries(data).map(([key, value]) => {
        console.log(`key: ${key}, value: ${typeof value === 'object' ? 'object' : value}`)
        return (
          <div key={key} className="my-1">
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleExpand}
            >
              {typeof value === 'object' && value !== null ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-1" />
                )
              ) : (
                <span className="w-4 h-4 mr-1" />
              )}
              <span className="font-semibold">{highlightText(key)}:</span>
              {typeof value !== 'object' && renderValue(value)}
            </div>
            {typeof value === 'object' && value !== null && isExpanded && (
              <div className="ml-4">{renderValue(value)}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

