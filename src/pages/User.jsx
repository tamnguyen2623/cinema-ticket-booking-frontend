import {
	ChevronDoubleDownIcon,
	ChevronDoubleUpIcon,
	MagnifyingGlassIcon,
	TicketIcon,
	TrashIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'

const User = () => {
	const { auth } = useContext(AuthContext)
	const [users, setUsers] = useState(null)
	const [editingUserId, setEditingUserId] = useState(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, SetIsDeleting] = useState(false)
	const [isAdding, setIsAdding] = useState(false);
	const [isFormVisible, setIsFormVisible] = useState(false); // Quản lý trạng thái hiển thị form

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm()

	const fetchUsers = async () => {
		try {
			const response = await axios.get('/auth/user', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			setUsers(response.data.data.filter((user) => user.role !== "admin"))
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	const handleEditClick = (user) => {
		setEditingUserId(user._id);
		reset({
			username: user.username,
			fullname: user.fullname,
			email: user.email
		});
	};

	const handleCancelEdit = () => {
		setEditingUserId(null);
		reset();
	};

	const handleUpdateUser = async (data) => {
		// console.log('Updating user with data:', data); 
		try {
			setIsUpdating(true);
			await axios.put(
				`/auth/user/${editingUserId}`,
				{
					fullname: data.fullname,
					email: data.email
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			);
			toast.success(`User info updated successfully!`, {
				position: 'top-center',
				autoClose: 2000
			});

			fetchUsers();
			setEditingUserId(null);
		} catch (error) {
			console.error('Error updating user info:', error.response?.data || error.message);

			const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
			toast.error(`Error updating user info: ${errorMessage}`, {
				position: 'top-center',
				autoClose: 2000
			});
		} finally {
			setIsUpdating(false);
		}
	};


	const handleDelete = (data) => {
		const confirmed = window.confirm(`Do you want to delete user ${data.username}?`)
		if (confirmed) {
			onDeleteUser(data)
		}
	}

	const onDeleteUser = async (data) => {
		try {
			SetIsDeleting(true)
			await axios.delete(`/auth/user/${data.id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			fetchUsers()
			toast.success(`Delete successful!`, {
				position: 'top-center',
				autoClose: 2000
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000
			})
		} finally {
			SetIsDeleting(false)
		}
	}

	const handleAddUser = async (data) => {
		try {
			setIsAdding(true);
			await axios.post(
				'/auth/user',
				{
					username: data.username,
					fullname: data.fullname,
					email: data.email,
					password: data.password
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
				
			);
			toast.success('User added successfully!', {
				position: 'top-center',
				autoClose: 2000
			});
			reset();
			fetchUsers();
		} catch (error) {
			console.error(error);
			toast.error('Error adding user', {
				position: 'top-center',
				autoClose: 2000
			});
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-2 rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<h2 className="text-3xl font-bold text-gray-900">Users</h2>
				<div>
				
					<div className="flex justify-end">

					<button
						onClick={() => setIsFormVisible(!isFormVisible)}
						className={`mb-1 rounded px-4 py-2 text-white ${isFormVisible ? 'bg-red-500' : 'bg-blue-500'
							}`}
					
					>
						{isFormVisible ? 'Close' : 'Add User'}
					</button>
					</div>

					{isFormVisible && (
						<form onSubmit={handleSubmit(handleAddUser)} className="mb-4 flex flex-col gap-1">
							<p className=" top-0 b text-start text-xl font-semibold text-black">Username:</p>

							<input
								{...register('username', { required: true })}
								className="w-full rounded border border-gray-300 px-2 py-1"
								placeholder="Username"
							/>
							<p className=" top-0 b text-start text-xl font-semibold text-black">Fullname:</p>
							<input
								{...register('fullname', { required: true })}
								className="w-full rounded border border-gray-300 px-2 py-1"
								placeholder="Fullname"
							/><p className=" top-0 b text-start text-xl font-semibold text-black">Email:</p>
							<input
								{...register('email', { required: true })}
								type="email"
								className="w-full rounded border border-gray-300 px-2 py-1"
								placeholder="Email"
							/><p className=" top-0 b text-start text-xl font-semibold text-black">Pasword:</p>
							<input
								{...register('password', { required: true })}
								type="password"
								className="w-full rounded border border-gray-300 px-2 py-1"
								placeholder="Password"
							/>
							<div className='flex justify-center'>
								<button
									type="submit"
									className="rounded bg-green-600 px-4 py-1 text-white"
									disabled={isAdding}
								>
									{isAdding ? 'Adding...' : 'Submit'}
								</button>
							</div>
							
						</form>
					)}
				</div>

				<div className="relative drop-shadow-sm">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<MagnifyingGlassIcon className="h-5 w-5 stroke-2 text-gray-500" />
					</div>
					<input type="search" className="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-gray-900" placeholder="Search user's name" {...register('search')} />
				</div>
				<div className="mt-2 grid max-h-[60vh] overflow-auto rounded-md bg-gradient-to-br from-indigo-100 to-white" style={{ gridTemplateColumns: 'repeat(3, minmax(max-content, 1fr)) max-content' }}>
					<p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">Username</p>
					<p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">Fullname</p>
					<p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">Email</p>
					<p className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-700 px-2 py-1 text-center text-xl font-semibold text-white">Action</p>
					{users?.filter((user) => user.fullname.toLowerCase().includes(watch('search')?.toLowerCase() || '')).map((user, index) => (
						<Fragment key={index}>
							{editingUserId === user._id ? (
								<>
									<div className="border-t-2 border-indigo-200 px-2 py-1">
										<input {...register('username')} className="w-full rounded border border-gray-300 px-2 py-1 bg-gray-100 cursor-not-allowed" placeholder="Username" readOnly />
									</div>
									<div className="border-t-2 border-indigo-200 px-2 py-1">
										<input {...register('fullname')} className="w-full rounded border border-gray-300 px-2 py-1" placeholder="Fullname" />
									</div>
									<div className="border-t-2 border-indigo-200 px-2 py-1">
										<input {...register('email')} className="w-full rounded border border-gray-300 px-2 py-1" placeholder="Email" />
									</div>
									<div className="flex gap-2 border-t-2 border-indigo-200 px-2 py-1">
										<button className="rounded bg-green-500 px-2 py-1 text-white" onClick={handleSubmit(handleUpdateUser)} disabled={isUpdating}>Save</button>										<button className="rounded bg-gray-500 px-2 py-1 text-white" onClick={handleCancelEdit}>Cancel</button>
									</div>
								</>
							) : (
								<>
									<div className="border-t-2 border-indigo-200 px-2 py-1">{user.username}</div>
									<div className="border-t-2 border-indigo-200 px-2 py-1">{user.fullname}</div>
									<div className="border-t-2 border-indigo-200 px-2 py-1">{user.email}</div>
									<div className="flex gap-2 border-t-2 border-indigo-200 px-2 py-1">
										<button className="rounded bg-indigo-600 px-2 py-1 text-white" onClick={() => handleEditClick(user)} disabled={isUpdating}>Update Info</button>
										<button className="rounded bg-red-600 px-2 py-1 text-white" onClick={() => handleDelete({ id: user._id, username: user.username })} disabled={isDeleting}>Delete</button>
									</div>
								</>
							)}
						</Fragment>
					))}
				</div>
			</div>
		</div>
	);
}

export default User;