import React from 'react'
import './myStyle.css'
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NightlightIcon from "@mui/icons-material/Nightlight";
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ConversationItem from "./ConversationItem.jsx";
import { useState } from 'react';
function Sidebar() {
  const [conversations, setConversations] = useState([
    {
      name: "Test#1",
      lastMessage: "Hello",
      timeStamp: "today",
    },
    {
      name: "Test#2",
      lastMessage: "Hello",
      timeStamp: "today",
    },
    {
      name: "Test#3",
      lastMessage: "Hello",
      timeStamp: "today",
    }
  ]);

  return (
    <div className="sidebar-container">
      <div className="sb-header">
        <div>
          <IconButton>
            <AccountCircleIcon />
          </IconButton>
        </div>
        <div>
          <IconButton>
            <PersonAddIcon />
          </IconButton>
          <IconButton>
            <GroupAddIcon />
          </IconButton>
          <IconButton>
            <AddCircleIcon />
          </IconButton>
          <IconButton>
            <NightlightIcon />
          </IconButton>
        </div>
      </div>
      <div className="sb-search">
        <IconButton>
          <SearchIcon />
        </IconButton>

        <input placeholder='search' className='search-box'/>
      </div>
      <div className="sb-conversation">
        {
          conversations.map((conversation) => {
            return (
              <ConversationItem
                props={conversation}
              />
            );
          })
        }
      </div>
    </div>
  );
}

export default Sidebar