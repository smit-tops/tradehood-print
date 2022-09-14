import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { PieChart } from 'react-minimal-pie-chart';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Navbar from 'renderer/components/Navbar';

import { usePrinter } from 'hooks/usePrinter';
import { ErrorBoundary } from 'renderer/components/ErrrorBoundary';

function Printer() {

    const {
        loading,
        handlePrint,
        handleStop,
        isPrinting,
        start,
        reportStats,
        availableLabels,
        percent
    } = usePrinter()

    return (
        <ErrorBoundary>
            <div>
                <Navbar />
                <div className="w-25 mx-auto my-5">
                    {!start ? (
                        <button onClick={loading ? () => { } : handlePrint} className="btn btn-success w-100">
                            {loading ? <div className="spinner-border spinner-border-sm text-light" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                                : <><i className="fa fa-print"></i> Start Printing</>
                            }
                        </button>
                    ) : (
                        <>
                            <button onClick={handleStop} className="btn btn-danger w-100">
                                {availableLabels > 0
                                    ? <><i className="fa fa-times"></i> Stop Printing</>
                                    : <><i className="fa fa-times"></i> Stop Waiting</>}
                            </button>
                            {availableLabels <= 0 &&
                                <div className='text-center'>
                                    <div className="spinner-border spinner-border-sm text-dark" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div> Waiting for new labels...
                                </div>
                            }
                        </>
                    )}
                    {isPrinting && (
                        <div className="w-50 mx-auto my-3 h-25">
                            <CircularProgressbar value={percent} text={`${percent}%`} />
                        </div>
                    )}
                    <div className="my-5" style={{ height: '20vh' }}>
                        {(reportStats.success > 0 || reportStats.failed > 0) && (
                            <>
                                <h4 className='text-center'>Printer Analysis</h4>
                                <PieChart
                                    data={[
                                        {
                                            title: 'Printed',
                                            value: reportStats.success,
                                            color: '#228B22',
                                        },
                                        {
                                            title: 'Failed',
                                            value: reportStats.failed,
                                            color: '#FF0000',
                                        },
                                    ]}
                                    label={({ dataEntry }) => `${dataEntry.value}`}
                                    radius={PieChart.defaultProps.radius - 6}
                                    lineWidth={60}
                                    segmentsStyle={{
                                        transition: 'stroke .3s',
                                        cursor: 'pointer',
                                    }}
                                    animate
                                    labelPosition={100 - 60 / 2}
                                    labelStyle={{
                                        fill: '#fff',
                                        opacity: 0.75,
                                        pointerEvents: 'none',
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
                {/* <center>
<div className="footer">
<h5 mt="5">Version 1.0.4</h5>
</div>
</center> */}
            </div>
        </ErrorBoundary >
    );
}

export default Printer;
