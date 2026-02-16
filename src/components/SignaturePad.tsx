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

    // Clear the canvas when the value is emptied externally (e.g. via a Mendix nanoflow)
    useEffect(() => {
        const sigCanvas = sigCanvasRef.current;
        if (sigCanvas && !currentValue) {
            sigCanvas.clear();
        }
    }, [currentValue]);

    const handleEnd = useCallback(() => {
        const sigCanvas = sigCanvasRef.current;
        if (sigCanvas && !sigCanvas.isEmpty()) {
            const dataUrl = sigCanvas.getTrimmedCanvas().toDataURL("image/png");
            onSave(dataUrl);
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
        </div>
    );
}
