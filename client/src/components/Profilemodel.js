import React from "react";
import { ChatState } from "../context/ChatProvider";

const Profilemodel = ({user , children}) => {
  // const {user} = ChatState()
  
  return ( 
    <div>
      <button
        type="button"
        className="inline-block px-4 py-2.5 text-black font-medium hover:text-white text-xs leading-tight uppercase rounded shadow-md hover:bg-black hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
        data-bs-toggle="modal"
        data-bs-target="#exampleModalSm"
      >
        {children}
      </button>
      <div
        className="modal fade fixed top-5 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
        id="exampleModalSm"
        tabIndex="-1"
        aria-labelledby="exampleModalSmLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-sm relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5
                className="text-2xl font-medium leading-normal text-gray-800"
                id="exampleModalSmLabel"
              >
                Profile
              </h5>
              <button
                type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal"
                aria-label="Close"
              ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
            </div>
            <div className="modal-body relative p-8">
              <img src={user?.pic} alt=""  className="rounded-full"/>
              <h1 className="text-xl mt-2" >{user?.name?.toUpperCase()}</h1>
              <h1> <span className="font-bold" >E-mail</span> : {user?.email} </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilemodel;
