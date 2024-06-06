import { Location } from "./location";

export interface LocationItemProps {
    location: Location;
    open: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
}