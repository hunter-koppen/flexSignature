import { FlexSignaturePreviewProps } from "../typings/FlexSignatureProps";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[];
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[];
};

export type Problem = {
    property?: string;
    severity?: "error" | "warning" | "deprecation";
    message: string;
    studioMessage?: string;
    url?: string;
    studioUrl?: string;
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number;
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[];
    borders?: boolean;
    borderRadius?: number;
    backgroundColor?: string;
    borderWidth?: number;
    padding?: number;
};

type TextProps = BaseProps & {
    type: "Text";
    content: string;
    fontSize?: number;
    fontColor?: string;
    bold?: boolean;
    italic?: boolean;
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string;
    data?: string;
    property?: object;
    width?: number;
    height?: number;
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow";
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object;
    placeholder: string;
    showDataSourceHeader?: boolean;
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object;
    child: PreviewProps;
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null;
    child?: PreviewProps;
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

export function getProperties(_values: FlexSignaturePreviewProps, defaultProperties: Properties): Properties {
    return defaultProperties;
}

export function check(_values: FlexSignaturePreviewProps): Problem[] {
    const errors: Problem[] = [];
    return errors;
}

export function getPreview(): PreviewProps {
    return {
        type: "Container",
        borders: true,
        borderRadius: 4,
        borderWidth: 1,
        padding: 8,
        backgroundColor: "#FFFFFF",
        children: [
            {
                type: "Text",
                content: "Signature Pad",
                fontSize: 12,
                fontColor: "#999999",
                italic: true
            } as TextProps
        ]
    };
}

export function getCustomCaption(): string {
    return "Flex Signature";
}
