import { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
    const {setCurrentUser,setUserToken} = useStateContext()
    const [data,setData] = useState({
        name:"",
        email:"",
        password:"",
        password_confirmation:""
    })

    const [errors,setErrors] = useState({__html:""})

    const onChangeInput = (e) => {
        setData({...data,[e.target.name]:e.target.value})
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({__html:""});

        axiosClient.post("/signup",data)
        .then(({data}) => {
            setCurrentUser(data.user)
            setUserToken(data.token)
        }).catch((error) =>{
            if (error.response){
                const errorsList = Object.values(error.response.data.errors).reduce((accum,next) => [...accum,...next],[])
                setErrors({__html:errorsList.join("<br>")})
            }
            console.error(error)
        });
    }
    return (
        <>
            <h2 className="mb-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Signup for free</h2>
            {errors.__html && 
            (<div className="bg-red-500 rounded py-2 px-3 text-white" dangerouslySetInnerHTML={errors}>
                </div>
            )}
            <form onSubmit={onSubmit} action="#" method="POST" className="space-y-6 mt-8">
                <div>
                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                        Full Name
                    </label>
                    <div className="mt-2">
                        <input
                            value={data.name}
                            onChange={onChangeInput}
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="Full Name"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                        Email address
                    </label>
                    <div className="mt-2">
                        <input
                            value={data.email}
                            onChange={onChangeInput}
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="Email address"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                            Password
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                            value={data.password}
                            onChange={onChangeInput}
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <div>
                        <label htmlFor="password-confirmation" className="block text-sm/6 font-medium text-gray-900">
                            Password Confirmation
                        </label>
                    <div className="mt-2">
                        <input
                            value={data.password_confirmation}
                            onChange={onChangeInput}
                            id="password-confirmation"
                            name="password_confirmation"
                            type="password"
                            required
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            placeholder="Password Confirmation"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Signup
                    </button>
                </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-500">
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Login with your account
                </Link>
            </p>
        </>
    );
}
