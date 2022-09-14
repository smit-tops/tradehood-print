import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import Context from './components/Context';
const container = document.getElementById('root')!;
const root = createRoot(container);
import * as Sentry from "@sentry/electron";
import { Integrations } from '@sentry/tracing';
import { ErrorBoundary } from './components/ErrrorBoundary';

if (process.env.NODE_ENV !== 'development') {
    window.electron.ipcRenderer.invoke("getSentry").then(data => {
        Sentry.init({
            dsn: data.dns,
            integrations: [
                new Integrations.BrowserTracing(),
                // This will give ability to see correct path in the dev tools
            ],
            tracesSampleRate: 1.0,
        });
    })
}

root.render(
    <Context>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </Context>
);
