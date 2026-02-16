import { ReactElement, createElement, useRef, useCallback, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

export interface SignaturePadProps {
    name: string;
    tabIndex?: number;
    canvasWidth: string;
    canvasHeight: string;
    penColor: string;
    penWidth: number;
    backgroundColor: string;
    showClearButton: boolean;
    showUndoButton: boolean;
    readOnly: boolean;
    currentValue: string | undefined;
    onSave: (dataUrl: string) => void;
}

export function SignaturePad({
    name,
    tabIndex,
    canvasWidth,
    canvasHeight,
    penColor,
    penWidth,
    backgroundColor,
    showClearButton,
    showUndoButton,
    readOnly,
    currentValue,
    onSave
}: SignaturePadProps): ReactElement {
    const sigCanvasRef = useRef<SignatureCanvas>(null);

    // Load existing signature on mount
    useEffect(() => {
        const sigCanvas = sigCanvasRef.current;
        if (sigCanvas && currentValue) {
            sigCanvas.fromDataURL(currentValue, {
                width: sigCanvas.getCanvas().width,
                height: sigCanvas.getCanvas().height
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleEnd = useCallback(() => {
        const sigCanvas = sigCanvasRef.current;
        if (sigCanvas && !sigCanvas.isEmpty()) {
            const dataUrl = sigCanvas.getTrimmedCanvas().toDataURL("image/png");
            onSave(dataUrl);
        }
    }, [onSave]);

    const handleClear = useCallback(() => {
        const sigCanvas = sigCanvasRef.current;
        if (sigCanvas) {
            sigCanvas.clear();
            onSave("");
        }
    }, [onSave]);

    const handleUndo = useCallback(() => {
        const sigCanvas = sigCanvasRef.current;
        if (sigCanvas) {
            const data = sigCanvas.toData();
            if (data.length > 0) {
                data.pop();
                sigCanvas.fromData(data);
                if (data.length === 0) {
                    onSave("");
                } else {
                    const dataUrl = sigCanvas.getTrimmedCanvas().toDataURL("image/png");
                    onSave(dataUrl);
                }
            }
        }
    }, [onSave]);

    return (
        <div className="widget-flex-signature" tabIndex={tabIndex} data-testid={name}>
            <div className="widget-flex-signature-canvas-wrapper" style={{ width: canvasWidth, height: canvasHeight }}>
                <SignatureCanvas
                    ref={sigCanvasRef}
                    penColor={penColor}
                    minWidth={penWidth * 0.5}
                    maxWidth={penWidth}
                    backgroundColor={backgroundColor}
                    canvasProps={{
                        className: "widget-flex-signature-canvas",
                        style: {
                            width: "100%",
                            height: "100%",
                            touchAction: "none"
                        }
                    }}
                    onEnd={readOnly ? undefined : handleEnd}
                    clearOnResize={false}
                />
                {readOnly && <div className="widget-flex-signature-overlay" />}
            </div>
            {!readOnly && (showClearButton || showUndoButton) && (
                <div className="widget-flex-signature-buttons">
                    {showUndoButton && (
                        <button type="button" className="btn widget-flex-signature-btn-undo" onClick={handleUndo}>
                            Undo
                        </button>
                    )}
                    {showClearButton && (
                        <button type="button" className="btn widget-flex-signature-btn-clear" onClick={handleClear}>
                            Clear
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
