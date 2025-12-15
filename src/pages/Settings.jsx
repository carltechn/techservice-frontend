import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { usersApi } from '../services/api';
import { Input, Button } from '../components/ui';

const Settings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState({
    first_name: user?.first_name || '',
    middle_name: user?.middle_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });
  const [passwords, setPasswords] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswords({ ...passwords, [field]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      await usersApi.update(user.id, profile);
      // Optionally refresh auth user via backend in future
      toast.success('Your profile has been updated.');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!passwords.password || passwords.password !== passwords.password_confirmation) {
      toast.error('New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await usersApi.update(user.id, passwords);
      setPasswords({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      toast.success('Your password has been updated.');
    } catch (error) {
      console.error(error);
      const message = error.errors?.current_password?.[0] || error.message || 'Failed to update password';
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
          Account Settings
        </h1>
        <p className="text-(--text-secondary)">
          Manage your profile information and password.
        </p>
      </div>

      {/* Profile info */}
      <section className="bg-(--bg-card) rounded-2xl border border-(--border-color) p-6 space-y-4">
        <h2 className="text-lg font-semibold">Profile</h2>
        <form className="space-y-4" onSubmit={handleSaveProfile}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First name"
              value={profile.first_name}
              onChange={handleProfileChange('first_name')}
              required
            />
            <Input
              label="Last name"
              value={profile.last_name}
              onChange={handleProfileChange('last_name')}
              required
            />
            <Input
              label="Middle name"
              value={profile.middle_name}
              onChange={handleProfileChange('middle_name')}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange('email')}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={savingProfile}>
              Save profile
            </Button>
          </div>
        </form>
      </section>

      {/* Password */}
      <section className="bg-(--bg-card) rounded-2xl border border-(--border-color) p-6 space-y-4">
        <h2 className="text-lg font-semibold">Change password</h2>
        <form className="space-y-4" onSubmit={handleSavePassword}>
          <Input
            label="Current password"
            type="password"
            value={passwords.current_password}
            onChange={handlePasswordChange('current_password')}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New password"
              type="password"
              value={passwords.password}
              onChange={handlePasswordChange('password')}
              required
            />
            <Input
              label="Confirm new password"
              type="password"
              value={passwords.password_confirmation}
              onChange={handlePasswordChange('password_confirmation')}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={savingPassword}>
              Update password
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Settings;


