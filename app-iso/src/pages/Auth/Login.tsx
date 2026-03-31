import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo">
            <ShieldCheck size={40} />
          </div>
          <h1 className="gradient-text">ISO Management</h1>
          <p className="subtitle">Hệ thống Quản lý Tài liệu Nội bộ</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label><Mail size={16} /> Email</label>
            <input 
              type="email" 
              placeholder="user@phuongnam.vn" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> Mật khẩu</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Đang xác thực...' : <><LogIn size={18} /> Đăng nhập</>}
          </button>
        </form>

        <div className="auth-footer">
          <p>© 2026 PhuongNam Group. Security First.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
