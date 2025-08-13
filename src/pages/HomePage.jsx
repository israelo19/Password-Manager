import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Users, ArrowRight } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['secure', 'protected', 'encrypted', 'safe'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'Your passwords are encrypted with military-grade AES encryption before being stored.',
    },
    {
      icon: Eye,
      title: 'Zero Knowledge',
      description: 'We never see your passwords. Only you have access to your encrypted data.',
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Each user gets their own secure vault with individual encryption keys.',
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      description: 'Built with security best practices including rate limiting and CSRF protection.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-mono">
              A{' '}
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-primary-500"
              >
                {words[currentWord]}
              </motion.span>
              <br />
              password manager
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Store, generate, and manage your passwords with military-grade encryption.
              Your security is our priority.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                to="/login"
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose SecureVault?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built with cutting-edge security technologies to keep your digital life safe.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300 transform hover:scale-105"
              >
                <feature.icon className="h-12 w-12 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Tips Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-r from-primary-900/30 to-blue-900/30 rounded-2xl p-8 border border-primary-500/30"
          >
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-primary-500 mr-3" />
              <h3 className="text-2xl font-bold text-white">Security Tips</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-semibold text-white mb-2">✓ Use unique passwords</h4>
                <p>Never reuse passwords across different services.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">✓ Enable 2FA everywhere</h4>
                <p>Add an extra layer of security to your accounts.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">✓ Regular security audits</h4>
                <p>Review and update your passwords regularly.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">✓ Strong master password</h4>
                <p>Your master password should be long and complex.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
