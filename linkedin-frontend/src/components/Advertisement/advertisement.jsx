import React from 'react'
import Card from '../Card/card'

const Advertisement = () => {
  return (
    <div className='sticky top-5'>  
      <Card padding={0}>
        <div className='relative h-25'>
          <div className='relative w-full h-22 rounded-md'>
            <img 
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2FUotKYELbOfa63pHyQGBIwYpczYdfl4JFw&s' alt='Background'
              className='w-full h-full object-cover rounded-md'/>
          </div>
          <div className='absolute top-14 left-[45%] z-10'>
            <img src='https://www.denverheadshotco.com/wp-content/uploads/2023/05/Denver-Headshot-Co-0013-SMALL.jpg' alt='Profile' className='w-12 h-12 rounded-full border-2 border-white cursor-pointer'/>
          </div>

         <div className='px-5 my-5 mx-auto'>
            <div className="text-sm font-semibold text-center">Rohit Gupta</div>
            <div className="text-sm my-3 text-center">Get the latest jobs and industry news</div>
            <div className="text-sm my-1 border-1 text-center p-2 rounded-2xl font-bold border-blue-950 text-white bg-blue-800 cursor-pointer"> Explore</div>
         </div>
        </div>
      </Card>
    </div>
  )
}

export default Advertisement