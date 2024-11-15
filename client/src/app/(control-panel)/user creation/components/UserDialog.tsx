import { useEffect, useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, MenuItem 
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from '../store/userCreationSlice';
import { User } from '../types/User';

const divisions = [
    'CX - CoE',
    'CX - Operations',
    'CX - Escalation',
    'CX - Charges',
    'CX-Escalations'
];

const roles = [
    'Designer',
    'Ops Manager',
    'Lead',
    'Analyst'
];

type UserDialogProps = {
    open: boolean;
    onClose: () => void;
    user?: User;
};

function UserDialog({ open, onClose, user }: UserDialogProps) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<Partial<User>>({
        email: '',
        division: '',
        role: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleSubmit = () => {
        if (user) {
            dispatch(updateUser({ ...formData, id: user.id } as User));
        } else {
            dispatch(addUser({ ...formData, id: Date.now().toString() } as User));
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogContent>
                <div className="flex flex-col gap-16 pt-16">
                    <TextField
                        label="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Division"
                        value={formData.division}
                        onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                        fullWidth
                    >
                        {divisions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        fullWidth
                    >
                        {roles.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="secondary">
                    {user ? 'Update' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserDialog;
