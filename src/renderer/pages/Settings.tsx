import React, { useCallback, useContext, useMemo } from 'react';
import Navbar from 'renderer/components/Navbar';
import { LoginContext } from '../components/Context';
import Select from 'react-select';
import { ErrorBoundary } from 'renderer/components/ErrrorBoundary';

const ipcRenderer = window.electron.ipcRenderer;

const Settings = () => {
    const { selectedPrinter, setSelectedPrinter, printers } =
        useContext(LoginContext);

    const handleChange = useCallback(
        (field: string, value: any) => {
            ipcRenderer.invoke('setSelectedPrinters', {
                ...selectedPrinter,
                [field]: value.label,
            });
            setSelectedPrinter({ ...selectedPrinter, [field]: value.label });
        },
        [selectedPrinter]
    );

    const getItemValue = useCallback(
        (label: string) => {
            return printers.find((item: any) => item.label === label)
                ? { label, value: label }
                : false;
        },
        [printers]
    );

    const options = useMemo(() => {
        return printers.map((item: any) => ({
            label: item.label,
            value: item.label,
        }));
    }, [printers]);

    return (
        <ErrorBoundary>
            <Navbar />
            <h2 className="text-center">Select Printers</h2>

            <div className="w-50 p-4">
                <label htmlFor="boxPrinter" className="h5">
                    Box label printer
                </label>
                <Select
                    value={getItemValue(selectedPrinter.boxPrinter)}
                    id="boxPrinter"
                    className="my-2"
                    onChange={(val) => handleChange('boxPrinter', val)}
                    options={options}
                />
            </div>

            <div className="w-50 mb-5 p-4">
                <label htmlFor="labelPrinter" className="h5">
                    Item label printer
                </label>
                <Select
                    value={getItemValue(selectedPrinter.labelPrinter)}
                    id="labelPrinter"
                    className="my-2"
                    onChange={(val) => handleChange('labelPrinter', val)}
                    options={options}
                />
            </div>
        </ErrorBoundary>
    );
};

export default Settings;
