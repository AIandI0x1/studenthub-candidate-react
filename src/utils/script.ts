import React from 'react';

interface ScriptProps {
    src: string;
    strategy?: 'lazyOnload' | 'afterInteractive' | 'beforeInteractive';
    onLoad?: () => void;
}

export const Script: React.FC<ScriptProps> = ({ src, strategy = 'lazyOnload', onLoad }) => {
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
        if (onLoad) {
        script.onload = onLoad;
        }
        return () => {
        document.body.removeChild(script);
        };
    }, [src, onLoad]);
    
    return null;
};