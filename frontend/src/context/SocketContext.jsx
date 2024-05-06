import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) {
      // No authenticated user yet, do nothing or show a loading indicator
      return;
    }

    const url = "https://chat-app-7935.onrender.com/";
    // console.log(authUser._id); 

    const socket = io.connect(url, {
      query: {
        userId: authUser._id,
      }
    })
    // const socket = io(url, {
    //   autoConnect: false ,
    //   query: {
    //     userId: authUser._id,
    //   },
    //   extraHeaders: {
    //     "Access-Control-Allow-Origin": "*",
    //   },
    // });

    // console.log(socket);

    setSocket(socket);

    // Add event listeners
    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // Clean up socket on unmount
    return () => {
      if (socket.connected) {
        socket.close();
      }
    };
  }, [authUser]);


  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
