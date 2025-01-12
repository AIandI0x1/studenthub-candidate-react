export function Backdrop({ onClick }: { onClick: any | undefined | null }) {
    return (
        <div onClick={onClick}  className="w-full h-full fixed start-0 top-0 bg-[#0f0f2c]/50"></div>
    )
}