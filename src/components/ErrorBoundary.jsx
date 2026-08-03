import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  // WALI-2: metode pemulihan agar error boundary bisa di-reset tanpa logout
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    // Arahkan ke portal yang sesuai berdasarkan role
    const role = localStorage.getItem('role');
    const target = role === 'WALI' ? '/wali' : '/';
    window.location.href = target;
  };

  render() {
    if (this.state.hasError) {
      const isAuthError = this.state.error?.message?.toLowerCase().includes('access') ||
                          this.state.error?.message?.toLowerCase().includes(' forbidden') ||
                          this.state.error?.message?.toLowerCase().includes('403');
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-6">
              {isAuthError
                ? 'Terjadi kesalahan terkait izin akses. Silakan kembali ke halaman utama Anda.'
                : (this.state.error?.message || 'Terjadi kesalahan yang tidak terduga.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleGoHome}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Kembali ke Beranda
              </button>
              <button
                onClick={this.handleReset}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
