import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

function ProfilePage() {
  const {authUser, updateProfile} = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (ev) => {
    ev.preventDefault(); 
    if(!selectedImage) {
      await updateProfile({
        fullName: name,
        bio
      })
      navigate('/');
      return;
    }
    const render = new FileReader();
    render.readAsDataURL(selectedImage);
    render.onload = async () => {
      const base64Image = render.result;
      await updateProfile({
        profilePic: base64Image,
        fullName: name,
        bio
      })
      navigate('/');
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600
      flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col p-10 gap-5 flex-1'>
          <h3 className='text-lg'>Profile details</h3>

          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(ev) => setSelectedImage(ev.target.files[0])} type="file" id='avatar' accept='.png, .jpeg, .jpg' hidden/>
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon}
            className={`w-12 h-12 ${selectedImage && 'rounded-full'}`} />
            upload profile image
          </label>

          <input 
            onChange={(ev) => setName(ev.target.value)} value={name}
            type="text" 
            required placeholder='your name'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
             focus:ring-indigo-500' />

          <textarea
            onChange={(ev) => setBio(ev.target.value)} value={bio}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
             focus:ring-indigo-500'
            rows={4}
            required
            ></textarea>

            <button 
            type='submit'
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 
            rounded-full text-lg cursor-pointer'
            >
              Save
            </button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}`} 
        src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfilePage