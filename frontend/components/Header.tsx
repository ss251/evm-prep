import ConnectButton from "./ConnectButton";

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <div className="text-xl font-bold">EVM Prep</div>
            <ConnectButton />
        </header>
    )
}