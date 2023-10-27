import React from 'react'
import './Icon.css'

type IconProps = {
    icon: string
    onClick?: () => void,
    style?: any
    disableHover?: boolean
    className?: string
}

export const IconRef = React.forwardRef((props: IconProps, ref: React.RefObject<any>) => {
    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <img
                className={`icon-img ${props.className}`}
                style={props.disableHover ? { backgroundColor: 'unset' } : props.style}
                src={props.icon}
                onClick={props.onClick}
            />
        </div>
    )
})

export function Icon(props: IconProps) {
    return (
        <div style={{ position: 'relative' }}>
            <img
                className={`icon-img ${props.className}`}
                style={props.disableHover ? { backgroundColor: 'unset' } : props.style}
                src={props.icon}
                onClick={props.onClick}
            />
        </div>
    )
}