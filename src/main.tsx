import {StrictMode, Component, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminProvider } from './context/AdminContext.tsx';

class RootErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-10 font-mono flex flex-col items-center justify-center text-center">
          <h1 className="text-red-500 text-2xl mb-4 font-bold tracking-tighter uppercase italic">CRITICAL_SYSTEM_FAILURE</h1>
          <p className="text-white/40 max-w-lg mb-8 text-sm leading-relaxed">
            The neural link has encountered an unhandled exception. 
            Core protocol interrupted.
          </p>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs text-red-400/80 mb-8 max-w-xl overflow-auto text-left">
            <code>{this.state.error?.message}</code>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-neon-aqua text-neon-aqua rounded-full hover:bg-neon-aqua/10 transition-colors uppercase text-[10px] tracking-widest"
          >
            Re-initiate Link
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <AdminProvider>
        <App />
      </AdminProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
