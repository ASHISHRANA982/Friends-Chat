import React from 'react'
import './style/defaultChatView.css'

const DefaultChatView = ({ name }) => {
  return (
    <main id='mainDefaultChatView'>

      <section className="defaultChatViewSection">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"></path></svg>

        <div>
          <p className='defaultChatText1'>Welcome, {name}</p>
          <p className='defaultChatText2'>select a friend from the list to start chatting</p>
        </div>

       <div>

          <div className='defaultChatLine'>
            <span></span>
            <p></p>
            <span></span>
          </div>

         <p className='defaultChatText3'>Good conversations bring people closer <span>🙂</span></p>
       </div>

      </section>

    </main>
  )
}

export default DefaultChatView