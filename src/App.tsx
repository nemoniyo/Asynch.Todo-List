import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, deleteTodo, editTodo, fetchTodos, toggleStatus, fetchTodoById } from "./reducers/todoslice";
import { CircleCheck, Edit, Info, Trash } from "lucide-react";
import { Drawer, Carousel, Tooltip } from "antd"
import { Field, Form, Formik } from "formik";

export default function App() {
    const { data, selectedTodo } = useSelector((state: RootState) => state.todo);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<any>(null);
    const [addingTodo, setAddingTodo] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        dispatch(fetchTodos() as any);
    }, [dispatch]);

    const filteredData = data.filter((u: any) => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all"
                ? true
                : statusFilter === "active"
                    ? u.isCompleted
                    : !u.isCompleted;
        return matchesSearch && matchesStatus;
    });

    const showDrawer = (id: number) => {
        dispatch(fetchTodoById(id) as any);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };

    return (<>
        <div className="p-[25px]">
            <div className="mx-[5px] my-[10px] flex gap-[20px]">
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-[250px] border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-700" />
                <Tooltip title="Select status">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded px-3 py-2">
                        <option value="all" className="text-[black]">All</option>
                        <option value="active" className="text-[black]">Active</option>
                        <option value="inactive" className="text-[black]">Inactive</option>
                    </select>
                </Tooltip>
                <Tooltip title="Add user button">
                    <button onClick={() => setAddingTodo(true)} className="w-[120px] h-[40px] text-[whitesmoke] text-[18px] font-[500] bg-[transparent] border-[1px] rounded hover:text-[black] hover:bg-[whitesmoke] hover:rounded-xl transition-all duration-700">Add User</button>
                </Tooltip>
            </div>
            <Table>
                <TableCaption className="text-[16px] font-[600]">A table users with @nemoniyo!</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-[20px] text-[hitesmoke]">id</TableHead>
                        <TableHead className="text-[whitesmoke]">Avatar</TableHead>
                        <TableHead className="text-[whitesmoke]">Users</TableHead>
                        <TableHead className="text-[whitesmoke]">Status</TableHead>
                        <TableHead className="text-[whitesmoke]">Description</TableHead>
                        <TableHead className="text-[whitesmoke]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.map((element: any) => (
                        <TableRow key={element.id}>
                            <TableCell className="font-medium">{element.id}</TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                    <Carousel afterChange={onChange} className="w-[100px] h-[100px]">
                                        {element.images?.map((img: any) => (
                                            <div key={img.id} className="">
                                                <img src={`http://37.27.29.18:8001/images/${img.imageName}`} alt="" className="h-[80px]" />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            </TableCell>
                            <TableCell>{element.name}</TableCell>
                            <TableCell>{element.isCompleted ? "ACTIVE" : "INACTIVE"}</TableCell>
                            <TableCell>{element.description}</TableCell>
                            <TableCell>
                                <div className="flex gap-[10px]">
                                    <Tooltip title="Delte user">
                                        <Trash className="text-[crimson]" onClick={() => dispatch(deleteTodo(element.id) as any)} />
                                    </Tooltip>
                                    <Tooltip title="Edit user ">
                                        <Edit className="text-[cornflowerblue]" onClick={() => setEditingTodo(element)} />
                                    </Tooltip>
                                    <Tooltip title="Check status user">
                                        <CircleCheck className="text-[goldenrod]" onClick={() => dispatch(toggleStatus(element.id) as any)} />
                                    </Tooltip>
                                    <Tooltip title="Info user">
                                        <Info className="text-[cadetblue]" onClick={() => showDrawer(element.id)} />
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {editingTodo && (
                <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="w-[350px] h-[280px] rounded border-[1px] shadow-lg bg-[white] p-[25px] text-[black]">
                        <h2 className="text-[28px] font-[600]">Edit Todo</h2>
                        <Formik
                            initialValues={{
                                name: editingTodo.name,
                                description: editingTodo.description,
                                isCompleted: editingTodo.isCompleted,
                            }}
                            onSubmit={(values) => {
                                dispatch(editTodo({ id: editingTodo.id, updatedTodo: values }) as any);
                                setEditingTodo(null);
                            }}
                        >
                            {() => (
                                <Form>
                                    <div className="text-[18px] flex flex-col gap-2">
                                        <Field name="name" placeholder="Name" />
                                        <Field name="description" placeholder="Description" />
                                    </div>
                                    <div className="flex flex-col gap-[5px] mt-[10px]">
                                        <button type="submit" className="w-full h-[40px] bg-[#121212] rounded text-[whitesmoke] hover:opacity-50">Save</button>
                                        <button type="button" className="w-full h-[40px] bg-gray-300 rounded text-[whitesmoke]" onClick={() => setEditingTodo(null)}>Cancel</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            {addingTodo && (
                <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="w-[350px] h-[300px] rounded border-[1px] shadow-lg bg-[white] p-[25px] text-[black]">
                        <h2 className="text-[28px] font-[600]">Add Todo</h2>
                        <Formik
                            initialValues={{ name: "", description: "", isCompleted: false, image: null }}
                            onSubmit={(values: any) => {
                                const formData = new FormData();
                                formData.append("name", values.name);
                                formData.append("description", values.description);
                                formData.append("isCompleted", values.isCompleted ? "true" : "false");
                                if (values.image) {
                                    formData.append("image", values.image);
                                }
                                dispatch(addTodo(formData) as any);
                                setAddingTodo(false);
                            }}
                        >
                            {({ setFieldValue }) => (
                                <Form>
                                    <div className="text-[18px] flex flex-col gap-2">
                                        <Field name="name" placeholder="Name" />
                                        <Field name="description" placeholder="Description" />
                                        <input type="file" onChange={(e: any) => setFieldValue("image", e.currentTarget.files[0])} />
                                    </div>
                                    <div className="flex flex-col gap-[5px] mt-[15px]">
                                        <button type="submit" className="w-full h-[40px] bg-[#121212] rounded text-[whitesmoke] hover:opacity-50">Save</button>
                                        <button type="button" className="w-full h-[40px] bg-gray-300 rounded text-[whitesmoke]" onClick={() => setAddingTodo(false)}>Cancel</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            <Drawer title="Info User" onClose={onClose} open={open} className="">
                {selectedTodo && (
                    <div className="">
                        <p><b>Name:</b> {selectedTodo.name}</p>
                        <p><b>Status:</b> {selectedTodo.isCompleted ? "ACTIVE" : "INACTIVE"}</p>
                        <p><b>Description:</b> {selectedTodo.description}</p>
                        <div className="flex gap-2 mt-[20px] bg-[black] justify-center p-[20px] rounded">
                            <Carousel afterChange={onChange} className="w-[250px] h-[250px]">
                                {selectedTodo.images?.map((img: any) => (
                                    <img key={img.id} src={`http://37.27.29.18:8001/images/${img.imageName}`} alt="" className="" />
                                ))}
                            </Carousel>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    </>)
}
