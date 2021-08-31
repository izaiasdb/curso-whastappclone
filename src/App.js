import React, { useState, useEffect } from 'react';
import './App.css';

import Api from './Api';

import ChatListItem from './components/ChatListItem';
import ChatIntro from './components/ChatIntro';
import ChatWindow from './components/ChatWindow';
import NewChat from './components/NewChat';
import Login from './components/Login';

import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';

export default () => {

  const [chatlist, setChatList ] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  // teste
  const [user, setUser] = useState({
    id : 'C6TX1Pcy6BMbInctSopokaLSpiF2',
    name: 'Sidnei Monteiro',
    avatar: 'https://graph.facebook.com/3496442360423339/picture',
  });
  // const [user, setUser] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(()=>{
    if(user !== null){
      let unsub = Api.onChatList(user.id, setChatList);
      return unsub;
    }
  }, [user]);

  const handleNewChat = () => {
    setShowNewChat(true);
  }

  //u.photoURL
  const handleLoginData = async (u) => {
    let newUser = {
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL
    };
    // registrar no bd
    await Api.addUser(newUser);
    setUser(newUser);
  }

  // if (user === null){}
  if(!user){
    return (<Login onReceive={handleLoginData} />);
  }

  return (
    <div className="app-window">
      
      {/* Lado esquerdo */}
      <div className="sidebar">
        <NewChat
          chatlist={chatlist}
          user={user} 
          show={showNewChat}
          setShow={setShowNewChat}
        />
        <header>
          <img className="header--avatar" src={user.avatar} alt=""/>
          <div className="header--buttons">
            <div className="header--btn">
              <DonutLargeIcon style={{color: '#919191'}}/>
            </div>
            <div onClick={handleNewChat} className="header--btn">
              <ChatIcon style={{color: '#919191'}}/>
            </div>
            <div className="header--btn">
              <MoreVertIcon style={{color: '#919191'}}/>
            </div>
          </div>
        </header>

        <div className="search">
          <div className="search--input">
            <SearchIcon fontSize="small" style={{color: '#919191'}}/>
            <input type="search" placeholder="Procurar ou começar uma nova conversa" />
          </div>
        </div>

        <div className="chatlist">          
          {chatlist.map((item, key)=>(
            <ChatListItem 
              key={key} 
              data={item}
              active={activeChat.chatId === chatlist[key].chatId}
              onClick={()=>setActiveChat(chatlist[key])}
            />          
          ))}
        </div>
      </div>

      {/* Lado direito */}
      <div className="contentarea">
        {activeChat.chatId !== undefined && 
          <ChatWindow 
            user={user}
            data={activeChat}
          />
        }
        {activeChat.chatId === undefined && 
          <ChatIntro />
        }        
      </div>
    </div>
  );
}