import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { LoginContext } from '../renderer/components/Context';
import 'react-circular-progressbar/dist/styles.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { fetchPrintLabel } from '../Apis/fetchLabels';
import { updateLabelFlag } from '../Apis/updateLabelFlag';
import { Printer, PrintOptions } from 'pdf-to-printer';
import { PrinterType } from 'renderer/consts/enums';


const ipcRenderer = window.electron.ipcRenderer;
const { getPrinters } = window['pdf-to-printer'].printer;

export const usePrinter = () => {
    const {
        setPrinters,
        printers,
        setSelectedPrinter,
        selectedPrinter,
    } = useContext(LoginContext);

    const [loading, setLoading] = useState(false);
    const [percent, setPercent] = useState(0);
    const [isPrinting, setPrinting] = useState(false);
    const [start, setStart] = useState(false);
    const [reportStats, setReportStat] = useState({
        success: 0,
        failed: 0,
    });
    const [availableLabels, setAvailableLabels] = useState(1)

    const timeoutId: any = useRef(null);
    const counter = useRef(0);
    const abort = useRef(false);

    useEffect(() => {
        const fetchPrinters = async () => {
            try {
                setLoading(true);
                const fetchPrinter = await getPrinters();

                const selectedPrinters = await ipcRenderer.invoke(
                    'getSelectedPrinters'
                );
                selectedPrinters && setSelectedPrinter(selectedPrinters);

                setPrinters(
                    fetchPrinter.map((data: Printer, idx: number) => ({
                        value: idx.toString(),
                        label: data.name,
                    }))
                );

                setLoading(false);
            } catch (error: any) {
                setLoading(false);
                confirmAlert({
                    title: 'Server Error',
                    message: error,
                });
            }
        };

        fetchPrinters();
    }, []);

    const getItemValue = useCallback(
        (label: string) => {
            return printers.find((item: any) => item.label === label)
                ? { label, value: label }
                : false;
        },
        [printers]
    );

    const isPrintersSelected = useMemo(() => {
        return (
            getItemValue(selectedPrinter?.boxPrinter) &&
            getItemValue(selectedPrinter?.labelPrinter)
        );
    }, [selectedPrinter, printers]);

    const handlePrint = async () => {
        let printedLabels = [];
        abort.current = false;
        if (!isPrintersSelected) {
            return confirmAlert({
                title: 'Not Found Error',
                message: 'Printer not selected',
            });
        }
        try {
            setStart(true);
            const printLabels = await fetchPrintLabel();

            if (printLabels && printLabels.length > 0) {
                counter.current + 1
                setPrinting(true)
                setAvailableLabels(printLabels.length)
                for (let [i, printLabel] of printLabels.entries()) {
                    const printer =
                        printLabel.printer_type === PrinterType.boxPrinter
                            ? selectedPrinter?.boxPrinter
                            : selectedPrinter?.labelPrinter;
                    if (abort.current) {
                        clearTimeout(timeoutId.current)
                        setLoading(false)
                        break;
                    }
                    const { isSucceded, path } = await downloadPdf(printLabel.file_path);
                    if (isSucceded) {
                        await printPdf(path, printer);
                        printedLabels.push(printLabel.id);
                    } else {
                        reportFailed();
                    }
                    setPercent(Math.round(((i + 1) / printLabels.length) * 100));
                }

            } else {
                setAvailableLabels(0)
            }
            counter.current = printLabels?.length === 0 ? counter.current + 1 : 0;

            setPercent(0);
            setPrinting(false);
            await updateAllLables(printedLabels);
            printedLabels = [];
            clearTimeout(timeoutId.current)
            if (!abort.current) {
                timeoutId.current = setTimeout(() => handlePrint(), 5 * 1000);
            }
            if (abort.current) {
                setLoading(false)
            }
        } catch (error) {
            await updateAllLables(printedLabels);
            printedLabels = [];
            handleStop();
            confirmAlert({
                title: 'Server Error',
                message: `${error}`,
            });
            abort.current = false
            setLoading(false)
        }

        setLoading(false)
    };

    const downloadPdf = useCallback(async (path: string) => {
        return await ipcRenderer.invoke('download', {
            file: path,
        });
    }, []);

    const reportSuccess = useCallback(() => {
        setReportStat((prev) => {
            return { ...prev, success: prev.success + 1 };
        });
    }, [setReportStat, reportStats]);

    const reportFailed = useCallback(() => {
        setReportStat((prev) => {
            return { ...prev, failed: prev.failed + 1 };
        });
    }, [setReportStat, reportStats]);

    const printPdf = useCallback(async (path: string, printer: string) => {
        const printerOption: PrintOptions = {
            printer: printer,
            printDialog: false,
            monochrome: true,
            silent: false,
            scale: 'fit',
        };
        const printed = await ipcRenderer.invoke("printPdf", { path, printerOption })

        if (!printed) {
            handleStop()
            confirmAlert({
                title: 'Printer Error',
                message: `Something went wrong please try again`,
            });
        }
        reportSuccess();
    }, [reportSuccess]);

    const handleStop = useCallback(() => {
        abort.current = true;
        if (availableLabels > 0)
            setLoading(true)
        clearInterval(timeoutId.current);
        setStart(false);
        setPrinting(false);
        setPercent(0)
    }, [timeoutId.current, start, isPrinting, abort.current, percent]);

    const updateAllLables = useCallback(async (labels: any) => {

        try {
            if (labels.length > 0) {
                setLoading(true)
                await updateLabelFlag(labels);
                await ipcRenderer.invoke('deleteFolder');
            }
        } catch {
            handleStop();
            confirmAlert({
                title: 'Server Error',
                message: `Internal Server Error Try Again After some Time`,
            });
        }
        setAvailableLabels(0)
        setLoading(false)
    }, [handleStop]);

    return { loading, handlePrint, handleStop, isPrinting, start, reportStats, availableLabels, percent }
}

