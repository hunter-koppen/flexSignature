import { ReactElement, createElement, useCallback } from "react";
import { SignaturePad } from "./components/SignaturePad";
import { FlexSignatureContainerProps } from "../typings/FlexSignatureProps";
import "./ui/FlexSignature.css";

export function FlexSignature(props: FlexSignatureContainerProps): ReactElement {
    const { name, tabIndex, imageData, canvasWidth, canvasHeight, penColor, penWidth, backgroundColor } = props;

    const resolvedPenColor = penColor?.status === "available" && penColor.value ? penColor.value : "#000000";
    const resolvedPenWidth = penWidth?.status === "available" && penWidth.value ? Number(penWidth.value) : 2.5;
    const resolvedBgColor =
        backgroundColor?.status === "available" && backgroundColor.value ? backgroundColor.value : "#FFFFFF";

    const isReadOnly = imageData.readOnly;

    const handleSave = useCallback(
        (dataUrl: string) => {
            if (imageData.status === "available" && !imageData.readOnly) {
                imageData.setValue(dataUrl || undefined);
            }
        },
        [imageData]
    );

    if (imageData.status !== "available") {
        return <div className="widget-flex-signature widget-flex-signature-loading" />;
    }

    return (
        <SignaturePad
            name={name}
            tabIndex={tabIndex}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            penColor={resolvedPenColor}
            penWidth={resolvedPenWidth}
            backgroundColor={resolvedBgColor}
            readOnly={isReadOnly}
            currentValue={imageData.value}
            onSave={handleSave}
        />
    );
}
