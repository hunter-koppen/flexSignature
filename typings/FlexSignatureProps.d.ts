/**
 * This file was generated from FlexSignature.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { DynamicValue, EditableValue } from "mendix";
import { Big } from "big.js";

export interface FlexSignatureContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    imageData: EditableValue<string>;
    hasSigned?: EditableValue<boolean>;
    canvasWidth: string;
    canvasHeight: string;
    penColor?: DynamicValue<string>;
    penWidth?: DynamicValue<Big>;
    backgroundColor?: DynamicValue<string>;
}

export interface FlexSignaturePreviewProps {
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    imageData: string;
    hasSigned: string;
    onSaveSignature: {} | null;
    canvasWidth: string;
    canvasHeight: string;
    penColor: string;
    penWidth: string;
    backgroundColor: string;
}
