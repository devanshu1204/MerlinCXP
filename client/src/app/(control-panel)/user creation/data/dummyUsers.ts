import { User } from '../types/User';
import { v4 as uuidv4 } from 'uuid';

export const dummyUsers: User[] = [
    {
        id: uuidv4(),
        email: 'joe.doe@company.com',
        division: 'CX - CoE',
        role: 'Designer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        email: 'jack.doe@company.com',
        division: 'CX - Operations',
        role: 'Ops Manager',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        email: 'jane.doe@company.com',
        division: 'CX - Escalation',
        role: 'Lead',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        email: 'jackie.doe@company.com',
        division: 'CX - Charges',
        role: 'Analyst',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        email: 'jocob.doe@company.com',
        division: 'CX-Escalations',
        role: 'Analyst',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
