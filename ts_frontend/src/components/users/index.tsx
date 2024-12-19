import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {Dialog, DialogContent, DialogDescription, DialogFooter,DialogHeader,DialogTitle,DialogTrigger,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { User } from "lucide-react";
import axios from "axios";

// ? é opcional
interface AdminInformations {
  id: number;
  username: string;
  password: string;
}

export default function UserCard() {
  // Conexão Admin infos
  const [users, setUsers] = useState<AdminInformations[]>([]);
  const [error, setError] = useState<string | null>(null);

  const url = "http://localhost:5267/api/Login";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Accept: "application/json",
          },
        });
        setUsers(response.data);
      } catch (error: any) {
        setError(error.response?.data || "Erro ao carregar usuários.");
      }
    };

    fetchUsers();
  }, [url]);

  // Estados para o formulário de edição
  const [editId, setEditId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");

  // Função para Edição de user Login
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editId) return;

    try {
      const updatedUser = { username: editUsername, password: editPassword };
      await axios.put(`http://localhost:5267/api/Login/${editId}`, updatedUser, {
        headers: {
          Accept: "application/json",
        },
      });

      // Atualiza a lista de usuários localmente após o PUT
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editId ? { ...user, username: editUsername, password: editPassword } : user
        )
      );

      setEditId(null); // Fecha o diálogo
    } catch (error: any) {
      setError(error.response?.data || "Erro ao atualizar o usuário.");
    }
  };

  // Função para deletar usuário
  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`${url}/${userId}`, {
        headers: {
          Accept: "application/json",
        },
      });

      // Atualiza a lista localmente
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error: any) {
      setError(error.response?.data || "Erro ao deletar o usuário.");
    }
  };


  return (
    <div className="my-2 grid grid-cols-2 gap-4 text-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {users.map((user) => (
        <Card key={user.id} className="shrink-0 transition-colors p-4 border rounded-lg shadow-md">
          <CardContent>
            <CardHeader className="flex flex-col items-center">
              <User className="my-6" />
              <CardTitle>
                <div className="text-lg font-semibold">{user.username}</div>
              </CardTitle>
            </CardHeader>

            {/* User Information */}
            <div className="mb-6">
              <p className="text-base font-bold">User Id:</p>
              <p className="text-sm text-gray-500 mb-2">{user.id}</p>
              <p className="text-base font-bold">Senha:</p>
              <p className="text-sm text-gray-500 mb-2">{user.password.replace(/./g, "*")}</p>
            </div>

            {/* Buttons */}
            <CardFooter className="grid grid-cols-2 gap-2 ">
              {/* Editar usuários */}
              <Dialog open={editId === user.id} onOpenChange={(open) => !open && setEditId(null)}>
                <DialogTrigger asChild>
                  <Button
                    className="col-span-1"
                    onClick={() => {
                      setEditId(user.id);
                      setEditUsername(user.username);
                      setEditPassword(user.password);
                    }}
                  >
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Usuário</DialogTitle>
                    <DialogDescription>Editar informações do usuário</DialogDescription>
                  </DialogHeader>

                  <form className="grid grid-cols-4 items-center text-left gap-2" onSubmit={handleEditSubmit}>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Digite seu novo Username"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="col-span-3"
                    />

                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      placeholder="Digite sua nova Senha"
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="col-span-3"
                    />

                    <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0 col-span-4">
                      <Button type="submit">Salvar</Button>
                      <DialogClose asChild>
                        <Button type="button" variant="destructive" onClick={() => setEditId(null)}>
                          Cancelar
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Deletar usuários */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="col-span-1">
                    Deletar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deletar conta</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja deletar permanentemente o usuário?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Sim
                    </Button>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Não
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </CardContent>
        </Card>
      ))}
      {error && <div className="text-red-500 col-span-5">{error}</div>}
    </div>
  );
}
