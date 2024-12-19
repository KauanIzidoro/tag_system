import { PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DialogClose } from "@radix-ui/react-dialog";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface UserInformations {
    id: number;
    rfid: number;
    name: string;
    role: string;
    createdBy: number;
    createdIn: string;
}

interface NewUser {
    rfid: number;
    name: string;
    role: string;
    createdBy: number;
}

export default function RegisterUserTable() {
    // Conexão Admin infos
    const [users, setUsers] = useState<UserInformations[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newUser, setNewUser] = useState<NewUser>({
        rfid: 0,
        name: "",
        role: "",
        createdBy: 0,
    });

    const url = "http://localhost:5267/api/Users";

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

    // Função para Editar usuário
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(url, {
                rfid: newUser.rfid,
                name: newUser.name,
                role: newUser.role,
                createdBy: newUser.createdBy, 
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            setUsers((prevUsers) => [...prevUsers, response.data]);
            setNewUser({rfid: 0, name: "", role: "", createdBy: 0,});
        } catch (error: any) {
            setError(error.response?.data || "Erro ao criar o usuário.");
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

    const [position, setPosition] = React.useState("bottom");

    return (
        <Card className="w-full shadow-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl mr-2">
                        Registro de Tags
                    </CardTitle>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="ml-2">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Novo usuário
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Novo usuário</DialogTitle>
                                <DialogDescription>Informe os dados necessários para registrá-lo</DialogDescription>
                            </DialogHeader>

                            <form className="space-y-6" onSubmit={handleCreateUser}>
                                <div className="grid grid-cols-4 items-center text-left gap-2">
                                    <Label htmlFor="nome">Nome</Label>
                                    <Input
                                        id="nome"
                                        name="nome"
                                        placeholder="Digite o nome do colaborador"
                                        className="col-span-3"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    />

                                    <Label htmlFor="tag">RfidTag</Label>
                                    <Input
                                        id="tag"
                                        placeholder="Digite o número da tag"
                                        className="col-span-4 sm:col-span-3"
                                        type="number"
                                        value={newUser.rfid}
                                        onChange={(e) => setNewUser({ ...newUser, rfid: parseInt(e.target.value) || 0 })}
                                    />
                                    <Label htmlFor="tag">Criado por (Id)</Label>
                                    <Input
                                        id="CreatedBy"
                                        placeholder="Digite o Id do criador"
                                        className="col-span-4 sm:col-span-3"
                                        type="number"
                                        value={newUser.createdBy}
                                        onChange={(e) => setNewUser({ ...newUser, createdBy: parseInt(e.target.value) || 0 })}
                                    />

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="col-span-4 items-center">
                                                {newUser.role || "Selecione um cargo"}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuRadioGroup
                                                value={newUser.role}
                                                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                                            >
                                                <DropdownMenuRadioItem value="Professor">Professor</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Aluno">Aluno</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="Serviços">Serviços</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
                                    <Button type="submit">Salvar</Button>
                                    <DialogClose asChild>
                                        <Button type="button" variant="destructive">Cancelar</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>

            {error && <p className="text-red-500">{error}</p>}

            <div className="max-h-[70vh] overflow-y-auto"> {/* Limite de 10 registros e rolagem */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>RfidTag</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Data de registro</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => ( // Exibe no máximo 10 usuários
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.rfid}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.createdIn}</TableCell>
                                    <TableCell>
                                    {/* Deletar usuários */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" className="col-span-1 mt-2">
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
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    Nenhum usuário encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
}
