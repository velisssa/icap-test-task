'use client'
import "./table.scss"
import {useEffect, useState} from "react";
import {Button, Pagination} from "@mui/material";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import {useGetTableQuery} from "../../redux/features/table.api";
import {useRouter} from "next/navigation";
import {useActions} from "../../hooks/actions";

const Table = () => {
    const LIMIT = 10;
    const [offset, setOffset] = useState(0)
    const [pageNumber, setPageNumber] = useState(1);
    const { data: table, refetch } = useGetTableQuery([String(LIMIT), String(offset)], { refetchOnMountOrArgChange: true });

    let countOfPages = table ? table?.count && Math.ceil(table?.count / LIMIT) : 0;
    const [existUser, setExistRow] = useState((typeof window !== 'undefined') && localStorage.getItem('user') || null)
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false)
    const [currentRow, setCurrentRow] = useState(null)
    const {clearLoginResult} = useActions();

    const handlePageChange = (event, value) => {
        setPageNumber(value);
        refetch(LIMIT, String(LIMIT * (value) - LIMIT) );
        setOffset(LIMIT * (value) - LIMIT)
    }

    const handleClearLoginResult = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
        clearLoginResult();
        setExistRow((typeof window !== 'undefined') && localStorage.getItem('user'));
    }

    const handleOpenModal = () => {
        setOpenModal(true);
    }

    const handleOpenEditModal = (cell) => {
        setOpenModal(true)
        setCurrentRow(cell)
    }

    useEffect(() => {
        if (!existUser) router.push('/')
    }, [existUser]);

    return (
        <main className='table'>
            {existUser && table?.count
                ? <>
                    <div className='table__top'>
                        <h1 className='table__title'>Table</h1>
                        <Button variant="outlined" onClick={() => handleOpenModal()}>ADD</Button>
                        <Button variant="outlined" onClick={() => handleClearLoginResult()}>Logout</Button>
                    </div>

                    <table className='table__body'>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Birthday date</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Phone number</th>
                            <th>Buttons</th>
                        </tr>
                        </thead>

                        <tbody>
                        {table && table?.results.map((cell) => (
                            <tr key={cell.id}>
                                <td>{cell.id}</td>
                                <td>{cell.name}</td>
                                <td>{cell.birthday_date}</td>
                                <td>{cell.email}</td>
                                <td>{cell.address}</td>
                                <td>{cell.phone_number}</td>
                                <td>
                                    <div className='table__buttons'>
                                        <Button variant="outlined"
                                                onClick={() => handleOpenEditModal(cell)}>Edit</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {countOfPages > 1 &&
                    (<Pagination
                        className=' pagination'
                        count={countOfPages}
                        size="large"
                        page={pageNumber}
                        onChange={handlePageChange}
                    />)
                    }
                </>
                : <Loader/>
            }
            {openModal && (
                <Modal
                    setOpenModal={setOpenModal}
                    currentRow={currentRow}
                    setCurrentRow={setCurrentRow}
                />
            )}
        </main>
    )
};
export default Table;