import { Location } from "./location";

export interface LocationItemProps {
    location: Location;
    open: boolean;
    toggle: () => void;
    edit: () => void;
    remove: () => void;
}