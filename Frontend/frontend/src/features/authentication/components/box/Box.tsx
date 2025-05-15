import type { ReactNode } from "react";
import classes from "./Box.module.scss";

interface BoxProps {
    children: ReactNode;
    className?: string;
}

export function Box({ children, className }: BoxProps) {
    return (
        <div className={`${classes.root} ${className || ""}`}>
            {children}
        </div>
    );
}