import { Trash } from 'lucide-react'
import React from 'react'

const Bin = ({ id , handler } : { id: string , handler: (id: string) => void }) => {
  return (
    <div className='absolute top-1 right-1 rounded-full hover:bg-red-100 p-1 cursor-pointer opacity-0 bin transition-opacity duration-300' onClick={() => handler(id)}>
      <Trash className="w-4.5 h-4.5 text-red-600" />
    </div>
  )
}

export default Bin
