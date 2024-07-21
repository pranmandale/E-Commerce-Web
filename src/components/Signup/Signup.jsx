import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createAccount, createSession, createDocument } from '../appwrite/Appwrite'; // Adjust the path as per your project structure
import { v4 as uuidv4 } from 'uuid';

const SignUp = ({ onClose, onLoginClick }) => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            setErrorMessage('');
            console.log('Form data:', data);
    
            // Generate a valid user ID
            const userId = uuidv4();
            console.log('Generated user ID:', userId);
    
            // Create a new user with Appwrite
            const user = await createAccount(userId, data.email, data.password, data.name);
            console.log('User created successfully:', user);
    
            // Authenticate the user
            await createSession(data.email, data.password);
            console.log('User authenticated successfully');
    
            // Add user to the "Users" collection in your Appwrite database
            // const document = await createDocument(
            //     '66937663002865511af4', // Your Database ID
            //     '6693769b002a2395408a', // Your Collection ID
            //     user.$id, // Use the user ID generated by Appwrite as the document ID
            //     {
            //         name: data.name,
            //         email: data.email,
            //         created_at: new Date().toISOString(),
            //         updated_at: new Date().toISOString()
            //     },
            //     ['role:all'], // Read permissions
            //     ['user:' + user.$id] // Write permissions
            // );
            // console.log('Document created successfully in Users collection:', document);
    
            onClose(); // Close the signup modal upon successful registration
        } catch (error) {
            console.error('Error details:', error);
            if (error.code === 409) { // Appwrite's conflict error code
                setErrorMessage('User with this email already exists');
            } else {
                setErrorMessage('Failed to create user. Please try again later.');
            }
        }
    };
    

    const password = watch('password', '');

   

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {errorMessage && <p className="text-red-500 text-sm mb-4" aria-live="assertive">{errorMessage}</p>}
                    <div className="mb-4">
                        <label className="block mb-2 text-gray-700 dark:text-gray-300" htmlFor="name">Name</label>
                        <input
                            className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            type="text"
                            id="name"
                            {...register('name', { 
                                required: 'Name is required', 
                                maxLength: { value: 128, message: 'Name must not exceed 128 characters' } 
                                })
                            }
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1" aria-live="assertive">{errors.name.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
                        <input
                            className={`w-full px-3 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            type="email"
                            id="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: 'Invalid email address'
                                }
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1" aria-live="assertive">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                className={`w-full px-3 py-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 8 characters' },
                                    maxLength: { value: 265, message: 'Password must not exceed 265 characters' }
                                })}
                            />
                            <span
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1" aria-live="assertive">{errors.password.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-gray-700 dark:text-gray-300" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="relative">
                            <input
                                className={`w-full px-3 py-2 border rounded ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value => value === password || 'Passwords do not match'
                                })}
                            />
                            <span
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </span>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1" aria-live="assertive">{errors.confirmPassword.message}</p>}
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" type="submit" >Sign Up</button>
                    <button
                        type="button"
                        className="mt-2 w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-gray-600 dark:text-gray-400">Already have an account? <span className="text-blue-500 cursor-pointer" onClick={onLoginClick}>Log in</span></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;