// import React, {useState, useRef, useEffect} from "react"

// import { useHistory } from "react-router-dom"
// import { ChatEngine } from 'react-chat-engine'

// import { auth } from "../firebase"

// import {useAuth} from '../contexts/AuthContext'

// export default function Chats() {
//   const history = useHistory()
//   const {user} = useAuth();

//   console.log(user);
//   async function handleLogout() {
//     await auth.signOut()
//     history.push("/")
//   }

//   return (
//     <div className='chats-page'>
//       <div className='nav-bar'>
//         <div className='logo-tab'>
//           Unichat
//         </div>

//         <div onClick={handleLogout} className='logout-tab'>
//           Logout
//         </div>
//       </div>

//       <ChatEngine 
//         height='calc(100vh - 66px)'
//         projectID='361397da-9b3c-4487-83e4-e59bdcd70ba3'
//         userName='.'
//         userSecret='.'
//       />
//     </div>
//   )
// }



import React, { useRef, useState, useEffect } from "react"

import axios from 'axios'
import { useHistory } from "react-router-dom"
import { ChatEngine } from 'react-chat-engine'

import { useAuth } from "../contexts/AuthContext"

import { auth } from "../firebase"

export default function Chats() {
  const didMountRef = useRef(false)
  const [ loading, setLoading ] = useState(true)
  const { user } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    await auth.signOut()
    history.push("/")
  }

  async function getFile(url) {
    let response = await fetch(url);
    let data = await response.blob();
    return new File([data], "test.jpg", { type: 'image/jpeg' });
  }

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true

      if (!user || user === null) {
        history.push("/")
        return
      }
      
      // Get-or-Create should be in a Firebase Function
      axios.get(
        'https://api.chatengine.io/users/me/',
        { headers: { 
          "project-id": '361397da-9b3c-4487-83e4-e59bdcd70ba3',
          "user-name": user.email,
          "user-secret": user.uid
        }}
      )

      .then(() => setLoading(false))

      .catch(e => {
        let formdata = new FormData()
        formdata.append('email', user.email)
        formdata.append('username', user.email)
        formdata.append('secret', user.uid)

        getFile(user.photoURL)
        .then(avatar => {
          formdata.append('avatar', avatar, avatar.name)

          axios.post(
            'https://api.chatengine.io/users/',
            formdata,
            { headers: { "private-key": process.env.REACT_CHAT_ENGINE_KEY }}
          )
          .then(() => setLoading(false))
          .catch(e => console.log('e', e.response))
        })
      })
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    }
  }, [user, history])
  

  if (!user || loading) return <div />

  return (
    <div className='chats-page'>
      <div className='nav-bar'>
        <div className='logo-tab'>
          Unichat
        </div>

        <div onClick={handleLogout} className='logout-tab'>
          Logout
        </div>
      </div>

      <ChatEngine 
        height='calc(100vh - 66px)'
        projectID={process.env.REACT_CHAT_ENGINE_ID}
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  )
}