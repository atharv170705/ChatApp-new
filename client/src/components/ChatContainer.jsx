import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { fromatMessageTime } from '../lib/utils';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useState } from 'react';
import toast from 'react-hot-toast';

function ChatContainer() {
  const {messages, sendMessage, getMessages, 
    selectedUser, setSelectedUser} = useContext(ChatContext);
  const {authUser, onlineUsers} = useContext(AuthContext);

  const [input, setInput] = useState("");

  // handle sending a message
  const handleSendMessage = async (ev) => {
      ev.preventDefault();
      if(input.trim() === "") {
        return null;
      }
      await sendMessage({text:input.trim()});
      setInput("");
  }

  // handle sending an image
  const handleSendImage = async (ev) => {
      const file = ev.target.files[0];
      if(!file || !file.type.startsWith("image/")) {
          toast.error("Select an image file");
          return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
          await sendMessage({image: reader.result});
          ev.target.value = "";
      }
      reader.readAsDataURL(file);
  }

  useEffect(() => {
    if(selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const scrollEnd = useRef();
  useEffect(() => {
    if(scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({behavior : 'smooth'});
    }
  }, [messages]);

  if (selectedUser) {
    return (
        <div className='h-full overflow-hidden relative backdrop-blur-lg'>
          <div className="flex flex-col h-full relative">
            
            {/* Header - now outside scroll area */}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500 bg-transparent z-10'>
              <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full'/>
              <p className='flex-1 text-lg text-white flex items-center gap-2'>
                {selectedUser.fullName}
                {onlineUsers.includes(selectedUser._id) && (
                  <span className='w-2 h-2 rounded-full bg-green-500'></span>
                )}
              </p>
              <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7' />
              <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5'/>
            </div>

            {/*Only this scrolls -- chat area*/}
            <div className='flex-1 overflow-y-scroll p-3'>
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-end gap-2 justify-end
                    ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                    {msg.image? (
                            <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
                        ) : (
                          <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 
                            break-all bg-violet-500/30 text-white 
                            ${msg.senderId === authUser._id  ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                              {msg.text}
                          </p>
                        )}
                        <div className='text-center text-xs'>
                          <img src={msg.senderId === authUser._id ? (authUser?.profilePic || assets.avatar_icon) : (selectedUser?.profilePic || assets.avatar_icon)} alt="" 
                          className='w-7 rounded-full'
                          />
                          <p className='text-gray-400'>{fromatMessageTime(msg.createdAt)}</p>
                        </div>
                </div>
              ))}
              <div ref={scrollEnd}></div>
            </div>

            {/* Absolute input at bottom */}
            {/* absolute bottom-0 left-0 right-0  */}
            <div className=' flex items-center gap-3 p-3 bg-black/20 backdrop-blur-lg'>
              <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                <input 
                  onChange={(ev) => setInput(ev.target.value)} 
                  value={input} 
                  onKeyDown={(ev) => ev.key === "Enter" ? handleSendMessage(ev) : null} 
                  type="text" placeholder='Send a message' 
                  className='flex-1 text-sm border-none p-3 rounded-lg outline-none text-white placeholder-gray-400' />
                <input onChange={handleSendImage} type="file" id="image" accept='image/png, image/jpeg' hidden/>
                <label htmlFor="image">
                  <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer'/>
                </label>
              </div>
              <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer'/>
            </div>

          </div>
        </div>
    )
  }

  if(!selectedUser) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} alt="" className='max-w-16' />
        <p className='text-lg text-white font-medium'>Chat anytime, anywhere</p>
      </div>
    )
  }
}

export default ChatContainer