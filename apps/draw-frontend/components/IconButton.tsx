import { ReactNode } from "react"

const IconButton = ({
    onClick,
    icon,
    activated
}: {
    onClick: () => void,
    icon: ReactNode,
    activated: boolean
}) => {
    return (
        <button onClick={onClick} className={`border rounded-md p-4 hover:bg-zinc-800 duration-100 ${activated ? "bg-zinc-400 text-black" : "bg-gray-900 text-white"}`}>{icon}</button>
    )
}

export default IconButton;