import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Edit, Trash2, Key, Shield, User, Users, Activity, Settings, Eye, EyeOff } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'admin',
      fullName: 'System Administrator',
      email: 'admin@company.com',
      role: 'Super Admin',
      department: 'IT',
      status: 'Active',
      lastLogin: '2024-01-15 10:30 AM',
      loginCount: 1247,
      permissions: ['All'],
      twoFactorEnabled: true,
      passwordExpiry: '2024-06-15'
    },
    {
      id: 2,
      username: 'jsmith',
      fullName: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Accountant',
      department: 'Finance',
      status: 'Active',
      lastLogin: '2024-01-14 2:15 PM',
      loginCount: 892,
      permissions: ['Accounting', 'Reports'],
      twoFactorEnabled: false,
      passwordExpiry: '2024-04-20'
    },
    {
      id: 3,
      username: 'jdoe',
      fullName: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Sales Manager',
      department: 'Sales',
      status: 'Inactive',
      lastLogin: '2024-01-10 9:45 AM',
      loginCount: 356,
      permissions: ['Sales', 'Customers'],
      twoFactorEnabled: true,
      passwordExpiry: '2024-03-10'
    }
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access',
      permissions: ['All'],
      userCount: 1,
      isSystem: true
    },
    {
      id: 2,
      name: 'Accountant',
      description: 'Accounting and financial operations',
      permissions: ['Accounting', 'Reports', 'Banking'],
      userCount: 3,
      isSystem: false
    },
    {
      id: 3,
      name: 'Sales Manager',
      description: 'Sales and customer management',
      permissions: ['Sales', 'Customers', 'Reports'],
      userCount: 2,
      isSystem: false
    }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isRoleManagerOpen, setIsRoleManagerOpen] = useState(false);
  const [showPasswordDetails, setShowPasswordDetails] = useState(false);

  const availablePermissions = [
    'Dashboard', 'Accounting', 'Sales', 'Customers', 'Vendors', 'Banking', 
    'Reports', 'Payroll', 'Inventory', 'Company Settings', 'User Management'
  ];

  const departments = ['IT', 'Finance', 'Sales', 'HR', 'Operations', 'Marketing'];

  const handleAddUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      status: 'Active',
      lastLogin: 'Never',
      loginCount: 0,
      twoFactorEnabled: false,
      passwordExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setIsAddUserOpen(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  const resetPassword = (userId) => {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
      const user = users.find(u => u.id === userId);
      alert(`Password reset for ${user.fullName}. New password: ${newPassword}`);
    }
  };

  const enableTwoFactor = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, twoFactorEnabled: !user.twoFactorEnabled }
        : user
    ));
  };

  const getUsersNeedingPasswordReset = () => {
    const today = new Date();
    return users.filter(user => {
      const expiryDate = new Date(user.passwordExpiry);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsRoleManagerOpen(true)}
            variant="outline"
            className="flex items-center"
          >
            <Shield className="w-4 h-4 mr-2" />
            Manage Roles
          </Button>
          <Button
            onClick={() => setIsAddUserOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Security Alerts */}
      {getUsersNeedingPasswordReset().length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Key className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                {getUsersNeedingPasswordReset().length} user(s) need password reset within 7 days
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'Active').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">2FA Enabled</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.twoFactorEnabled).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Roles</p>
                <p className="text-2xl font-bold text-orange-600">{roles.length}</p>
              </div>
              <Settings className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            User Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Department</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Last Login</th>
                  <th className="text-left p-3">2FA</th>
                  <th className="text-left p-3">Password</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.fullName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={user.role === 'Super Admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-3">{user.department}</td>
                    <td className="p-3">
                      <Badge variant={user.status === 'Active' ? 'success' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm text-gray-900">{user.lastLogin}</p>
                        <p className="text-xs text-gray-600">{user.loginCount} logins</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={user.twoFactorEnabled ? 'success' : 'secondary'}>
                        {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <p className="text-gray-900">
                          Expires: {user.passwordExpiry}
                        </p>
                        <p className="text-xs text-gray-600">
                          {Math.ceil((new Date(user.passwordExpiry) - new Date()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                          className="p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetPassword(user.id)}
                          className="p-1"
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => enableTwoFactor(user.id)}
                          className="p-1"
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleUserStatus(user.id)}
                          className="p-1"
                        >
                          {user.status === 'Active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <AddUserForm onSubmit={handleAddUser} roles={roles} departments={departments} />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <EditUserForm 
              user={selectedUser} 
              onSubmit={handleUpdateUser} 
              roles={roles} 
              departments={departments}
              availablePermissions={availablePermissions}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Role Manager Dialog */}
      <Dialog open={isRoleManagerOpen} onOpenChange={setIsRoleManagerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Role Management</DialogTitle>
          </DialogHeader>
          <RoleManager roles={roles} setRoles={setRoles} availablePermissions={availablePermissions} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add User Form Component
const AddUserForm = ({ onSubmit, roles, departments }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onSubmit(formData);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: '',
      department: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <Input
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <Input
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <Input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Add User
        </Button>
      </div>
    </form>
  );
};

// Edit User Form Component
const EditUserForm = ({ user, onSubmit, roles, departments, availablePermissions }) => {
  const [formData, setFormData] = useState({
    ...user,
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <Input
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <Input
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            {roles.map(role => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Update User
        </Button>
      </div>
    </form>
  );
};

// Role Manager Component
const RoleManager = ({ roles, setRoles, availablePermissions }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const handleAddRole = () => {
    if (!newRole.name || !newRole.description) {
      alert('Please fill in all fields');
      return;
    }
    
    const role = {
      id: roles.length + 1,
      ...newRole,
      userCount: 0,
      isSystem: false
    };
    
    setRoles([...roles, role]);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Existing Roles</h3>
          <div className="space-y-2">
            {roles.map(role => (
              <div
                key={role.id}
                className={`p-3 border rounded-md cursor-pointer ${
                  selectedRole?.id === role.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{role.name}</p>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                  <Badge variant="outline">{role.userCount} users</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Add New Role</h3>
          <div className="space-y-3">
            <Input
              placeholder="Role Name"
              value={newRole.name}
              onChange={(e) => setNewRole({...newRole, name: e.target.value})}
            />
            <Input
              placeholder="Role Description"
              value={newRole.description}
              onChange={(e) => setNewRole({...newRole, description: e.target.value})}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
              <div className="grid grid-cols-2 gap-2">
                {availablePermissions.map(permission => (
                  <div key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={newRole.permissions.includes(permission)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewRole({
                            ...newRole,
                            permissions: [...newRole.permissions, permission]
                          });
                        } else {
                          setNewRole({
                            ...newRole,
                            permissions: newRole.permissions.filter(p => p !== permission)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={permission} className="text-sm text-gray-700">
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleAddRole} className="w-full">
              Add Role
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;