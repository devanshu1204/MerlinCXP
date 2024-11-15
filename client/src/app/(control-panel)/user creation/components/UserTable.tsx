import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '@/components/data-table/DataTable';
import { User } from '../types/User';
import { deleteUser, setUsers } from '../store/userCreationSlice';
import { dummyUsers } from '../data/dummyUsers';

function UserTable() {
    const dispatch = useDispatch();
    const users = useSelector((state: { userCreation: { users: User[] } }) => state.userCreation.users);

    useEffect(() => {
        // Initialize with dummy data
        dispatch(setUsers(dummyUsers));
    }, [dispatch]);

    const columns = useMemo<MRT_ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'division',
                header: 'Division',
            },
            {
                accessorKey: 'role',
                header: 'Role',
            }
        ],
        []
    );

    const handleDelete = (id: string) => {
        dispatch(deleteUser(id));
    };

    return (
        <DataTable
            columns={columns}
            data={users}
            // onDelete={handleDelete}
        />
    );
}

export default UserTable;
