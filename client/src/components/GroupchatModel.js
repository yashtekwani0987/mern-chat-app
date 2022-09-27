import { useState } from "react";
import { ChatState } from "../context/ChatProvider";

const GroupchatModel = ({ children, showAlert }) => {
  const [groupchatname, setGroupchatname] = useState("");
  const [selectedusers, setSelectedusers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchresults, setSearchresults] = useState([]);
  const { chats, setChats, user , selectedChat , setSelectedChat } = ChatState();

  const handleSearch = async (e) => {
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
  const handleSubmit = async() => {
    if(!groupchatname || !selectedusers){
         showAlert('red' , 'Please Fill the Fields')
    }
        try {
            // console.log( JSON.stringify( selectedusers.map((u)=>u._id)))
            const response = await fetch('http://localhost:5000/api/chat/groupchat',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "auth-token":JSON.parse(localStorage.getItem('token'))
                },body:JSON.stringify({name:groupchatname ,users:selectedusers.map((u)=>u._id)})
            })
            const json = await response.json()
            setChats([json , ...chats])
        } catch (error) {
            showAlert('red' , `${error.message}`)
        }
        setGroupchatname('')
        setSearchresults([])
        
  };
  const handleGroup = async(user) => {
    console.log(user)
    if (selectedusers.includes(user)) {
      showAlert("blue", "User Already Added");
    }
setSelectedusers([...selectedusers , user]);
  };
  const handleUngroup = (user)=>{
    setSelectedusers(selectedusers.filter((sel)=>sel._id!==user._id))
  }

  return (
    <div>
      <span
        type="button"
        className="
      
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        {children}
      </span>

      <div
        className="modal fade fixed top-20 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5
                className="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalLabel"
              >
                Create Group
              </h5>
              <button
                type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body relative p-4 flex flex-col">
              <input
                type="text"
                placeholder="Group Name"
                className="px-2 py-1 rounded drop-shadow my-2"
                value={groupchatname}
                onChange={(e) => setGroupchatname(e.target.value)}
              />
              <input
                type="text"
                placeholder="Add Users"
                onChange={(e) => handleSearch(e.target.value)}
                className="px-2 py-1 rounded drop-shadow my-2"
              />
              <div className="flex space-x-2 justify-start">
                {selectedusers &&
                  selectedusers.map((user) => (
                    <span className="text-sm flex items-center mx-1 inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-600 text-white rounded-full">
                      {user.name}
                      <svg
                      onClick={()=>handleUngroup(user)}
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
                  ))}
              </div>
            </div>
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
            <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
              <button
                onClick={handleSubmit}
                type="button"
                className="px-6
      py-2.5
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out
      ml-1" data-bs-dismiss="modal"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupchatModel;
