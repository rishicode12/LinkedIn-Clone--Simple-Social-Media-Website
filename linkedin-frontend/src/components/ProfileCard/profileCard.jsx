import React, { useContext } from 'react'
import Card from '../Card/card'
import { DEFAULT_AVATAR_IMAGE, DEFAULT_COVER_IMAGE, BLANK_AVATAR_IMAGE, BLANK_COVER_IMAGE } from '../../constants/userAssets'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const ProfileCard = () => {
  const { user } = useContext(AuthContext);
  
  // Use user data if available, otherwise fallback to defaults
  // For new users without uploaded images, use blank images
  const displayCoverImage = user?.coverUrl || BLANK_COVER_IMAGE;
  const displayAvatar = user?.avatarUrl || BLANK_AVATAR_IMAGE;
  const displayName = user?.name || "New User";
  const displayHeadline = user?.headline || "Add your headline";
  const displayLocation = user?.location || "Add your location";
  const displayCompany = user?.company || "Add your company";

  return (
    <Card padding={0}>
      <div className='relative h-25'>
        <div className='relative w-full h-22 rounded-md'>
          <img src={displayCoverImage} 
            alt='Background'
            className='w-full h-full object-cover rounded-md'/>
        </div>
        <div className='absolute top-14 left-6 z-10'>
          <Link to='/profile'>
            <img src={displayAvatar} alt='Profile'
              className='w-12 h-12 rounded-full border-2 border-white'/>
          </Link>
        </div>
      </div>

      <div className='p-5 pt-8'>
        <Link to='/profile' className="text-xl font-semibold hover:underline">{displayName}</Link>
        <div className="text-sm my-1">{displayHeadline}</div>
        <div className="text-sm my-1">{displayLocation}</div>
        <div className="text-sm my-1">{displayCompany}</div>
      </div>
    </Card>
  )
}

export default ProfileCard