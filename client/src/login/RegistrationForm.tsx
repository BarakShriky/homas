import React, {useState} from 'react';
import {Button, TextField} from "@radix-ui/themes";
import * as Dialog from '@radix-ui/react-dialog';


type FormFields = { [key: string]: { value: string, name: string } }
const fields: FormFields = {
    firstName: {
        value: '',
        name: 'שם פרטי'
    },
    lastName: {
        value: '',
        name: 'שם משפחה'
    },
    identityNumber: {
        value: '',
        name: 'תעודת זהות'
    },
    company: {
        value: '',
        name: 'שם החברה'
    },
    companyAddress: {
        value: '',
        name: 'כתובת החברה'
    },
    role: {
        value: '',
        name: 'תפקיד'
    },
    phone: {
        value: '',
        name: 'טלפון'
    },
    email: {
        value: '',
        name: 'אימייל'
    },
};


const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        identityNumber: '',
        company: '',
        companyAddress: '',
        role: '',
        phone: '',
        email: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
        setFormData({
            firstName: '',
            lastName: '',
            identityNumber: '',
            company: '',
            companyAddress: '',
            role: '',
            phone: '',
            email: '',
        });
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>הרשמה</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content>
                    <form onSubmit={handleSubmit}>
                        {Object.entries(fields).map(([name, data]) => (
                            <label key={data.name}>
                                {data.name.charAt(0).toUpperCase() + data.name.slice(1)}:
                                <TextField.Input
                                    variant="classic"
                                    type={name === 'email' ? 'email' : 'text'}
                                    name={name}
                                    value={data.value}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        ))}
                        <Button type='submit' color='orange' variant='soft'>התחבר</Button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default RegistrationForm;
