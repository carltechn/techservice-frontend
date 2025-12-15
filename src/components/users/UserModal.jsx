import { useState, useEffect } from 'react';
import { usersApi } from '../../services/api';
import { Input, Select, Button } from '../ui';
import Dialog from '../ui/Dialog';
import { User, Mail, Lock } from 'lucide-react';

const UserModal = ({ user, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadRoles();
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        middle_name: user.middle_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        password: '',
        role_id: user.role_id || '',
      });
    }
  }, [user]);

  const loadRoles = async () => {
    try {
      const response = await usersApi.getRoles();
      setRoles(response.roles.map(r => ({ value: r.id, label: r.display_name })));
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = { ...formData };
      if (!data.password) delete data.password;
      if (!data.middle_name) delete data.middle_name;

      if (user) {
        await usersApi.update(user.id, data);
      } else {
        await usersApi.create(data);
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add New User'}
      size="md"
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            icon={User}
            required
          />
          <Input
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Middle Name"
          name="middle_name"
          value={formData.middle_name}
          onChange={handleChange}
          placeholder="Optional"
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          required
        />

        <Input
          label={user ? 'Password (leave blank to keep)' : 'Password'}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          icon={Lock}
          required={!user}
          placeholder={user ? '••••••••' : ''}
        />

        <Select
          label="Role"
          name="role_id"
          value={formData.role_id}
          onChange={handleChange}
          options={roles}
          required
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {user ? 'Update' : 'Create'} User
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default UserModal;

