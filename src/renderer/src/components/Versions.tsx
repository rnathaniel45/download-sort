import { useState, useEffect } from "react";

function Versions(): React.JSX.Element {
    const [versions, setVersions] = useState({
        electron: '',
        chrome: '',
        node: ''
    });

    useEffect(() => {
        // Safely access versions
        if (window.electron?.process?.versions) {
            setVersions(window.electron.process.versions);
        }
    }, []);

    return (
        <ul className="versions">
            <li className="electron-version">Electron v{versions.electron}</li>
            <li className="chrome-version">Chromium v{versions.chrome}</li>
            <li className="node-version">Node v{versions.node}</li>
        </ul>
    );
}

export default Versions;
