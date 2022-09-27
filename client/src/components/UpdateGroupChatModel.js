import { useState } from "react";
import { ChatState } from "../context/ChatProvider";

const UpdateGroupChatModel = ({showAlert, children , fetchChatagain , setFetchChatagain }) => {
  const [groupchatName, setGroupchatName] = useState("");
  const [searchresults, setSearchresults] = useState([]);
  const [search, setSearch] = useState("");
  const { selectedChat, setSelectedChat, user } = ChatState();
  const handleUngroup = async(user1) => {
    console.log(user1)
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
        showAlert('yellow' , 'Only Admin can Remove')
    }
    try {
        const response = await fetch('http://localhost:5000/api/chat/removegroup',{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "auth-token":JSON.parse(localStorage.getItem('token'))
            },
            body:JSON.stringify({chatId:selectedChat._id , userId:user1._id})
        })
        const json =  await response.json()
        user1._id===user._id ? setSelectedChat():setSelectedChat(json)
        setFetchChatagain(!fetchChatagain)
    } catch (error) {
        showAlert('red' , `${error.message}`)
    }
  };
 
  const handleRename = async() => {
    if(!groupchatName){
        return
    }
    try {
         const response = await fetch('http://localhost:5000/api/chat/renamegroup',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "auth-token":JSON.parse(localStorage.getItem('token'))
            },body:JSON.stringify({chatId:selectedChat._id , chatName:groupchatName})
         })
         const json = await response.json()
         setSelectedChat(json)
         setFetchChatagain(!fetchChatagain)
        } catch (error) {
            console.log(error.message)
        }
        setGroupchatName('')
  };
 
  const handleGroup = async(user1) => {
    if(selectedChat.users.find((u)=>u._i===user1._id)){
        showAlert('red' , "User Already in group")
    }
    if(selectedChat.groupAdmin._id !== user._id){
        showAlert('red' , 'Only Admin can Add someone')
    }
    try {
        const response = await fetch('http://localhost:5000/api/chat/addgroup',{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "auth-token":JSON.parse(localStorage.getItem('token'))
            },
            body: JSON.stringify({chatId:selectedChat._id,userId:user1._id})

        })
        const json = await response.json()
        setSelectedChat(json)
        setFetchChatagain(!fetchChatagain)

    } catch (error) {
       showAlert('red' , `${error.message}`)   
    }
  };
 
  const handleSearch = async(e) => {
    setSearch(e);
    if (!e) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/searchuser?search=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": JSON.parse(localStorage.getItem("token")),
          },
        }
      );
      const json = await response.json();
      setSearchresults(json);
      console.log(json);
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <div>
<button type="button" className="px-4
      py-2.5
      bg-blue-500
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
       hover:shadow-lg
    focus:shadow-lg focus:outline-none focus:ring-0
    active:shadow-lg
      transition
      duration-150
      ease-in-out" data-bs-toggle="modal" data-bs-target="#exampleModal1">
  {children}
</button>

<div className="modal fade fixed top-20 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
  id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog relative w-auto pointer-events-none">
    <div
      className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
      <div
        className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
        <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalLabel">Update Group</h5>
        <button type="button"
          className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
          data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body relative p-4 flex flex-col items-center justify-center w-full">
             <div className="flex flex-wrap" >
                  {selectedChat.users.map((user) => (
                    <span className="text-sm mb-2 flex items-center mx-1 inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-600 text-white rounded-full">
                      {user.name}
                      <svg
                      onClick={()=>{handleUngroup(user)}}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                  ))}</div>
                  
                  <div className="flex mt-2 mx-auto justify-center w-full">
                    <input type="text" className="px-2 py-1 border w-[62%] mx-2 border-black drop-shadow" placeholder="Group Name" value={groupchatName} onChange={(e)=>setGroupchatName(e.target.value)} />
                    <button onClick={handleRename} className="btn-primary bg-blue-400 rounded mx-2 px-2 drop-shadow py-1" >Update</button>
                  </div>
                  <input
                type="text"
                placeholder="Add Users"
                onChange={(e) => handleSearch(e.target.value)}
                className="px-2 py-1 drop-shadow my-2 w-[80%] mt-4 border border-black "
              />
                  {searchresults?.slice(0, 4).map((user, key) => (
              <div
                onClick={() => handleGroup(user)}
                key={key}
                className="rounded py-1 hover:cursor-pointer hover:bg-[#0dd3ff] hover:drop-shadow-lg flex items-center bg-gray-300 rounded w-[90%] mx-auto my-1"
              >
                <div className="mx-2">
                  <img
                    className="w-[30px] rounded-full"
                    src={user.pic}
                    alt=""
                  />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <h1 className="text-xl">{user.name}</h1>
                  <h1 className="text-sm"> <span className="font-bold" >Email</span>  : {user.email}</h1>
                </div>
              </div>
            ))}
      </div>
      <div
        className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
        <button type="button" className="px-6
          py-2.5
          bg-purple-600
          text-white
          font-medium
          text-xs
          leading-tight
          uppercase
          rounded
          shadow-md
          hover:bg-purple-700 hover:shadow-lg
          focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-purple-800 active:shadow-lg
          transition
          duration-150
          ease-in-out" onClick={()=>handleUngroup(user)} data-bs-dismiss="modal">Leave Group</button>
        
      </div>
    </div>
  </div>
</div>    </div>
  );
};

export default UpdateGroupChatModel;
