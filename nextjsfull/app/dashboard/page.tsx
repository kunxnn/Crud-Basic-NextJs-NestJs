'use client';
import React, { useEffect, useState } from 'react';
import {
  Container, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Pagination, Box
} from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
  user_id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'firstName' | 'lastName' | 'username'>('firstName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const limit = 5;
  const router = useRouter();

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);


  
  const fetchUsers = async (page: number) => {
    try {
      const res = await fetch(`http://localhost:3333/users?limit=${limit}&page=${page}`);
      const data = await res.json();
      setUsers(data.data);
      setTotalPages(data.lastPage);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await fetch('http://localhost:3333/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      if (res.ok && result.code === 201) {
        alert(result.message);
        setOpenAddModal(false);
        fetchUsers(currentPage);
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }

  };

  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await fetch(`http://localhost:3333/users/${selectedUser.user_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUser),
      });

      const result = await res.json();
      if (res.ok && result.code === 201) {
        alert(result.message);
        setOpenEditModal(false);
        fetchUsers(currentPage);
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบ?')) return;

    try {
      const res = await fetch(`http://localhost:3333/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await res.json();
      // console.log("result" , result);
      // console.log("res" ,res);
      if (res.ok) {
        alert(result.message);
        fetchUsers(currentPage);
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error fech');
    }
  };


  const handleLogout = async () => {
    try {
       const res = await fetch('http://localhost:3333/auth/logout', {
        method: 'POST',         
        credentials: 'include', 
      });
      router.push('/login');
      const result = await res.json();
      alert(result.message);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName} ${user.username}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const sortedUsers = filteredUsers.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });


  const handleSort = (field: 'firstName' | 'lastName' | 'username') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <TextField
          label="ค้นหา"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Box>
          <Button variant="outlined" color="error" onClick={handleLogout} sx={{ mr: 1 }}>
            Logout
          </Button>
          <Button variant="contained" onClick={() => setOpenAddModal(true)}>
            เพิ่มผู้ใช้
          </Button>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>
              <Button onClick={() => handleSort('firstName')}>ชื่อ {sortBy === 'firstName' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => handleSort('username')}>Username {sortBy === 'username' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</Button>
            </TableCell>
            <TableCell>การจัดการ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedUsers.map((user, index) => (
            <TableRow key={user.user_id}>
              <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
              <TableCell>{user.firstName} {user.lastName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => {
                  setSelectedUser(user);
                  setOpenEditModal(true);
                }}>แก้ไข</Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(user.user_id)} sx={{ ml: 1 }}>
                  ลบ
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>

      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <DialogTitle>เพิ่มผู้ใช้</DialogTitle>
        <form onSubmit={handleAddUser}>
          <DialogContent>
            <TextField fullWidth label="First Name" name="firstName" margin="dense" required />
            <TextField fullWidth label="Last Name" name="lastName" margin="dense" required />
            <TextField fullWidth label="Username" name="username" margin="dense" required />
            <TextField fullWidth label="Password" name="password" type="password" margin="dense" required />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)}>ยกเลิก</Button>
            <Button type="submit" variant="contained">บันทึก</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>แก้ไขข้อมูล</DialogTitle>
        <form onSubmit={handleEditUser}>
          <DialogContent>
            <TextField
              fullWidth label="First Name" margin="dense" name="firstName"
              value={selectedUser?.firstName || ''} onChange={(e) => setSelectedUser({ ...selectedUser!, firstName: e.target.value })}
            />
            <TextField
              fullWidth label="Last Name" margin="dense" name="lastName"
              value={selectedUser?.lastName || ''} onChange={(e) => setSelectedUser({ ...selectedUser!, lastName: e.target.value })}
            />
            <TextField
              fullWidth label="Username" margin="dense" name="username"
              value={selectedUser?.username || ''} onChange={(e) => setSelectedUser({ ...selectedUser!, username: e.target.value })}
            />
            <TextField
              fullWidth label="NewPassword" margin="dense" name="password" type="password"
              value={selectedUser?.password || ''} onChange={(e) => setSelectedUser({ ...selectedUser!, password: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)}>ยกเลิก</Button>
            <Button type="submit" variant="contained">อัปเดต</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
