import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100">
          <h2 className="text-red-600 font-bold">خطایی در نمایش این بخش رخ داده است.</h2>
          <button 
            className="mt-4 text-sm text-blue-600 underline"
            onClick={() => window.location.reload()}
          >
            تلاش مجدد
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;