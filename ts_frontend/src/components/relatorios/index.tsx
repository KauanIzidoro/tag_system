import { PlusCircle, Search } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { DialogClose } from "@radix-ui/react-dialog";

export default function Relatorios() {
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex-1 sm:flex items-center justify-between">
                    <CardTitle className="text-lg mb-2 sm:text-xl mr-2">
                        Central de Relatórios
                    </CardTitle>
                        <form className="flex-1 sm:flex items-center gap-2">
                            <Input  className="my-2" name="id" placeholder="ID do relatório"/>
                            <Input  className="my-2" name="data" placeholder="Data" type="datetime-local"/>
                            <Input  className="my-2" name="local" placeholder="Local"/>
                            <Button className="mb-2" type="submit" variant="secondary">
                                <Search className="w-4 h-4 mr-2" />
                                Filtrar
                            </Button>
                        </form>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="mb-2 sm:ml-2">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Novo Relatório
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Novo Relatório</DialogTitle>
                                <DialogDescription>Criar um novo relatório</DialogDescription>
                            </DialogHeader>

                            <form className="space-y-6">

                                <div className="grid grid-cols-4 items-center text-left gap-2">
                                    <Label htmlFor="desc">Ocorrência</Label>
                                    <Input id="desc" name="name" placeholder="Descrição do ocorrido" className="col-span-4"/>
                                </div>

                                <div className="grid grid-cols-4 items-center text-left gap-2">
                                    <Label htmlFor="data">Data</Label>
                                    <Input id="data" type="datetime-local" placeholder="Data" className="col-span-4 sm:col-span-3"/>
                                </div>

                                <div className="grid grid-cols-4 items-center text-left gap-2">
                                    <Label htmlFor="local">Local</Label>
                                    <Input id="data" placeholder="Local/Área da ocorrência" className="col-span-4 sm:col-span-3"/>
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

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Local</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>Relatório {i + 1}</TableCell>
                            <TableCell>0{5 + i}:{1 + i}0 0{i + 1}/10/2024</TableCell>
                            <TableCell>Área de Produção (Bloco {1 + i})</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </Card>
    );
}