import { useState, useEffect } from 'react';
import { Plus, Search, Eye, EyeOff, Edit, Trash2, Copy, ExternalLink, Shield } from 'lucide-react';
import { passwordAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const DashboardPage = () => {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const data = await passwordAPI.getAll();
      setPasswords(data.passwords);
    } catch (error) {
      toast.error(error.error || 'Failed to fetch passwords');
    } finally {
      setLoading(false);
    }
  };

  const filteredPasswords = passwords.filter(password =>
    password.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (password.username && password.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddPassword = async (passwordData) => {
    try {
      await passwordAPI.create(passwordData);
      toast.success('Password added successfully');
      fetchPasswords();
      setShowAddModal(false);
    } catch (error) {
      toast.error(error.error || 'Failed to add password');
    }
  };

  const handleEditPassword = async (passwordData) => {
    try {
      await passwordAPI.update(selectedPassword.id, passwordData);
      toast.success('Password updated successfully');
      fetchPasswords();
      setShowEditModal(false);
      setSelectedPassword(null);
    } catch (error) {
      toast.error(error.error || 'Failed to update password');
    }
  };

  const handleDeletePassword = async (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      try {
        await passwordAPI.delete(id);
        toast.success('Password deleted successfully');
        fetchPasswords();
      } catch (error) {
        toast.error(error.error || 'Failed to delete password');
      }
    }
  };

  const handleViewPassword = async (id) => {
    try {
      const data = await passwordAPI.getById(id);
      setSelectedPassword(data);
      setShowPasswordModal(true);
    } catch (error) {
      toast.error(error.error || 'Failed to fetch password');
    }
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-400">
            You have {passwords.length} passwords stored securely.
          </p>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Password</span>
          </button>
        </motion.div>

        {/* Security Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-primary-900/30 to-blue-900/30 rounded-xl p-6 border border-primary-500/30 mb-8"
        >
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-primary-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">Security Tips</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>• Use unique passwords for every account</div>
            <div>• Enable two-factor authentication</div>
            <div>• Update passwords regularly</div>
            <div>• Never share your master password</div>
          </div>
        </motion.div>

        {/* Passwords Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {filteredPasswords.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">
                {searchTerm ? 'No passwords found' : 'No passwords yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Add your first password to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Add Your First Password
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPasswords.map((password, index) => (
                <motion.div
                  key={password.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {password.site_name}
                      </h3>
                      {password.username && (
                        <p className="text-gray-400 text-sm">{password.username}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPassword(password.id)}
                        className="text-gray-400 hover:text-primary-500 transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPassword(password);
                          setShowEditModal(true);
                        }}
                        className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePassword(password.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {password.url && (
                    <a
                      href={password.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-500 hover:text-primary-400 text-sm mb-2"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit Site
                    </a>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Added {new Date(password.created_at).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <PasswordModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddPassword}
            title="Add New Password"
          />
        )}
        
        {showEditModal && selectedPassword && (
          <PasswordModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedPassword(null);
            }}
            onSubmit={handleEditPassword}
            title="Edit Password"
            initialData={selectedPassword}
          />
        )}
        
        {showPasswordModal && selectedPassword && (
          <ViewPasswordModal
            isOpen={showPasswordModal}
            onClose={() => {
              setShowPasswordModal(false);
              setSelectedPassword(null);
            }}
            password={selectedPassword}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Password Modal Component
const PasswordModal = ({ isOpen, onClose, onSubmit, title, initialData = null }) => {
  const [formData, setFormData] = useState({
    site_name: initialData?.site_name || '',
    username: initialData?.username || '',
    password: '',
    url: initialData?.url || '',
    notes: initialData?.notes || '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.site_name || !formData.password) {
      toast.error('Site name and password are required');
      return;
    }
    onSubmit(formData);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site Name *
            </label>
            <input
              type="text"
              value={formData.site_name}
              onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Gmail, GitHub"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username/Email
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="username or email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 pr-20 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter password"
                required
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={generatePassword}
              className="text-xs text-primary-500 hover:text-primary-400 mt-1"
            >
              Generate strong password
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Additional notes"
              rows="3"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              {initialData ? 'Update' : 'Add'} Password
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// View Password Modal Component
const ViewPasswordModal = ({ isOpen, onClose, password }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-6">{password.site_name}</h2>
        
        <div className="space-y-4">
          {password.username && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username/Email
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={password.username}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <CopyToClipboard
                  text={password.username}
                  onCopy={() => toast.success('Username copied!')}
                >
                  <button className="text-gray-400 hover:text-white">
                    <Copy className="h-4 w-4" />
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="flex items-center space-x-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password.password}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <CopyToClipboard
                text={password.password}
                onCopy={() => toast.success('Password copied!')}
              >
                <button className="text-gray-400 hover:text-white">
                  <Copy className="h-4 w-4" />
                </button>
              </CopyToClipboard>
            </div>
          </div>
          
          {password.url && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={password.url}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <a
                  href={password.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
          
          {password.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={password.notes}
                readOnly
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                rows="3"
              />
            </div>
          )}
          
          <div className="text-xs text-gray-500 pt-4">
            Created: {new Date(password.created_at).toLocaleString()}
            {password.updated_at !== password.created_at && (
              <>
                <br />
                Updated: {new Date(password.updated_at).toLocaleString()}
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
