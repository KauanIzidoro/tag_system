'use client'

import { Eye, Lock, User } from "lucide-react";
import React, {useState} from "react";
import { Button } from "../components/ui/button";
import './bganimation.css';
import Link from "next/link";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function Login() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
  
    const [error, setError] = useState("");
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!formData.username || !formData.password){
            setError("Favor preencher todos os campos!")
        }else{
            setError("")
            const url = 'http://localhost:5267/api/Login/Authenticate'
            await axios.post(
                url, formData, {
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            ).then(() =>{
                router.push('/pages/home')
                }
            ).catch((error) => {
                console.log(error);
                if (error.response?.status === 401) {
                    setError("Credenciais inválidas. Por favor, tente novamente.");
                } else {
                    setError("Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.");
                }
            });
            
        }
    }
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value}
        );
    }

    return (
        <div className="flex text-center items-center justify-center my-28">
            <div className="rounded animated-background p-10 w-full">
            <form onSubmit={handleSubmit}>
                <div className="text flex flex-col items-center">
                    <Eye className="h-8 w-8 transition-all"/>
                    <h1 className="font-semibold text-4xl">TAG System</h1>
                    <h2>Cuidando de tudo por você!</h2>
                </div>
                <div className="text flex justify-center m-3 gap-3">
                    <input                         
                        className="rounded bg-transparent focus:outline-none placeholder-white border-b-2 border-white"
                        type="text" 
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange} 
                        required
                    />
                    <User />
                </div>
                <div className="text flex justify-center m-3 gap-3">
                    <input 
                        className="rounded bg-transparent focus:outline-none placeholder-white border-b-2 border-white"
                        type="password" 
                        placeholder="Senha"
                        name="password"
                        value={formData.password}
                        onChange={handleChange} 
                        required
                    />
                    <Lock />
                </div>
                <Button className="m-3">Entrar</Button>
                {error && <div className='text-red-900'>{error}</div>}
                <div id="signup-link">
                    <p className="text">
                        Não tem conta? <a href="#" className="hover:text-blue-500">Registrar</a>
                    </p>
                </div>
            </form>
            </div>
        </div>
    );
}